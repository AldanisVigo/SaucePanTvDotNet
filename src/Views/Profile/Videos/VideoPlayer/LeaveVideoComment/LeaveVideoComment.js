import './LeaveVideoComment.css'
import { useState } from 'react'
import { Button } from '@mui/material'
import { firestore } from '../../../../../firebase'
import { collection, addDoc } from 'firebase/firestore'
const LeaveVideoComment = ({user,profileOwnerUid,userObject,video}) => {
    const [comment, setComment] = useState('')
    
    const leaveComment = async () => {
        console.log(userObject.username + "(" + user.uid  +") is leaving a comment for " + profileOwnerUid + " as follows: " + comment + " for video with id: " + video.id);
        const commentData = {
            timestamp : new Date(),
            sender : user.uid,
            sender_username: userObject.username,
            comment : comment,
            sender_profile_image: userObject.profile_image
        }

        const videoCommentsRef = collection(firestore,'/users/' + profileOwnerUid + '/videos/' + video.id + "/comments")
        try{
            await addDoc(videoCommentsRef,commentData)
            setComment('')
        }catch(err){
            console.error(err)
        }
    }

    return <div className="leave_video_comment">
        <textarea value={comment} className="video_comment_textarea" placeholder="Type your comment" onChange={e=>setComment(e.target.value)}></textarea>
        <Button className="video_comment_send_button" onClick={leaveComment}>Leave Comment</Button>
    </div>
}

export default LeaveVideoComment