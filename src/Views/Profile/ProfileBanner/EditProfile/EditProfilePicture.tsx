import { useState, useEffect, useRef } from 'react'
import { firestore,storage } from '../../../../firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { uploadBytesResumable,ref, getDownloadURL } from 'firebase/storage'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
// import { Edit } from '@mui/icons-material'
import '../ProfileBanner.css'
import UploadBar from "../../../Upload/uploadbar"
import { CircularProgress } from '@mui/material'
import classnames from 'classnames'
import './EditProfilePicture.css'
import {Img} from 'react-image'

const EditProfilePicture = ({user,profileImageUrl=null}:any) => {
    const [dialogTitle,setDialogTitle] = useState<any>('Change Profile Picture')
    const [open,setOpen] = useState<any>(false)
    const [dialogMessage,setDialogMessage] = useState<any>('')
    const uploadInputRef:any = useRef()
    const profileImageRef:any = useRef()
    const [profilePictureFile,setProfilePictureFile] = useState<any>()
    const [profilePictureUrl,setProfilePictureUrl] = useState<any>(null)
    const [initialized,setInitialized] = useState<boolean>(false)
    const defaultProfileImage = "data:image/jpeg;base64,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"
    const [percentUpload,setPercentUpload] = useState<number>(0.00)
    const [uploading,setUploading] = useState<boolean>(false)
    const [profileLoaded,setProfileLoaded] = useState<boolean>(false)

    // const [profileImageElement,setProfileImageElement] = useState<HTMLElement>(null)
    useEffect(()=>{ 
        // if(!initialized){
            // console.log(profileImageUrl)
            setProfilePictureUrl(!profileImageUrl ? defaultProfileImage : profileImageUrl)
            // profileImageRef.current.src = profilePictureUrl
            // setInitialized(true)
        // }

    },[setProfilePictureUrl,defaultProfileImage,setInitialized,initialized,profileImageUrl])

    const handleClose = () => {
        setOpen(false);
    };

    const changePicture = (e:any) => {
        setProfilePictureFile(e.target!.files![0])
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.addEventListener("load", function () {
            setProfilePictureUrl(reader.result)
        }, false)
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const uploadNewProfileImage = () => {
        console.log(profilePictureUrl)
        console.log(profilePictureFile)
        console.log(user)
        // const profileImageRef = 
        const uploadRef = ref(storage,"/" + user.uid + "/profile_pictures/" + profilePictureFile.name)
        const uploadTask = uploadBytesResumable(uploadRef, profilePictureFile)
        uploadTask.on('state_changed', 
            (snapshot:any) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setPercentUpload(parseInt(progress.toFixed(2)))
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused')
                        break;
                    case 'running':
                        console.log('Upload is running')
                        setUploading(true)
                        break;
                }
            }, 
            (error) => {
                console.error(error)
                setPercentUpload(0)
            }, 
            () => {
                setPercentUpload(0)
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL)
                    const userDocRef = doc(firestore, "/users/" + user.uid)
                    await updateDoc(userDocRef,{
                        profile_image : downloadURL,
                        profile_image_path : uploadTask.snapshot.ref.fullPath
                    })
                })
                // setTimeout(()=>{
                //     getMyUploadLimit().then(lim=>{
                //         setUploadLimit(lim)
                //         uploadInputRef.current.files = null
                //         uploadInputRef.current.value = null
                //     })
                // },6000)

                // alert("Your song has been uploaded and it's private on your profile. You can edit it there and set it to public when you're ready.")
                setDialogTitle("Profile Image Uploading")
                setDialogMessage("Profile image changed.")
                setTimeout(()=>{
                    setDialogMessage('')
                    setDialogTitle("Edit Profile Image")
                },5000)
                setOpen(true)
                setUploading(false)
            }
        )
    }

    const [profileImageLoaded,setProfileImageLoaded] = useState<boolean>(false)

    
    // useEffect(()=>{
    //     console.log("I am being called dafuq.")
    //     const profileImageLoadedEvent = (e:any) => {
    //         console.log(e)
    //         setProfileImageLoaded(true)
    //     }
    //     const img = new Image()
    //     img.src = profileImageUrl
    //     img.addEventListener('onload',(e)=>profileImageLoadedEvent(e))
    // },[profileImageUrl,setProfileImageLoaded])
    // var profImageClasses = classnames({
    //     'profile_image': true,
    //     'show_profile_image' : profileLoaded == true ? true : false,
    // })

    return <span style={{zIndex : 100}}>

        {/* <Button onClick={e=>setOpen(true)}>Change Profile Picture</Button> */}
        {/* <Edit className="edit_banner_button" onClick={e=>setOpen(true)}></Edit> */}
        {profilePictureUrl !== null && <img alt="profile_image" style={{opacity: profileImageLoaded ? 1 : 0,cursor : 'pointer'}} onLoad={e=>setProfileImageLoaded(true)} src={profileImageUrl} className="profile_image" onClick={e=>setOpen(true)}/>}
        {/* {!profileImageLoaded && <CircularProgress className={profileImageUrl ? "profile_image":""}/>} */}
        {/* <Img
            className="profile_image"
            src={[profilePictureUrl ? profilePictureUrl : defaultProfileImage]}
            loader={<CircularProgress></CircularProgress>}
            onClick={e=>setOpen(true)}
            ref={profileImageRef}
        /> */}

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {dialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" style={{textAlign : 'center'}}>
                    { !uploading && <img alt="profile_picture" ref={profileImageRef} src={profilePictureUrl} width="200px" height="200px" style={{borderRadius : 100}}/>}
                    <br/>
                    { !uploading && <input ref={uploadInputRef} style={{alignSelf : 'center'}} accept=".jpeg,image/*" type="file" onChange={(e)=>changePicture(e)}></input>}
                    <br/>
                    {dialogMessage && dialogMessage}
                    <br/>
                    {uploading && <UploadBar percent={percentUpload}/>}

                    {/* {profilePictureUrl} */}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>
                    Close
                </Button>
                <Button onClick={uploadNewProfileImage}>Upload New Image</Button>
            </DialogActions>
        </Dialog>
    </span>
}

export default EditProfilePicture