import './ProfileBanner.css'
import { Edit } from '@mui/icons-material'
import EditProfilePicture from './EditProfile/EditProfilePicture'
import { useEffect,useState,useRef } from 'react'
import { firestore } from '../../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import ProfileBannerEditor from './ProfileBannerEditor/ProfileBannerEditor'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const ProfileBanner = ({user,username,profileImageUrl,bannerUrl,profileOwnerUid}:any) => {
    const[profileOwnerImage,setProfileOwnerImage] = useState<any>()
    // const [initialized,setInitialized] = useState<boolean>(false)
    const [profileOwnerBanner,setProfileOwnerBanner] = useState<any>()
    const [showProfileBannerEditor,setShowProfileBannerEditor] = useState<boolean>(false)
    const bannerRef = useRef<any>()
    const [initialized,setInitialized] = useState<boolean>(false)

    useEffect(()=>{
        bannerRef.current.style.backgroundPosition = "center center";
        bannerRef.current.style.backgroundSize = 'cover';
        // if(!initialized){
            if(user.uid !== profileOwnerUid){
                const profileOwnerUserDocRef = doc(firestore,'/users/' + profileOwnerUid)
                getDoc(profileOwnerUserDocRef).then((snap:any)=>{
                    if(snap.data() !== undefined){
                        setProfileOwnerImage(snap.data().profile_image)
                        setProfileOwnerBanner(snap.data().profile_banner)
                    }
                })
            }

            window.addEventListener('resize',(e)=>{
                bannerRef.current.style.backgroundPosition = "center center";
                bannerRef.current.style.backgroundSize = 'cover';
                console.log("Resizing")
            })

            setInitialized(true)
        // }
    })

    if(user){
        return <div ref={bannerRef} style={{background : user.uid === profileOwnerUid ? 'url(' + bannerUrl + ')' : 'url(' + profileOwnerBanner + ')', backgroundSize : 'fill'}} className="profile_banner">
            <div className="profile_image_container">
                {user && user.uid === profileOwnerUid && profileImageUrl !== null && <EditProfilePicture user={user} profileImageUrl={profileImageUrl}/>}
                {user && user.uid !== profileOwnerUid &&  profileOwnerImage !== null &&
                    <LazyLoadImage
                        alt="profile_image"
                        height={100}
                        src={profileOwnerImage} // use normal <img> attributes as props
                        width={100}
                        effect="blur"
                        visibleByDefault={false}
                        style={{borderRadius: 50, position: 'relative', top: 10, left: 30, border: '3px solid white',zIndex: 1}}
                         />
                    // <img alt="profile_image" className='profile_image' src={profileOwnerImage} width="200px" height="200px"/>
                }
            </div>
            <span className="username">{username}</span>
            {user && user.uid === profileOwnerUid && <Edit className="edit_banner_button" onClick={e=>setShowProfileBannerEditor(true)}></Edit>}
            <ProfileBannerEditor open={showProfileBannerEditor} setOpen={setShowProfileBannerEditor} profileBannerImageUrl={bannerUrl} profileOwnerUid={profileOwnerUid} user={user}/>
            {/* {profileImageUrl ? 'piurl|' : 'no url'}
            {profileOwnerUid ? 'poid : ' + profileOwnerUid + '|' : 'no uid'}
            {profileOwnerBanner ? 'pob|' : 'no banner'} */}
            <div className="darkener"/>
        </div>
    }else{
        return <></>
    }
}

export default ProfileBanner