import { ThumbUp } from "@mui/icons-material"
import { useEffect, useState } from 'react'
import { increment,doc,updateDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore"
import { firestore } from "../../../firebase"
const Likes = ({song,user,owner}:any)  => {
    const [myChoice,setMyChoice] = useState<any>()
    const [initialized,setInitialized] = useState<boolean>()

    useEffect(()=>{
        if(!initialized){
            // //
            // if(song.likers){
            //     if(song.likers.includes(user.uid)){
            //         setMyChoice("like")
            //     }else{
            //         setMyChoice(null)
            //     }
            // }
            const likeRef = doc(firestore,'/users/' + owner + '/songs/' + song.id + '/likers/' + user.uid)
            setTimeout(async ()=>{
                const likeSnap = await getDoc(likeRef)
                const likeData = likeSnap.data()
                if(likeData !== undefined){
                    setMyChoice('like')
                }else{
                    setMyChoice(null)
                }
            },1)
            
            setInitialized(true)
        }
    },[myChoice,setMyChoice,initialized,owner,song.id,user.uid])

    const toggleLike = async () => {
        console.log(song)
        const songRef = doc(firestore,'/users/' + owner + '/songs/' + song.id)
        const likeRef = doc(firestore,'/users/' + owner + '/songs/' + song.id + '/likers/' + user.uid)
        if(myChoice === 'like'){
            await updateDoc(songRef,{
                likes : increment(-1)
            })
            await deleteDoc(likeRef)
            setMyChoice(null)
        }else{
            await updateDoc(songRef,{
                likes : increment(1)
            })
            await setDoc(likeRef,{
                timestamp : new Date()
            })
            setMyChoice('like')
        }
    }

    return <div>
        <ThumbUp onClick={toggleLike} style={{color : myChoice === "like" ? "purple" : "black" }}/> {song.likes}
    </div>
}

export default Likes