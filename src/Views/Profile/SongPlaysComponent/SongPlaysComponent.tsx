
import { useEffect,useState } from "react"
import { firestore } from '../../../firebase'
import { getDoc, doc,collection, getDocs } from 'firebase/firestore'
import { PlayArrow } from '@mui/icons-material';
const SongPlaysComponent = ({userid,songid}:any) => {
    const [initialized,setInitialized] = useState<boolean>(false)
    const [plays,setPlays] = useState<number>(0)
    const retrievePlays = async () => {
        const playlogref = collection(firestore,'/users/' + userid + '/playlog')
        let snap = await getDocs(playlogref)
        let counter = 0;
        snap.forEach(entry=>{
            const match = entry.data().song_id == songid
            if(match){
                counter++
            }
        })
        setPlays(counter)
        let interval = setInterval(async () => {
            console.log("running")
            snap = await getDocs(playlogref)
            counter = 0;
            snap.forEach(entry=>{
                const match = entry.data().song_id == songid
                if(match){
                    counter++
                }
            })
            setPlays(counter)
        },60 * 1000) //Every 1 min
        return interval
    }

    useEffect(()=>{
        let intervalUnsub:any = null
        if(!initialized){
            intervalUnsub = retrievePlays()
            setInitialized(true)
        }

        return () => {
            clearInterval(intervalUnsub)
        }
    })

    return <div>
        <PlayArrow/> <span style={{ position : 'relative', top: -6}}>{plays}</span>
    </div>
}

export default SongPlaysComponent