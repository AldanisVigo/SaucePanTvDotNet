import { ThumbUp,ThumbDown } from "@mui/icons-material"
import { doc,deleteDoc,setDoc,getDoc} from "firebase/firestore"
import { useEffect,useState } from "react"
import { firestore } from '../../../firebase'
import './SongLikeComponent.css'

const SongLikeComponent = ({song,owner,user}:any) => {
    const [dislikes,setDislikes] = useState<any>(0)
    const [likes,setLikes] = useState<any>(0)
    const [initialized,setInitialized] = useState<boolean>(false)
    const [myChoice,setMyChoice] = useState<boolean | null>(null)

    const retrieveData = async () => {
         try{
            const songDocRef = doc(firestore,'/users/' + owner + '/songs/' + song.id)
            const songSnap = await getDoc(songDocRef)
            console.log(songSnap)
            if(songSnap.data() !== undefined){
                setDislikes(songSnap.data()?.dislikes)
                setLikes(songSnap.data()?.likes)
            }

            //Like Check
            const myLikeCheckRef = doc(firestore,'/users/' + owner + '/songs/' + song.id + '/likers/' + user.uid)
            const myLikeCheckSnap = await getDoc(myLikeCheckRef)
            
            //Dislike Check
            const myDislikeCheckRef = doc(firestore,'/users/' + owner + '/songs/' + song.id + '/dislikers/' + user.uid)
            const myDislikeCheckSnap = await getDoc(myDislikeCheckRef)
            
            //Final choice logic
            if(myLikeCheckSnap.data() !== undefined){
                setMyChoice(true)
            }else if(myDislikeCheckSnap.data() !== undefined){
                setMyChoice(false)
            }else{
                setMyChoice(null)
            }
        }catch(err){
            console.error(err)
        }
    }

    useEffect(()=>{
        // let likesAndDislikesUnsub = ()=>{}
        if(!initialized){
            console.log(owner)
            console.log(song.id)
            retrieveData()
            setInterval(async ()=>{
                retrieveData()
            },1000 * 60) 
            setInitialized(true)
        }
        return ()=> {
            // likesAndDislikesUnsub()
        }
    },[initialized,setInitialized,setLikes,setDislikes,setMyChoice])


    const initiateLike = async (e:any) => {
        //Remove any dislike 
        await deleteDoc(doc(firestore,'/users/' + owner + '/songs/' + song.id + '/dislikers/' + user.uid))
        
        //Add new like
        await setDoc(doc(firestore,'/users/' + owner + '/songs/' + song.id + '/likers/' + user.uid),{
            timestamp : new Date()
        })

        setMyChoice(true)
        
        if(!isNaN(likes)){
            setLikes(likes + 1)
        }else{
            setLikes(1)
        }

        if(dislikes > 0 && !isNaN(dislikes)){
            setDislikes(dislikes - 1)
        }else{
            setDislikes(0)    
        }
    }

    const initiateDislike = async (e:any) => {
        //Remove any like 
        await deleteDoc(doc(firestore,'/users/' + owner + '/songs/' + song.id + '/likers/' + user.uid))
        
        //Add new dislike
        await setDoc(doc(firestore,'/users/' + owner + '/songs/' + song.id + '/dislikers/' + user.uid),{
            timestamp : new Date()
        })
        
        setMyChoice(false)

        if(!isNaN(dislikes)){
            setDislikes(dislikes + 1)
        }else{
            setDislikes(1)
        }
        
        if(likes > 0 && !isNaN(likes)){
            setLikes(likes - 1)
        }else{
            setLikes(0)
        }
    }

    const unDislike = async () => {
        //Remove any dislike 
        await deleteDoc(doc(firestore,'/users/' + owner + '/songs/' + song.id + '/dislikers/' + user.uid))
        setMyChoice(null)
        if(dislikes > 0 && !isNaN(dislikes))
            setDislikes(dislikes - 1)
    }

    const unLike = async () => {
        //Remove any like
        await deleteDoc(doc(firestore,'/users/' + owner + '/songs/' + song.id + '/likers/' + user.uid))
        setMyChoice(null)
        if(likes > 0 && !isNaN(likes))
            setLikes(likes - 1)
    }

    return <div className="like_dislike_container">
        <div className="dislikes">
            <ThumbDown style={{color : myChoice !== null && myChoice == false ? 'red' : 'black'}} onClick={e=>myChoice == true || myChoice == null ? initiateDislike(e) : unDislike()}/>
            <span>{dislikes}</span> 
        </div>
        <div className="likes">
            <ThumbUp style={{color : myChoice !== null && myChoice == true ? 'green' : 'black'}} onClick={e=>myChoice == false || myChoice == null ? initiateLike(e) : unLike()}/>
            <span>{likes}</span>
        </div>
    </div>
}

export default SongLikeComponent