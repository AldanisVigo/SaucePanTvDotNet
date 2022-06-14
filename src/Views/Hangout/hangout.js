import { useEffect,useState } from 'react'
import SignIn from '../../Components/SignIn/SignIn'
import Header from '../../Components/Header/Header'
import AsideMenu from '../../Components/AsideMenu/AsideMenu'
import './hangout.css'
import { auth } from '../../firebase'
import { JitsiMeeting } from '@jitsi/react-sdk';

const Hangout = () => {
    const [user,setUser] = useState(null)

    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                setUser(user)
            }else{
                setUser(null)
            }
        })
    },[])

    if(user){
        return <div>
            <Header/>
            <div className="hangout_container">
                <AsideMenu/>
                <main className="hangout_container_main">
                    <h3 className="hangout_label">SaucePanTv Hangout</h3>
                    <div className="hangout">
                        <JitsiMeeting
                            domain="jitsi.trapppcloud.com"
                            className="meeting"
                            roomName = {'SaucePanTv Hangout'}
                        />
                    </div>
                </main>
            </div>
        </div>
    }else{
        return <div>
            <Header/>
            <SignIn/>
        </div>
    }
}

export default Hangout