import './Home.css';
import Header from '../../Components/Header/Header'
import PlayCount from '../../Components/Home/PlayCount/PlayCount'
// import Follows from '../../Components/Home/Follows/Follows';
import axios from 'axios';
import { useEffect,useState } from 'react'
// import RecentlyPlayed from '../../Components/Home/RecentlyPlayed/RecentlyPlayed'
import { auth, firestore } from '../../firebase'
import AsideMenu from '../../Components/AsideMenu/AsideMenu'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import ShareUs from '../../Components/ShareUs/ShareUs';
import NewsComponent from '../../Components/News/News';
import MainSlider from './MainSlider/MainSlider';
import SpotifyPlaylistSubmission from '../../Components/SpotifyPlaylistSubmission/SpotifyPlaylistSubmission';
import Spotify from 'react-spotify-embed';
import DiscoveryForm from './DiscoveryForm/DiscoveryForm';
import Button from '@mui/material/Button'
const Home = () => {
    // const navigate = useNavigate()
    // const [joints,setJoints] = useState([])
    const [initialized, setInitialized] = useState(false)

    const [user,setUser] = useState(null)
    const [userObject,setUserObject] = useState(null)
    const [weeklyPlays,setWeeklyPlays] = useState(0)
    const [showDiscoveryForm,setShowDiscoveryForm] = useState(false)
    
    useEffect(()=>{
        let authUnsub = auth.onAuthStateChanged(async usr=>{
            if(usr){
                setUser(usr)
                const userDocRef = doc(firestore,'/users/' + usr.uid)
                const userDocData = (await getDoc(userDocRef)).data()
                setUserObject(userDocData)

                //Set a listener for the weekly playcount
                const weeklyPlaycountRef = doc(firestore,'/users/' + usr.uid)
                onSnapshot(weeklyPlaycountRef,snap=>{
                    if(snap.data() !== undefined){
                        setWeeklyPlays(snap.data().weekly_plays || 0)
                    }
                })


            }else{
                setUser(null)
            }
        })
        return ()=>{
            authUnsub()
        }
    },[setUser,user])

    useEffect(()=>{
        // let authUnsub = null
        let callback = async ()=> {
            if(!initialized){
                let js = []
                for(let i = 0; i < 10; i++){
                    const response = await axios.get('https://randomuser.me/api/')
                    const user = response.data.results[0]
                    js.push(user)
                }
                
                // setJoints(js)
                setInitialized(true)
            }
        }
        callback()

        return () => {
        }
    },[setInitialized,initialized])

    return  <div>
        <Header/>
        <div className="home">
            {/* <aside className="left_menu">
                <div style={{display: 'grid', gridTemplateColumns : '1fr', gridAutoRows : '1fr'}}>
                    <button onClick={e=>navigate('/charts')}>Browse Charts</button>
                    <button onClick={e=>navigate('/upload')}>Upload</button>
                    <button>TrAppCloud News</button>
                    <button>Artist Focus</button>
                    <button>Placement Ops</button>
                    <button>Submit to Labels</button>
                    <button>Contact</button>
                    <button onClick={e=>navigate('/shows')}>Live Shows</button>
                </div>
            </aside> */}
            <AsideMenu/>
            <main className="home_main">
                <article style={{textAlign: 'left'}}>
                    <MainSlider/>
                    <Spotify wide link="https://open.spotify.com/playlist/4xkX18gCIrONS9HHeshkqW?si=70d2a10b004b44d6"/>
                    <h3>Welcome</h3>
                    <section>
                        <p>
                            Welcome to SaucePanTv. We are looking for artists to promote on our spotify playlist. Only trap music submissions will be accepted. If you are selected you will be notified via email. Needless to state, all artists are required to have at least one song released on Spotify before submitting.
                            <br/><br/>
                            <SpotifyPlaylistSubmission/>
                            <div style={{textAlign : 'center'}}>
                                <ShareUs/>
                                {/* <FacebookShareButton style={{alignSelf: 'center'}} hashtag={"trapppcloud"} quote={"Come check out https://www.TrapppCloud.com. We need new trap artists and producers to come join the platform."} children={<button><Facebook style={{position: 'relative',top: 2}}/><span style={{position: 'relative', top: -5}}>Tell Your Friends</span></button>} url={"https://trapppcloud.com"}/> */}
                            </div>
                        </p>

                        {/* <RecentlyPlayed/> */}
                    </section>
                    <section>
                        <p>
                            We have several managers and producers in the Atlanta (ATL) area looking for talented trap recording artists. If you think you fit the bill, please fill out <Button color="warning" onClick={e=>setShowDiscoveryForm(true)}>this</Button> form for consideration. Slots are limited.
                            <DiscoveryForm open={showDiscoveryForm} setOpen={setShowDiscoveryForm}/>
                        </p>
                    </section>
                </article>
            </main>
            <aside style={{paddingRight: '10px'}}>
                {/* {user && userObject && <PlayCount weeklyPlays={weeklyPlays} user={user}/>} */}
                {/* {!user && <div>
                    Logged Off
                </div>} */}
                <br/>
                <hr/>
                <NewsComponent/>
                {/* <Follows joints={joints}/> */}
            </aside>
        </div>
    </div>  
}


export default Home;
