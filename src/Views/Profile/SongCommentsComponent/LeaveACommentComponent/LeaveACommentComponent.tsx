import { useState } from 'react'
import './LeaveACommentComponent.css'
import Picker from 'emoji-picker-react'
import { EmojiEmotions } from '@mui/icons-material'
import { firestore } from '../../../../firebase'
import { collection, addDoc,doc,updateDoc,increment } from 'firebase/firestore'

const LeaveACommentComponent = ({owner,song,user}:any) => {
    const [showComments,setShowComments] = useState<boolean>(false)
    const [comment,setComment] = useState<any>(null)
    const [showEmojis,setShowEmojis] = useState<boolean>(false)
    const onEmojiClick = (event:any, emojiObject:any) => {
        setComment(comment !== null ? comment + emojiObject.emoji : '' + emojiObject.emoji)
        setShowEmojis(false)
    };

    const leaveComment = async () => {
        // console.log("Owner: " + owner)
        // console.log("Song: " + song)
        // console.log("User: " + user.uid)
        console.log("Message: " + comment)
        console.log("From: " + user.uid)
        console.log("To: " + owner)
        console.log("For song: " + song.id)
        console.log("Timestamp : " + new Date().toString())

        const songCommentsCollectionRef = collection(firestore,'/users/' + owner + '/songs/' + song.id + '/comments')

        const newComment = {
            comment : comment,
            sender : user.uid,
            to : owner,
            songid : song.id,
            timestamp : new Date()
        }

        try{
            const leaveCommentResult = await addDoc(songCommentsCollectionRef,newComment)
            const songRef = doc(firestore,'/users/' + owner + '/songs/' + song.id)
            await updateDoc(songRef,{
                comments : increment(1)
            })
            console.log(leaveCommentResult)
            setComment('')
            // alert("Your comment was sent.")
        }catch(err){
            console.error(err)
        }
    }

    return <div className="leave_a_comment_component">
        {!showComments && <button onClick={e=>{ setShowComments(true);}}>Leave a Comment</button>}
        {showComments === true && <div className="send_comment_box">
            <h3>Leave a comment</h3>
            <div className="comment_box_and_emoji_picker">
                <textarea className="comment_textarea" placeholder='Type your comment here' onChange={e=>setComment(e.target.value)} value={comment}/>
                <div className="emoji_picker_container">
                    <EmojiEmotions onClick={e=>setShowEmojis(!showEmojis)} className="emojis_button" style={{color : showEmojis ? 'purple' : 'orange'}}/>
                    <div className="emoji_picker" style={{display: showEmojis ? 'block' : 'none'}}>
                        <Picker onEmojiClick={onEmojiClick}/>
                    </div>
                </div>
            </div>
            <button className="send_comment_button" onClick={e=>leaveComment()}>Send Comment</button>
        </div>}
    </div>
}

export default LeaveACommentComponent