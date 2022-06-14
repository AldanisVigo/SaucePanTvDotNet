
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useState ,useEffect } from 'react';
import { firestore } from '../../../firebase';
import { deleteDoc, doc,getDoc, updateDoc } from 'firebase/firestore';
import "./InboxComponent.css"
import { Inbox,AllInbox, Delete,DeleteSweep,Close } from '@mui/icons-material';
import { Badge } from '@mui/material';

import OpenMessage from './OpenMessage';
const InboxComponent = ({open,setOpen,messages,user}:any) => {
    const [inboxMessages,setInboxMessages] = useState<any>([])
    const [readMessages,setReadMessages] = useState<any>([])
    const [trashedMessages,setTrashedMessages] = useState<any>([])
    const [openMessage,setOpenMessage] = useState<any>(null)
    const [currentView,setCurrentView] = useState<any>("inbox")
    const [previousView,setPreviousView] = useState<any>("inbox")
    const handleClose = () => {
        setOpen(false)
    }

    useEffect(()=>{
        const pullMessagesData = async () => {
            
            
            try{
                //Retrieve all sender info for all messages before splitting them up into categories
                for(let s = 0; s < messages.length; s++){
                    const i = messages[s]
                    const sender_uid = i.sender
                    const senderDoc = doc(firestore,'/users/' + sender_uid)
                    const senderDocSnap = await getDoc(senderDoc)
                    const senderDocData = senderDocSnap.data()
                    i.sender_data = senderDocData
                }

                //Retrieve all inbox messages, trash messages, and read messages
                const inboxMsgs:any = messages.filter((a:any) => a.read === false || a.read === undefined)
                const readMsgs:any = messages.filter((a:any) => a.read === true && !a.trashed)
                const trashedMsgs:any = messages.filter((a:any) => a.trashed)


                //Sort into the categories
                setInboxMessages(inboxMsgs)
                setReadMessages(readMsgs)
                setTrashedMessages(trashedMsgs)
            }catch(err){
                console.error(err)
            }
        }
        pullMessagesData()
    },[messages,setInboxMessages,setReadMessages,setTrashedMessages])

    const viewMessage = async (msg:any) => {
        //Register the message as read
        console.log(msg.id)
        
        const messageReference = doc(firestore,'/users/' + user.uid + '/messages/' + msg.id)
        try{
            await updateDoc(messageReference,{
                read : true
            })
        }catch(err){
            console.error(err)
        }

        setOpenMessage(msg);
        setCurrentView('open_message')
    }

    const clearTrashPermanently = async () => {
        try{
            if(window.confirm("Are you sure you want to clear your trash can? This action cannot be undone.")){
                for(let i = 0; i < trashedMessages.length; i++){
                    const currentMessage = trashedMessages[i]
                    await deleteDoc(doc(firestore,'/users/' + user.uid + '/messages/' + currentMessage.id))
                }
                alert("Your trash has been cleared.")
            }
        }catch(err){
            console.error(err)
        }
    }

    return <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen={true}
        >
        <DialogTitle id="alert-dialog-title">
            <b>Mail</b> <Close className="mail_close_button" onClick={handleClose}/>
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description" style={{textAlign : 'center', padding: '0px', margin: '0px'}}>
                <div className="inbox">
                    <div className="inbox_menu">
                        <span style={{color : currentView === 'inbox' ? '#A513DA' : 'black'}} className="inbox_menu_action" onClick={e=>{setPreviousView('inbox'); setCurrentView('inbox');}}><AllInbox fontSize="small" className="inbox_menu_action_icon"/>Inbox ({inboxMessages.length})</span>
                        <span style={{color : currentView === 'read' ? '#A513DA' : 'black'}} className="inbox_menu_action" onClick={e=>{setPreviousView('read'); setCurrentView('read');}}><Inbox fontSize="small" className="inbox_menu_action_icon"/>Read ({readMessages.length})</span>
                        <span style={{color : currentView === 'trash' ? '#A513DA' : 'black'}} className="inbox_menu_action" onClick={e=>{setPreviousView('trash'); setCurrentView('trash');}}><Delete fontSize="small" className="inbox_menu_action_icon"/>Trash ({trashedMessages.length})</span>
                    </div>
                    {currentView === 'inbox' && <div className="incoming_messages_list">
                            {inboxMessages && inboxMessages.map((msg:any,i:any)=><div className="incoming_message" key={i} onClick={e=>viewMessage(msg)}>
                                <img src={msg.sender_data.profile_image} className="incoming_message_profile_image"/> 
                                <span className="sender_link">{msg.sender_data.username}&nbsp;:</span>
                                <span className="message_title">{msg.title}</span>
                            </div>)}
                        </div>
                    }
                    {currentView === 'inbox' && inboxMessages.length === 0 &&  <div className="incoming_messages_list"><span>No Incoming Messages</span></div>}

                    {currentView === 'read' && <div className="incoming_messages_list">
                            {readMessages && readMessages.map((msg:any,i:any)=><div className="incoming_message" key={i} onClick={e=>viewMessage(msg)}>
                                <img src={msg.sender_data.profile_image} className="incoming_message_profile_image"/> 
                                <span className="sender_link">{msg.sender_data.username}&nbsp;:</span>
                                <span className="message_title">{msg.title}</span>
                            </div>)}
                        </div>
                    }
                    {currentView === 'read' && readMessages.length === 0 &&  <div className="incoming_messages_list"><span>No Opened Messages</span></div>}

                    {currentView === 'trash' && <div className="incoming_messages_list">
                            {trashedMessages.length > 0 && <DeleteSweep className="clear_trash_button" onClick={clearTrashPermanently}/>}<br/>

                            {trashedMessages && trashedMessages.map((msg:any,i:any)=><div className="incoming_message" key={i} onClick={e=>viewMessage(msg)}>
                                <img src={msg.sender_data.profile_image} className="incoming_message_profile_image"/> 
                                <span className="sender_link">{msg.sender_data.username}&nbsp;:</span>
                                <span className="message_title">{msg.title}</span>
                            </div>)}
                        </div>
                    }
                    {currentView === 'trash' && trashedMessages.length === 0 &&  <div className="incoming_messages_list"><span>Trash is Empty</span></div>}

                    {currentView === 'open_message' && <div className="open_message_view">
                        <OpenMessage message={openMessage} previousView={previousView} setCurrentView={setCurrentView} user={user}></OpenMessage>
                    </div>}
                </div>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>
                Close
            </Button>
        </DialogActions>
    </Dialog>
}

export default InboxComponent