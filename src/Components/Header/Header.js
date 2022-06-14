import SignIn from '../SignIn/SignIn'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './Header.css'
import { auth, firestore } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { Person,Logout,PersonAdd } from '@mui/icons-material'
// import CloudIcon from '@mui/icons-material/Cloud';

const Header = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [user,setUser] = useState(null)
    const [userObject,setUserObject] = useState(null)
    
    useEffect(()=>{
      auth.onAuthStateChanged(async usr=>{
        if(usr){
          setUser(usr)
          const userDocRef = doc(firestore,'/users/' + usr.uid)
          const userDocData = (await getDoc(userDocRef)).data()
          setUserObject(userDocData)
        }else{
          setUser(null)
        }
      })
    },[user,setUser,setUserObject])

    const attemptLogout = async () => {
      signOut(auth).then(() => {
        setUser(null)
      }).catch((error) => {
        console.error(error)
      });
    }

    const gotoLogin = (e) => {
      e.preventDefault()
      e.stopPropagation()
      navigate('/login')
    }

    const gotoMyProfile = (e) => {
      // e.preventDefault()
      // e.stopPropagation()
      if(!location.pathname === '/profile'){
        //Get the user's username
        navigate('/profiles/' + userObject.username)
      }else{
        window.location.href = "/profiles/" + userObject.username
      }
    }

    return <header className="App-header">
        {/* <div className="app_title">TrApppCloud {location.pathname} </div> */}
        {/* <div style={{position: 'relative', width: 'fit-content'}}> */}
          {/* <CloudIcon className="app_logo"/> */}

          {/* <span className="app_logo_letters">TC</span> */}
        {/* </div> */}
        <img className="app_logo" alt="logo" src="https://firebasestorage.googleapis.com/v0/b/trapppcloud.appspot.com/o/App%20Images%2Flogo_new.png?alt=media&token=4436d91f-35c2-45fd-8996-a0f947cd939b" width="95px" height="95px"/>
        {/* <span className="site_name">TrapppCloud</span> */}
        {location.pathname !== '/signup' && !user && <button className="signup_button" onClick={e=>navigate('/signup')}>
          <span className="signup_button_title">Sign Up</span><PersonAdd className="signup_button_icon"/>
        </button>}

        {location.pathname !== '/login' && location.pathname !== '/signup' && !user && <button className="sign_in_button" onClick={e=>gotoLogin(e)}>
          <div 
            className="sign_in_menu"
          ><Person style={{alignSelf : 'center'}}/>
            <div className="login_menu">
              <SignIn/>
            </div>
          </div>
        </button>} 

        {user && <button className="profile_button" style={{marginLeft: 6}} onClick={e=>gotoMyProfile(e)}><Person/></button>}
        {user && <button className="logout_button" onClick={e=>attemptLogout(e)}><Logout/></button>}

      </header>
}

export default Header