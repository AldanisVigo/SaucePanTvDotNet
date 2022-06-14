import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import classNames from 'classnames'
import { useEffect,useState } from "react"
import './AsideMenu.css'
import { auth,firestore } from "../../firebase"
import { doc, getDoc } from 'firebase/firestore'
import { Home,Person,TrendingUp, Upload, Newspaper, PersonSearch, Album, Cable, ContactPage, Videocam} from "@mui/icons-material"
import ChooseUsername from "../../Views/Profile/ChooseUsername/ChooseUsername"
const AsideMenu = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [user,setUser] = useState<any>(null)
    const [userObject,setUserObject] = useState<any>(null)
    const [showProfileInitializeDialog,setShowProfileInitilizeDialog] = useState<any>(false)

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

    return <aside className="left_menu">
        <div style={{display: 'grid', gridTemplateColumns : '1fr', gridAutoRows : '1fr'}}>
            <button onClick={e=>navigate('/')} className={classNames({'selected' :location.pathname === "/" ? true : false})}><Home className="menu_item_icon" fontSize="small"/>Home</button>
            {user && userObject && userObject.username && <button onClick={e=>navigate('/profiles/' + userObject.username)} className={classNames({'selected' :location.pathname.split('/')[1] === "profiles" ? true : false})}><Person className="menu_item_icon" fontSize="small"/>Profile</button>}
            {user && userObject && !userObject.username && <button onClick={e=>setShowProfileInitilizeDialog(true)} className={classNames({'selected' : showProfileInitializeDialog ? true : false})}><Person className="menu_item_icon" fontSize="small"/>Initialize Profile</button>}
            <ChooseUsername open={showProfileInitializeDialog} setOpen={setShowProfileInitilizeDialog}/>
            {/* <button onClick={e=>navigate('/charts')} className={classNames({'selected' :location.pathname === "/charts" ? true : false})}><TrendingUp className="menu_item_icon" fontSize="small"/>Charts</button> */}
            {user && userObject && userObject.username && <button onClick={e=>navigate('/upload')} className={classNames({'selected' :location.pathname === "/upload" ? true : false})}><Upload className="menu_item_icon" fontSize="small"/>Upload</button>}
            <button onClick={e=>navigate('/news')} className={classNames({'selected' : location.pathname === '/news' ? true : false})}><Newspaper className="menu_item_icon" fontSize="small"/>News</button>
            {/* <button onClick={e=>navigate('/artistfocus')} className={classNames({'selected' : location.pathname === '/artistfocus' ? true : false})}><PersonSearch className="menu_item_icon" fontSize="small"/>Artist Focus</button> */}
            {/* <button onClick={e=>navigate('/placementops')} className={classNames({'selected' : location.pathname === '/placementops' ? true : false})}><Cable className="menu_item_icon" fontSize="small"/>PlacementOps</button> */}
            {/* <button onClick={e=>navigate('/labels')} className={classNames({'selected' : location.pathname === '/labels' ? true : false})}><Album className="menu_item_icon" fontSize="small"/>Labels</button> */}
            <button onClick={e=>navigate('/contact')} className={classNames({'selected' : location.pathname === '/contact' ? true : false})}><ContactPage className="menu_item_icon" fontSize="small"/>Contact</button>
            <button onClick={e=>navigate('/hangout')} className={classNames({'selected' : location.pathname === '/hangout' ? true : false})}><Videocam className="menu_item_icon" fontSize="small"/>Hangout</button>
        </div>
    </aside>
}

export default AsideMenu