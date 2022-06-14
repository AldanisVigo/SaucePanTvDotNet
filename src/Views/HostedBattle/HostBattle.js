import { firestore, auth } from "../../firebase"
import SignIn from "../../Components/SignIn/SignIn"
import { useState,useEffect } from "react"
import { onSnapshot, collection } from "firebase/firestore"
import { List, ListItem,ListItemText, Button, Typography, ListItemAvatar } from '@mui/material'
import './HostBattle.scss'
import { Add } from "@mui/icons-material"
import NewBattleDialog from "./NewBattleDialog"
import Header from "../../Components/Header/Header"
import {   FacebookShareButton } from 'react-share'
import { Facebook } from '@mui/icons-material'

const HostBattle = () => {
    const [myHostedBattles,setMyHostedBattles] = useState([])
    const [user,setUser] = useState(null)
    const [selectedBattle,setSelectedBattle] = useState(0)
    const [showNewBattleDialog,setShowNewBattleDialog] = useState(false)

    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                setUser(user)
                const my_battles_collection_ref = collection(firestore,'/users/' + user.uid + '/battles')
                try{
                    onSnapshot(my_battles_collection_ref,snap=>{
                        if(snap !== undefined){
                            let battles_temp = []
                            for(let i = 0; i < snap.docs.length; i++){
                                let current_battle_doc = snap.docs[i].data()
                                current_battle_doc.id = snap.docs[i].id
                                battles_temp.push(current_battle_doc)
                            }
                            setMyHostedBattles(battles_temp)
                        }
                    })
                }catch(err){
                    console.error(err)
                }
            }else{
                setUser(null)
            }
        })
    },[myHostedBattles,setMyHostedBattles,user,setUser])
    
    return <div className="host_battle">
        <Header/>
        {!user && <SignIn/>}    
        {user && <div className="battles_dashboard">
            <div className="battles_menu">
                <div className="battles_menu_title">Battles Manager</div>
                <Add fontSize="large" className="add_battle_button" onClick={e=>setShowNewBattleDialog(true)}/>
                <NewBattleDialog open={showNewBattleDialog} setOpen={setShowNewBattleDialog} user={user}/>
            </div>
            <div className="existing_battles_list">
                {myHostedBattles.length > 0 && <List>
                    {myHostedBattles.map((b,i)=><ListItem key={i} className="battles_list_item" style={{background : selectedBattle === i ? '#ECC1F3' : 'grey', color : selectedBattle === i ? 'black' : 'white', borderRadius : selectedBattle === i ? '10px' : '0px'}} onClick={e=>setSelectedBattle(i)}>
                        <ListItemAvatar>
                            <img className="existing_battles_list_item_avatar" src={b.cover}/>
                        </ListItemAvatar>
                        <ListItemText>{b.title}</ListItemText>
                    </ListItem>)}
                </List>}

                {myHostedBattles.length === 0 && <span>No battles hosted yet. Click on the + icon on the top right to create one.</span>}
            </div>
            <div className="selected_battle_details">
                {myHostedBattles.length > 0 &&  <div>
                    <img className="selected_battle_cover_image" src={myHostedBattles[selectedBattle].cover} width="200px" height="200px"/>
                    <div className="selected_battle_title">
                        {myHostedBattles[selectedBattle].title}
                    </div>
                    <br/><br/>
                    <div className="selected_battle_description">
                        {myHostedBattles[selectedBattle].description}
                    </div>
                    <br/><br/>
                    <span>Battle Shareable URL : https://saucepantv.net/battles/{user.uid}/{myHostedBattles[selectedBattle].id}</span>
                    <br/><br/>
                    <FacebookShareButton style={{alignSelf: 'center'}} hashtag={"saucepantvbattles"} quote={myHostedBattles[selectedBattle].title + " come join the battle now."} children={<button><Facebook style={{position: 'relative',top: 2}}/><span style={{position: 'relative', top: -5}}>Tell Friends on Facebook</span></button>} url={'https://www.saucepantv.net/battles/' + user.uid + '/' + myHostedBattles[selectedBattle].id}/>
                </div>}
               
            </div>
        </div>}
    </div>
}

export default HostBattle