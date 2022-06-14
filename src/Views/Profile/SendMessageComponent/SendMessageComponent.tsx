import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { firestore } from '../../../firebase';
import {collection,addDoc } from 'firebase/firestore'
import "./SendMessageComponent.css"
import { TextField } from '@mui/material'

const SendMessageComponent = ({open,setOpen,userObject,user,profileOwnerUid}:any) => {
    const [title,setTitle] = useState<any>(null)
    const [message,setMessage] = useState<any>(null)

    const handleClose = () => {
        setOpen(false)
    }

    const sendMessage = () => {
        //Check message and title are filled in
        if(title == null || message == null){
            alert("Please add a title and a message before clicking send.")
            return
        }

        //If so, send it
        try{
            const messagesCollectionRef = collection(firestore,'/users/' + profileOwnerUid + '/messages')
            addDoc(messagesCollectionRef,{
                sender:user.uid,
                title: title,
                message: message,
                timestamp : new Date()
            })
        }catch(err){
            console.error(err)
        }

        //Alert the user, clear the inputs and close the dialog
        alert("Your message was sent.")
        setMessage(null)
        setTitle(null)
        setOpen(false)
    }

    return <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            Send Message to {userObject?.username}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description" className="content" style={{textAlign : 'center'}}>
                <TextField placeholder="Title" type="text" className="message_title" onChange={e=>setTitle(e.target.value)} value={title}/>
                <TextField placeholder="Message" multiline={true} rows={8} onChange={e=>setMessage(e.target.value)} value={message}/>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>
                Cancel
            </Button>
            <Button color="error" onClick={sendMessage}>Send</Button>
        </DialogActions>
    </Dialog>
}

export default SendMessageComponent