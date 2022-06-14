import { firestore, auth } from '../../firebase'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { onSnapshot,doc,getDoc,collection, getDocs, addDoc } from 'firebase/firestore'
import { Button,RadioGroup,Radio,FormControlLabel,FormControl, FormLabel } from '@mui/material'
import './HostedBattle.css'
import Header from '../../Components/Header/Header'
import SignIn from '../../Components/SignIn/SignIn'
const HostedBattle = () => {
    const [user,setUser] = useState(null)
    const [battleData,setBattleData] = useState(null)
    const [initialized,setInitialized] = useState(false)
    const [hostData,setHostData] = useState(null)
    const [userSongs,setUserSongs] = useState([])
    const params = useParams()
    const [selectedSong,setSelectedSong] = useState(null)
    const [spectateOnly,setSpectateOnly] = useState(false)
    const [challengers,setChallengers] = useState([])
    const [imInTheBattle,setImInTheBattle] = useState(false)


    

    useEffect(()=>{
        const getBattleChallengers = async () => {
            const battle_challengers_collection_ref = collection(firestore,'/users/' + hostData.uid + '/battles/' + battleData.id + '/challengers')
            onSnapshot(battle_challengers_collection_ref, challengers_snapshot=>{
                let tmp_challengers = []
                for(let c = 0; c < challengers_snapshot.docs.length; c++){
                    let current_challenger_doc = challengers_snapshot.docs[c].data()
                    if(current_challenger_doc.challenger == user.uid){
                        setImInTheBattle(true)
                    }
                    current_challenger_doc.id = challengers_snapshot.docs[c].id
                    tmp_challengers.push(current_challenger_doc)
                }   
                setChallengers(tmp_challengers)
                console.log("AM I IN THE CHALLANGE:" + imInTheBattle)
                console.log("Challengers:")
                console.log(challengers)
            })
        }

        const getBattleData = async () => {
            const battle_ref = doc(firestore,'/users/' + params.id + '/battles/' + params.battleid)

            let batdoc = await getDoc(battle_ref)
            let batdat = batdoc.data()
            batdat.id = batdoc.id
            
            const hostDocRef = doc(firestore,'/users/' + params.id)
            let hdata = (await getDoc(hostDocRef)).data()
            hdata.uid = hostDocRef.id
            setHostData(hdata)
            setBattleData(batdat)
            onSnapshot(battle_ref,battle_doc_snap=>{
                let battledoc = battle_doc_snap.data()
                battledoc.id = battle_doc_snap.id
                setBattleData(battledoc)
            },(err)=>{
                console.error(err)
            },()=>{
                console.log('Retrieved battle data')
            })  

        }

        if(!initialized){
            getBattleData()
            setInitialized(true)
        }

        if(hostData && battleData){
            getBattleChallengers()
        }

        auth.onAuthStateChanged(async user=>{
            if(user){
                setUser(user)
                const songsCollectionRef = collection(firestore,'/users/' + user.uid + '/songs')
                const sngs_docs = (await getDocs(songsCollectionRef)).docs
                let tmp_sngs = []
                for(let s = 0; s < sngs_docs.length; s++){
                    const currentSong = sngs_docs[s].data()
                    currentSong.id = sngs_docs[s].id
                    tmp_sngs.push(currentSong)
                }
                setUserSongs(tmp_sngs)
            }else{
                setUser(null)
            }
        })       
    },[params,battleData,setBattleData,user,setUser])

    
    const joinBattle = async () => {
        const battleChallenger = {
            challenger : user.uid,
            song : userSongs[selectedSong].id
        }
        const battleChallengersCollection = collection(firestore,'/users/' + hostData.uid + '/battles/' + battleData.id + '/challengers')
        try{
            await addDoc(battleChallengersCollection,battleChallenger)
        }catch(err){
            console.error(err)
        }
    }


    return <div className='hosted_battle' style={{color: 'white'}}>
        <Header/>
        <div className="battle_header">
            {battleData && <img className="battle_image" src={battleData.cover}></img>}
            {battleData && <span className="battle_title">{battleData.title} hosted by {hostData.displayName}</span>}
        </div>
        <div className="battle_description">
            {battleData && <span>{battleData.description}</span>}
        </div>

        {battleData && battleData.champion && <div className="champion">
            {battleData.champion.displayName}
        </div>}
        {/* <br/> */}
        {/* {battleData && <span>Battle Description - {battleData.description}</span>} */}
        {/* <br/> */}
        {/* {hostData && hostData.email} */}
        {/* <br/> */}
        {/* {user && <span> Hosted by : {user.uid}</span>} */}
        {/* <br/> */}


        {user && hostData && user.uid !== hostData.uid && userSongs && !spectateOnly && !imInTheBattle &&  <div className="user_songs_selector" style={{background : 'white', color: 'black'}}>
            {/* <RadioGroup defaultValue={userSongs[0]}>
                {userSongs && userSongs.map((song,song_index)=><FormControlLabel key={song_index} value={song_index} control={<Radio/>} label={song.title}/>)}
            </RadioGroup> */}
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Which track do you want to put up for Battle?</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={0}
                    name="radio-buttons-group"
                    value={selectedSong}
                    onChange={e=>setSelectedSong(e.target.value)}
                >
                     {userSongs && userSongs.map((song,song_index)=><div key={song_index} className="song_battle_option">
                        <FormControlLabel value={song_index} control={<Radio />} label={song.name}/><br/>
                        <audio className="song_preview" src={song.downloadURL} controls></audio>
                    </div>)}
                </RadioGroup>
            </FormControl>
            <br/>

            {user && hostData && user.uid !== hostData.uid && selectedSong && <span>You Selected: {userSongs[selectedSong].name}</span>}
            <br/>
        </div>}
        {user && hostData && user.uid !== hostData.uid && selectedSong && !spectateOnly && !imInTheBattle && <Button className="join_battle_button" onClick={e=>joinBattle()}>Join Battle</Button>}<br/>
        {user && hostData && user.uid !== hostData.uid && !spectateOnly && !imInTheBattle && <Button className="spectate_button" onClick={e=>setSpectateOnly(true)}>Spectate And Vote Only</Button>}
        {user && hostData && user.uid !== hostData.uid && spectateOnly && !imInTheBattle && <Button className="cancel_spectate_button" onClick={e=>setSpectateOnly(false)}>Show Join Battle Menu</Button>}
        {!user && <SignIn/>}

        {user && hostData && user.uid === hostData.uid && <div className="host_controls_panel">
            You are hosting this battle.<br/>
            <Button>Cancel Battle</Button>
        </div>}
        {imInTheBattle && <div className="challenger_controls_panel">
            <span>I am in the battle</span><br/>
            <Button>Forfeit Battle</Button>
        </div>}
    </div>
}

export default HostedBattle