import './VideoComments.css'
import { useState, useEffect } from 'react'
import { firestore } from '../../../../../firebase'
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { Delete } from '@mui/icons-material'

const VideoComments = ({selectedVideo,profileOwnerUid,userObject,user}) => {
    const [comments,setComments] = useState([])
    const [initialized,setInitialized] = useState(false)
    useEffect(()=>{
        let commentsUnsub = ()=>{}
        const getComments = async () => {
            setComments(selectedVideo.cmts)
            const commentsCollection = collection(firestore,'/users/' + profileOwnerUid + '/videos/' + selectedVideo.id + '/comments')
            commentsUnsub()
            commentsUnsub = onSnapshot(commentsCollection,snap=>{
                if(snap !== undefined){
                    let cmts = []
                    for(let i = 0; i < snap.docs.length; i++){
                        let currentComment = snap.docs[i].data()
                        currentComment.id = snap.docs[i].id
                        cmts.push(currentComment)
                    }
                    cmts.sort((a,b)=>b.timestamp-a.timestamp)
                    setComments(cmts)
                }
            })
        }

        // if(!initialized){
        getComments()
            // setInitialized(true)
        // }

        return ()=>{
            commentsUnsub()
        }
    },[setComments,selectedVideo])

    const deleteComment = async (comment) => {
        console.log("Deleting comment:")
        console.log(comment)
        console.log("Profile owner id: " + profileOwnerUid)
        const commentDocumentReference = doc(firestore,'/users/' + profileOwnerUid + '/videos/' + selectedVideo.id + '/comments/' + comment.id)
        const conf = window.confirm("Are you sure you want to delete the comment? This action cannot be undone.")
        if(conf){
            try{
                await deleteDoc(commentDocumentReference)
            }catch(err){
                console.error(err)    
           }
        }
    }

    return <div className="video_comments_component">
        {comments.map((comment,index)=><div className="video_comment" key={index}>
            <img className="video_comment_sender_profile_image" src={comment.sender_profile_image} width="50px" height="50px" style={{borderRadius: 50}}/> 
            <div className="video_comment_sender_username">{comment.sender_username}</div>
            <div className="video_comment_text">
                {comment.comment}
                {(profileOwnerUid === user.uid || comment.sender_id === user.uid) && <Delete style={{float: 'right'}} onClick={e=>deleteComment(comment)}/>}
            </div>
        </div>)}

        {comments.length === 0 && <div className="comments_are_empty">Be the first to comment!</div>}
    </div>
}

export default VideoComments