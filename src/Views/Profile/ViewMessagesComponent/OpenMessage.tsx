import { ArrowBack,Delete, DeleteSweep, Reply } from "@mui/icons-material"
import "./OpenMessage.css"
import { firestore } from "../../../firebase"
import { deleteDoc, doc,updateDoc } from 'firebase/firestore'
import { Button } from "@mui/material"
import { useState, useEffect } from 'react'

const OpenMessage = ({message,setCurrentView,previousView,user}:any) => {
    const  [conversation,setConversation] = useState<any>([])
    
    const deleteMessage = async () => {
        console.log(message.id)
        const messageReference = doc(firestore,'/users/' + user.uid + '/messages/' + message.id)
        try{
            await updateDoc(messageReference,{
                trashed : true
            })
            setCurrentView(previousView)
        }catch(err){
            console.error(err)
        }
    }

    const deleteMessageForever = async () => {
        const messageReference = doc(firestore,'/users/' + user.uid + '/messages/' + message.id)
        try{
            if(window.confirm("Are you sure you want to permanently delete this message? This action cannot be undone.")){
                await deleteDoc(messageReference)
                alert("Message deleted.")
                setCurrentView(previousView)
            }
        }catch(err){
            console.error(err)
        }
    }

    const replyToMessage = async (message:any) => {

    }

    return <div className="open_message">
        <div className="open_message_top_menu">
            <ArrowBack className="back_button" onClick={e=>setCurrentView(previousView)}/> 
            <span className="open_message_from_label"><img src={message.sender_data.profile_image} className="open_message_sender_image"></img><b className="sender_profile_link">{message.sender_data.username}</b></span>
            {previousView === 'trash' && <DeleteSweep className="clear_trash_button"/>}
            <Reply style={{float : 'right'}} onClick={e=>replyToMessage(message)} className="reply_button"/>

        </div>
        
        <div className="open_message_title">
            {message.title}
        </div>
        
        <div className="open_message_container">
            {message.message}
        </div>
        <div className="open_message_bottom_menu">
            {previousView !== 'trash' && <Delete className="delete_message_button" onClick={e=>deleteMessage()}/>}
            <Button color="warning" onClick={deleteMessageForever}>DELETE FOREVER</Button>
        </div>
    </div>
}

export default OpenMessage