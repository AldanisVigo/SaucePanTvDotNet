import { Delete } from "@mui/icons-material"
import LeaveACommentComponent from "./LeaveACommentComponent/LeaveACommentComponent"
import './SongCommentsComponent.css'
// import { useState } from "react"
import { firestore } from "../../../firebase"
import { doc, deleteDoc,updateDoc,increment } from 'firebase/firestore'

const SongCommentsComponent = ({song,user,owner}:any) => {
    // const [initialized,setInitialized] = useState<boolean>(false)
    // const [comments,setComments] = useState<any>([])

    // const retrieveComments = async () => {
    //     const songCommentsCollection = collection(firestore,'/users/' + owner + '/songs/' + song.id + '/comments')
    //     try{
    //         // let snap = await getDocs(songCommentsCollection)
    //         // let cmts:any = []
    //         // snap.docs.forEach(async (docmt:any)=>{
    //         //     if(docmt.data() !== undefined){
    //         //         let cmt = docmt.data()
    //         //         let sender_id = cmt.sender
    //         //         const sender_user_data_ref = doc(firestore,'/users/' + sender_id)
    //         //         const user_data:any = await getDoc(sender_user_data_ref)
    //         //         cmt.sender_profile_image = user_data.data().profile_image
    //         //         cmt.sender_username = user_data.data().username
    //         //         cmts.push(cmt)
    //         //     }
    //         // })
    //         // setComments(cmts)
    //         onSnapshot(songCommentsCollection,(snap)=>{
    //             let cmts:any = []
    //             snap.docs.forEach(async (docmt:any)=>{
    //                 if(docmt.data() !== undefined){
    //                     let cmt = docmt.data()
    //                     let sender_id = cmt.sender
    //                     const sender_user_data_ref = doc(firestore,'/users/' + sender_id)
    //                     const user_data:any = await getDoc(sender_user_data_ref)
    //                     cmt.sender_profile_image = user_data.data().profile_image
    //                     cmt.sender_username = user_data.data().username
    //                     cmts.push(cmt)
    //                 }
    //             })
    //             setComments(cmts)
    //         })

    //     }catch(err){
    //         console.error(err)
    //     }
    // }
    // useEffect(()=>{
    //     if(!initialized){
    //         // retrieveComments()
    //         setInitialized(true)
    //     }
    // },[song,comments])

    const deleteSongComment = async (comment:any) => {
        let c = window.confirm("This action cannot be undone. Are you sure you want to delete the comment forever?")
        if(c){
            const songCommentRef = doc(firestore,'/users/' + owner + '/songs/' + song.id + '/comments/' + comment.id)
            try{
                console.log(comment)
                console.log(song)
                await deleteDoc(songCommentRef)
                const songRef = doc(firestore,'/users/' + owner + '/songs/' + song.id)
                await updateDoc(songRef,{
                    comments : increment(-1)
                })
                //reloadSongComments()
            }catch(err){
                console.error(err)
            }
        }
    }

    return <div className="song_comments_component">
        <LeaveACommentComponent owner={owner} song={song} user={user}/>
        {song.cmts && song.cmts.map((comment:any,i:any)=><div key={i} className="comment">
            <img alt="comment_profile_image" className="comment_profile_image" src={comment.sender_profile_image} width="50px" height="50px"/>
            <div className="comment_content">
                <div className="comment_sender_profile_link">{comment.sender_username}</div>
                <div className="comment_text">
                    {comment.comment} {(user.uid === owner || comment.sender === user.uid) && <Delete onClick={e=>deleteSongComment(comment)} style={{float: 'right'}}/>}

                </div>
            </div>
            {/* {comment.timestamp.toString()} */}
        </div>)}
        {/* {song.comments.length === 0 && <span>Loading comments...</span>} */}
    </div>
}

export default SongCommentsComponent