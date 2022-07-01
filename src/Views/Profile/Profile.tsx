import AsideMenu from "../../Components/AsideMenu/AsideMenu"
import Header from "../../Components/Header/Header"
import {useParams } from "react-router-dom"
import './Profile.css'
import { collection,query,where, onSnapshot, getDocs, addDoc,getDoc, updateDoc, increment,doc,setDoc,deleteDoc} from "firebase/firestore"
import { useEffect, useState } from 'react'
import { firestore, auth } from '../../firebase'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import ProfileBanner from "./ProfileBanner/ProfileBanner"
import PlayCount from "../../Components/Home/PlayCount/PlayCount"
import axios from 'axios'
import PublicOff from '@mui/icons-material/PublicOff';
import Public from '@mui/icons-material/Public';
import AudioFile from '@mui/icons-material/AudioFile';
import { MailSharp, Send, Store, Videocam, Image, MusicNote,DeleteForever, PersonAdd, Person } from "@mui/icons-material"
import PlayCounter from "./PlayCounter/PlayCounter"
import Likes from "./Likes/Likes"
import { useNavigate } from "react-router-dom"
import SignIn from "../../Components/SignIn/SignIn"
import SongCommentsComponent from "./SongCommentsComponent/SongCommentsComponent"
import CommentCounter from './CommentCounter/CommentCounter'
import SongCoverEditor from "./SongCoverEditor/SongCoverEditor"
import SongDeleteDialog from "./SongDeleteDialog/SongDeleteDialog"
import SendMessageComponent from "./SendMessageComponent/SendMessageComponent"
import Badge from '@mui/material/Badge';
import InboxComponent from './ViewMessagesComponent/InboxComponent'
import Videos from "./Videos/Videos"
import { Button } from "@mui/material"
import ChooseUsername from "./ChooseUsername/ChooseUsername"
import FollowFeed from "./FollowFeed/FollowFeed"
import StoreFront from "./StoreFront/StoreFront"
import FollowerList from "./FollowerList/FollowerList"
import ProfileHangout from "./ProfileHangout/ProfileHangout"

const Profile = (props:any) => {
    const [initialized,setInitialized] = useState<boolean>(false)
    const [user,setUser] = useState<any>(null)
    const [songs,setSongs] = useState<any>([])
    const params = useParams()
    const [profileOwnerUid,setProfileOwnerUid] = useState<any>(null)
    const [userObject,setUserObject] = useState<any>(null)
    const navigate = useNavigate()
    const [doesntExist,setDoesntExist] = useState<boolean>(false)
    const [messages,setMessages] = useState<any>([])
    const [showInboxDialog,setShowInboxDialog] = useState<boolean>(false)
    const [showVideos,setShowVideos] = useState<boolean>(false)
    const [videos,setVideos] = useState<any>([])
    const [followers,setFollowers] = useState<any>([])
    const [usernameNeedsSetup,setUsernameNeedsSetup] = useState<boolean>(false)
    const defaultProfileImage = "data:image/jpeg;base64,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"
    const [feed,setFeed] = useState<any>([])
    const [showStorefront,setShowStorefront] = useState<boolean>(false)
    const [storeProducts,setStoreProducts] = useState<any>([])

    // const [usernam]
    useEffect(()=>{
        let authUnsub = ()=>{}
        let songsUnsub = ()=> {}
        let userUnsub = () => {}
        let messagesUnsub = () => {}
        let videosUnsub = () => {}
        let followersUnsub = () => {}
        let feedUnsub = () => {}
        let productsUnsub = () => {}

        try{
            authUnsub = auth.onAuthStateChanged(async usr=>{
                if(usr){
                    setUser(usr)
                    const usernameQuery = query(collection(firestore,'/users'),where('username','==',params.id))
                    const snap = await getDocs(usernameQuery)
                    if(!snap.empty){    
                        const matchUid = snap.docs[0].id
                        setProfileOwnerUid(matchUid)
                        //if(matchId == params.id){
                        const matchUsername = snap.docs[0].data().username
                        if(matchUsername === params.id){ //Make sure that the id on the url matches with a user
                            if(usr.uid === matchUid){ //Check if I am viewing my own profile
                                //Retrieve all the messages for this user
                                const messagesCollectionRef = collection(firestore,'/users/' + usr.uid + '/messages')
                                messagesUnsub = onSnapshot(messagesCollectionRef,async snap=>{
                                    let msgs:any = []
                                    for(var m = 0; m < snap.docs.length; m++){
                                        let msg = snap.docs[m].data()
                                        let msgid = snap.docs[m].id
                                        msg.id = msgid
                                        if(msg.viewed === false || msg.viewed === undefined){
                                            msgs.push(msg)
                                        }
                                    }
                                    setMessages(msgs)
                                })

                                //Retrieve all the songs for the user
                                const songsQuery = query(collection(firestore,'/users/' + usr.uid + '/songs'))
                                songsUnsub = onSnapshot(songsQuery, async snap=>{
                                    let sngs:any = []
                                    for(var sng = 0; sng < snap.docs.length; sng++){
                                        let s = snap.docs[sng].data()
                                        s.id = snap.docs[sng].id
                                        const songCommentsCollection = collection(firestore,'/users/' + usr.uid + '/songs/' + s.id + '/comments')
                                        let comments_snap = await getDocs(songCommentsCollection)
                                        let cmts:any = []
                                        
                                        for(var dct = 0; dct < comments_snap.docs.length;dct++){
                                            const docmt = comments_snap.docs[dct]
                                            if(docmt.data() !== undefined){
                                                let cmt = docmt.data()
                                                let sender_id = cmt.sender
                                                const sender_user_data_ref = doc(firestore,'/users/' + sender_id)
                                                const user_data:any = await getDoc(sender_user_data_ref)
                                                if(user_data.data() !== undefined){
                                                    cmt.sender_profile_image = user_data.data().profile_image
                                                    cmt.sender_username = user_data.data().username
                                                    cmt.id = docmt.id
                                                    cmts.push(cmt)
                                                }
                                            }
                                        }                                            
                                        
                                        //Sort the comments by timestamp
                                        s.cmts = cmts.sort((a:any,b:any)=>b.timestamp - a.timestamp)

                                        sngs.push(s)
                                    }

                                    //Filter out trashed songs
                                    sngs = sngs.filter((s:any)=>!s.trashed)

                                    setSongs(sngs)
                                })

                                //Retrieve all videos
                                const videosQuery = query(collection(firestore,'/users/' + usr.uid + '/videos'))
                                videosUnsub = onSnapshot(videosQuery, async snap=>{
                                    let vids:any = []
                                    for(var vid = 0; vid < snap.docs.length; vid++){
                                        let v = snap.docs[vid].data()
                                        v.id = snap.docs[vid].id
                                        const vidCommentsCollection = collection(firestore,'/users/' + usr.uid + '/videos/' + v.id + '/comments')
                                        let comments_snap = await getDocs(vidCommentsCollection)
                                        let cmts:any = []

                                        for(var dct = 0; dct < comments_snap.docs.length;dct++){
                                            const docmt = comments_snap.docs[dct]
                                            if(docmt.data() !== undefined){
                                                let cmt = docmt.data()
                                                let sender_id = cmt.sender
                                                const sender_user_data_ref:any = doc(firestore,'/users/' + sender_id)
                                                const user_data:any = await getDoc(sender_user_data_ref)
                                                cmt.sender_profile_image = user_data.data().profile_image
                                                cmt.sender_username = user_data.data().username
                                                cmt.id = docmt.id
                                                cmts.push(cmt)

                                            }
                                        }

                                        v.cmts = cmts.sort((a:any,b:any)=>b.timestamp - a.timestamp) 
                                        vids.push(v)
                                    }

                                    //Filter out trashed videos
                                    vids = vids.filter((v:any)=>!v.trashed)

                                    setVideos(vids)
                                })


                                //Retrieve followers
                                const followersQuery = query(collection(firestore,'/users/' + usr.uid + '/followers'))
                                followersUnsub = onSnapshot(followersQuery,async snap=>{
                                    let f = []
                                    for(let i = 0; i < snap.docs.length; i++){
                                        //Uid == doc.id
                                        const currentFollowerUid = snap.docs[i].id
                                        f.push(currentFollowerUid)
                                    }
                                    setFollowers(f)
                                })

                                //Retrieve my feed
                                const feedQuery = query(collection(firestore,'/users/' + usr.uid + '/feed'))
                                feedUnsub = onSnapshot(feedQuery, async snap=>{
                                    let f = []
                                    for(let i = 0; i < snap.docs.length; i++){
                                        const currentFeedItem = snap.docs[i].data()
                                        f.push(currentFeedItem)
                                    }
                                    setFeed(f)
                                })                                

                                //Retrieve my storefront drip
                                const dripQuery = query(collection(firestore,'/users/' + usr.uid + '/drip'))
                                productsUnsub = onSnapshot(dripQuery, async snap=>{
                                    let p = []
                                    for(let i = 0; i < snap.docs.length; i++){
                                        const currentDripItem = snap.docs[i].data()
                                        p.push(currentDripItem)
                                    }
                                    setStoreProducts(p)
                                })
 

                                //Retrieve the logged in user's object
                                const userObjectQuery = doc(firestore,'/users/' + usr.uid)
                                userUnsub = onSnapshot(userObjectQuery, snap=> {
                                    if(snap.data() !== undefined){
                                        setUserObject(snap.data())
                                    }
                                })
                            }else{ //Pull the other user's info instead
                                const userSongsCollectionReference = query(collection(firestore,'/users/' + matchUid + '/songs'))
                                songsUnsub = onSnapshot(userSongsCollectionReference, async snap=>{

                                    //Retrieve all songs
                                    let sngs:any = []
                                    for(var sng = 0; sng < snap.docs.length; sng++){
                                        let s = snap.docs[sng].data()
                                        s.id = snap.docs[sng].id
                                        const songCommentsCollection = collection(firestore,'/users/' + matchUid + '/songs/' + s.id + '/comments')
                                        let comments_snap = await getDocs(songCommentsCollection)
                                        let cmts:any = []
                                        
                                        for(var dct = 0; dct < comments_snap.docs.length;dct++){
                                            const docmt = comments_snap.docs[dct]
                                            if(docmt.data() !== undefined){
                                                let cmt = docmt.data()
                                                let sender_id = cmt.sender
                                                const sender_user_data_ref = doc(firestore,'/users/' + sender_id)
                                                const user_data:any = await getDoc(sender_user_data_ref)
                                                if(user_data.data() !== undefined){
                                                    if('profile_image' in user_data.data()){
                                                        cmt.sender_profile_image = user_data.data().profile_image
                                                    }else{
                                                        cmt.sender_profile_image = defaultProfileImage
                                                    }
                                                    cmt.sender_username = user_data.data().username
                                                    cmt.id = docmt.id
                                                    cmts.push(cmt)
                                                }
                                            }
                                        }
                                        s.cmts = cmts
                                         //Sort the comments by timestamp
                                        s.cmts = s.cmts.sort((a:any,b:any)=>b.timestamp - a.timestamp)
                                        sngs.push(s)
                                    }

                                    sngs = sngs.filter((s:any)=>s.visibility === 'public' && !s.trashed)
                                    setSongs(sngs)

                                    //Retrieve all videos

                                    //Retrieve all followers
                                    const followersQuery = query(collection(firestore,'/users/' + matchUid + '/followers'))
                                    followersUnsub = onSnapshot(followersQuery,async snap=>{
                                        let f = []
                                        for(let i = 0; i < snap.docs.length; i++){
                                            //Uid == doc.id
                                            const currentFollowerUid = snap.docs[i].id
                                            f.push(currentFollowerUid)
                                        }
                                        setFollowers(f)
                                    })
                                })

                                const userObjectQuery = doc(firestore,'/users/' + profileOwnerUid)
                                userUnsub = onSnapshot(userObjectQuery, snap=> {
                                    if(snap.data() !== undefined){
                                        setUserObject(snap.data())
                                    }
                                })
                            }
                        }
                    }else{
                        // if(params.)
                        // console.log("Username not found")
                        // if(user){ //If there's a user
                        //     if(params.id === 'undefined' || params.id === undefined || params.id === null){
                        //         console.log("Params id was " + params.id)
                        //         //And the username is undefined
                        //         //Check that the user has set up a username
                        //         const userObjectRef = doc(firestore,'/users/' + user.uid)
                        //         getDoc(userObjectRef).then(userDocSnap=>{
                        //             if(userDocSnap !== undefined){
                        //                 if(userDocSnap?.data()?.username !== undefined){
                        //                     //User has a username send them to their own profile
                        //                     navigate('/profiles/' + userDocSnap?.data()?.username)
                        //                 }else{
                        //                     setDoesntExist(true)
                        //                     setUsernameNeedsSetup(true)
                        //                 }
                        //             }
                        //         })
                        //     }else{
                        //         console.log(params.id)
                        //     }
                        // }else{
                        //     console.log(user)
                        //     setDoesntExist(true)
                        // }
                        if(user !== null && params.id !== 'undefined'){
                            setDoesntExist(true)
                        }else{
                            //Username is not setup yet
                            setDoesntExist(true)
                            setUsernameNeedsSetup(true)
                        }
                    }

                }else{
                    setUser(null)
                    //
                }
            })
        }catch(err){
            console.error(err)
        }
        
        return ()=> {
            authUnsub()
            userUnsub()
            songsUnsub()
            messagesUnsub()
            videosUnsub()
            followersUnsub()
            feedUnsub()
            productsUnsub()
        }
    },[initialized, setInitialized,setSongs,setVideos,params.id,profileOwnerUid])

    const [songsPlayed,setSongsPlayed] = useState<any>([])

    const registerPlay = async (e:any,song:any) => {
        const res = await axios.get('https://geolocation-db.com/json/')
        // console.log(res.data.IPv4)
        // console.log(song.id)

        //Add song entry to the user's playlog for processing later
        const profileOwnerPlayLogRef = collection(firestore,'/users/' + profileOwnerUid + '/playlog')
        
        //Remove the song comments before adding the document
        let sng_cpy = Object.assign({},song)
        delete sng_cpy.comments
        
        if(songsPlayed.indexOf(songs) === -1){ //If this song has not been played yet then increment the playcount by one
            //Save the documment
            await addDoc(profileOwnerPlayLogRef,{
                user : user.uid,
                ip : res.data.IPv4,
                song_id : song.id,
                song : sng_cpy,
                timestamp : new Date(),
            })  

            //Update the song's playcount
            const songDocRef = doc(firestore,'users/' + profileOwnerUid + '/songs/' + song.id)
            await updateDoc(songDocRef,{
                plays : increment(1)
            }) 

            //Update the overall play counter and weekly counters
            const ownerProfileRef = doc(firestore,'/users/' + profileOwnerUid)
            await updateDoc(ownerProfileRef,{
                overall_plays : increment(1),
                weekly_plays : increment(1)
            })
        }
       

        //Add this song to the list of songs played
        songsPlayed.push(song)

    }

    const switchSongVisibility = async (e:any,song:any,visi:any) =>{
        console.log(e)
        console.log(song)

        if(user){
            if(user.uid === profileOwnerUid){
                const songDoc = doc(firestore,'/users/' + user.uid + '/songs/' + song.id)
                await updateDoc(songDoc,{
                    visibility : visi ? 'private' : 'public'
                })
            }
        }
    }

    const [showSongCoverEditor,setShowSongCoverEditor] = useState<boolean>(false)
    const [songCoverEditorSong,setSongCoverEditorSong] = useState<any>(null)

    const changeSongCover = async (song:any) => {
        if(profileOwnerUid === user.uid){ //If the profile belongs to me, and me only
            if(!showSongCoverEditor){
                setSongCoverEditorSong(song)
                setShowSongCoverEditor(true)
            }
        }//else do jackshitzlet
    }

    const [showSongDeleteDialog,setShowSongDeleteDialog] = useState<boolean>(false)
    const [songDeleteDialogSong,setSongDeleteDialogSong] = useState<any>(null)

    const deleteSong = (song:any) => {
        setSongDeleteDialogSong(song)
        setShowSongDeleteDialog(true)
    }

    const [showSendMessageDialog,setShowSendMessageDialog] = useState<boolean>(false)

    const follow = async ()=>{
        //Add profileOwnerUid to follow collection
        try{
            await setDoc(doc(firestore, "/users/" + user.uid + '/following/' + profileOwnerUid),{
                timestamp : new Date(),
                follow_music_posts : true, 
                follow_video_posts : true,
                follow_drip_posts : true
            })
        }catch(err){
            console.error(err)
            alert("There was an unexpected error.")
        }
        //Add self as follower to profileOwnerId follower collection
        try{
            await setDoc(doc(firestore, "/users/" + profileOwnerUid + '/followers/' + user.uid),{
                timestamp : new Date(),
                follow_music_posts : true, 
                follow_video_posts : true,
                follow_drip_posts : true
            })
        }catch(err){
            console.error(err)
            alert("There was an unexpected error.")
        }
    }

    const unfollow = async () => {
        //Add profileOwnerUid to follow collection
        try{
            await deleteDoc(doc(firestore, "/users/" + user.uid + '/following/' + profileOwnerUid))
        }catch(err){
            console.error(err)
            alert("There was an unexpected error.")
        }
        //Add self as follower to profileOwnerId follower collection
        try{
            await deleteDoc(doc(firestore, "/users/" + profileOwnerUid + '/followers/' + user.uid))
        }catch(err){
            console.error(err)
            alert("There was an unexpected error.")
        }
    }

    const [showFollowersList,setShowFollowersList] = useState(false)

    if(!doesntExist){
        return <div>
            <Header/>
            <div className="profile_container">
                <div className="left_menu_container">
                    <div className="left_menu_fixed_container">
                        <AsideMenu/>
                    </div>
                </div>
                <div className="profile_main">
                    {/* <!--Header Section--> */}
                    {user && <ProfileBanner bannerUrl={userObject?.profile_banner} user={user} profileOwnerUid={profileOwnerUid} username={params.id} profileImageUrl={userObject?.profile_image}/>}
                    {/* username : {params.id}<br/> */}
                    
                    {/* <!--Profile Menu Section--> */}
                    {user && <div className="profile_menu">
                        {user && user.uid === profileOwnerUid && songs && <span>songs: {songs.length} / 12</span>}
                        {user && user.uid === profileOwnerUid && <div onClick={e=>setShowFollowersList(true)} style={{color : 'black', textAlign: 'right', position: 'relative', top : '0px', left : '0px', cursor: 'pointer'}} ><Person/><span style={{position: 'relative', top: -7}}>{followers.length} followers</span></div>}
                        <FollowerList followers={followers} setOpen={setShowFollowersList} open={showFollowersList} user={user}/>
                        {user && user.uid !== profileOwnerUid && <span className="profile_actions">
                            <button className="profile_action" onClick={e=>setShowStorefront(true)}><Store fontSize="small"/><span className="profile_action_text">Drip</span></button>
                            <button className="profile_action" onClick={e=>setShowVideos(true)}><Videocam fontSize="small"/><span className="profile_action_text">Videos</span></button>
                            {/* <button className="profile_action"><Image fontSize="small"/><span className="profile_action_text">Photos</span></button> */}
                        </span>}
                        <span style={{float : 'right',textAlign : 'center'}} className="profile_actions">
                            {user && user.uid === profileOwnerUid && <Badge badgeContent={(messages.filter((m:any)=>!m.read)).length} color="primary" sx={{position: 'relative', width: 20}}>
                                <div style={{width: 20}}>
                                    <MailSharp  className="profile_action_icon" style={{position: 'relative' , top: '0px', cursor: 'pointer'}} fontSize="small" onClick={e=>setShowInboxDialog(true)}/>
                                    <InboxComponent user={user} open={showInboxDialog} setOpen={setShowInboxDialog} messages={messages}/>
                                </div>
                            </Badge>}
                            {user && user.uid === profileOwnerUid && <Videocam onClick={e=>setShowVideos(true)} className="profile_action_icon" fontSize="small"/>}
                            {/* {user && user.uid === profileOwnerUid && <MusicNote className="profile_action_icon" fontSize="small"/>} */}
                            {/* {user && user.uid === profileOwnerUid && <Image className="profile_action_icon" fontSize="small"/>} */}
                            {user && user.uid === profileOwnerUid && <Store className="profile_action_icon" fontSize="small" onClick={e=>setShowStorefront(true)}/>}
                            <StoreFront open={showStorefront} setOpen={setShowStorefront} user={user} userObject={userObject} profileOwnerUid={profileOwnerUid} drip={storeProducts}/>
                            {user && user.uid !== profileOwnerUid && <Send style={{position: 'relative' , top: '8px', cursor : 'pointer'}} onClick={e=>setShowSendMessageDialog(true)}/>}
                            <SendMessageComponent user={user} userObject={userObject} open={showSendMessageDialog} setOpen={setShowSendMessageDialog} profileOwnerUid={profileOwnerUid}/>
                            <Videos videos={videos} open={showVideos} setOpen={setShowVideos} user={user} userObject={userObject} profileOwnerUid={profileOwnerUid}/>
                        </span>
                    </div>}

                    {/* <!--Follow Menu--> */}
                    {user && user.uid !== profileOwnerUid && <div className="profile_follow_menu">
                        <span style={{color : 'black', float: 'left', position: 'relative', top : '7px', left : '5px'}}><Person/><span style={{position: 'relative', top: -7}}>{followers.length} followers</span></span>
                        {!followers.includes(user.uid) && <Button color="secondary" onClick={follow}><PersonAdd/>Follow</Button>}
                        {followers.includes(user.uid) && <Button color="primary" onClick={unfollow}>UnFollow</Button>}
                    </div>}

                    <div className="profile_hangout">
                        <ProfileHangout profileOwnerUid={profileOwnerUid} userObject={userObject}/>
                    </div>
                    
                    {user && songs && songs.length === 0 && user.uid === profileOwnerUid && <div className="empty_profile_message">
                        You can go to Uploads on the left to upload new music to your profile.<br/><br/>
                        <button onClick={e=>navigate('/upload')}>Upload Songs</button>
                    </div>}
                    {user && <div className="song_list">
                        {songs && songs.map((s:any,i:any)=><div key={i} className="song">
                            <img alt="song_cover" className="song_cover" src={s.coverUrl} onClick={e=>changeSongCover(s)}/>
                            <SongCoverEditor user={user} open={showSongCoverEditor} setOpen={setShowSongCoverEditor} song={songCoverEditorSong}/>
                            <AudioPlayer
                                className="song_player"
                                autoPlay={false}
                                src={s.downloadURL}
                                onPlay={async e => await registerPlay(e,s)}
                                // other props here
                            />
                            <div className="song_info">
                                <div className="songName">
                                    <AudioFile/><span style={{position: 'relative', top: '-5px', left: 0}}>{s.name.length > 40 ? s.name.substring(0,40) + '...' : s.name}</span>
                                </div>
                                <div className="playCounter"><PlayCounter song={s}/></div>
                                {/* <SongLikeComponent owner={profileOwnerUid} song={s} user={user}/> */}
                                
                                <div className="songLikes"><Likes owner={profileOwnerUid} song={s} user={user}/></div>
                                <div className="commentCounter"><CommentCounter song={s}/></div>
                                {/* <SongPlaysComponent userid={profileOwnerUid} songid={s.id}/> */}
                                <div className="songComments">
                                    <SongCommentsComponent owner={profileOwnerUid} song={s} user={user}/>
                                </div>
                                <div className="visibilitySwitcher">
                                    {s.visibility === 'private' ? <PublicOff style={{cursor : 'pointer'}} onClick={e=>switchSongVisibility(e,s,false)}/> : <Public  style={{cursor : 'pointer'}} onClick={e=>switchSongVisibility(e,s,true)}/>}
                                </div>
                                {profileOwnerUid === user.uid && <DeleteForever className="deleteSongButton" onClick={e=>deleteSong(s)}/>}
                                {profileOwnerUid === user.uid && <SongDeleteDialog open={showSongDeleteDialog} setOpen={setShowSongDeleteDialog} user={user} song={songDeleteDialogSong}></SongDeleteDialog>}
                            </div>
                        </div>)}   
                        {user && profileOwnerUid && user.uid === profileOwnerUid && <FollowFeed feed={feed}/>}

                    </div>}


                    {!user && <div style={{textAlign : 'center' , padding: 4}}>
                        <span>Please use the top menu icons to sign in or create an account to view this profile.</span>
                        <SignIn/>
                    </div>}

                    {user && user.uid !== profileOwnerUid && songs.length === 0 && <div style={{padding: '20px', textAlign: 'center'}}>
                        <span>This artist has not uploaded any songs yet. Please come back later.</span>
                    </div>} 
                    {/* {!userObject && <span>No User Object</span>}
                    {!user && <span>No User</span>} */}
                </div>
                <div className="right_menu">
                    {user && profileOwnerUid && user.uid === profileOwnerUid && <div>
                        <span>Welcome back!</span>
                        <PlayCount weeklyPlays={userObject?.weekly_plays | 0} user={user}/>
                        <FollowFeed feed={feed}/>
                    </div>}
                </div>
            </div>
        </div>
    }else{
        if(usernameNeedsSetup === true){
            return <div>
                <Header/>
                <div className="profile_container">
                    <div className="left_menu_container">
                        <div className="left_menu_fixed_container">
                            <AsideMenu/>
                        </div>
                    </div>
                    <main className="profile_main" style={{padding: '30px'}}>
                       <div className="profile_username_setup">
                            Please select your username which will be part of your profile link and read over the terms and conditions.<br/><br/>
                            <ChooseUsername/>
                        </div>
                        {/* <Button>Choose Username</Button> */}
                    </main>
                </div>
                
            </div>
        }
        else{
            return <div>
                <Header/>
                <div className="profile_container">
                    <div className="left_menu_container">
                        <div className="left_menu_fixed_container">
                            <AsideMenu/>
                        </div>
                    </div>
                    <main className="profile_main" style={{padding: '30px'}}>
                        <span style={{padding: '15px'}}>That username does not exist</span>
                    </main>
                </div>
            </div>
        }
    }
}

export default Profile