import { uploadBytesResumable,ref, getDownloadURL } from 'firebase/storage'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useState,useRef,useEffect } from 'react';
import UploadBar from "../../../Upload/uploadbar"
import { storage, firestore } from '../../../../firebase';
import { doc,updateDoc } from 'firebase/firestore';

const ProfileBannerEditor = ({open,setOpen,user,profileBannerImageUrl}:any) => {
    const handleClose = () => {
        setOpen(false)
    }

    const [dialogTitle,setDialogTitle] = useState<any>("Update Profile Banner Image")
    const [dialogMessage,setDialogMessage] = useState<any>("")
    const [uploading,setUploading] = useState<boolean>(false)
    const [percentUpload,setPercentUpload] = useState<number>(0)
    const coverImageRef:any = useRef()
    const uploadInputRef:any = useRef()
    const [coverPictureFile,setBannerPictureFile] = useState<any>()
    const [coverPictureUrl,setBannerPictureUrl] = useState<any>()
    const defaultBannerImage = "https://firebasestorage.googleapis.com/v0/b/trapppcloud.appspot.com/o/App%20Images%2Ffree%20purple%20banner.jpeg?alt=media&token=b07e056e-2b0e-4575-9747-bde7f1b47477"
    
    const changePicture = (e:any) => {
        setBannerPictureFile(e.target!.files![0])
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.addEventListener("load", function () {
            setBannerPictureUrl(reader.result)
        }, false)
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const uploadNewSongCoverImage = () => {
        const uploadRef = ref(storage,"/" + user.uid + "/banner_images/" + coverPictureFile.name)
        const uploadTask = uploadBytesResumable(uploadRef, coverPictureFile)
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
                        profile_banner : downloadURL,
                        profile_banner_path : uploadTask.snapshot.ref.fullPath
                    })
                })

                setDialogTitle("Profile Banner Image Uploading")
                setDialogMessage("Profile banner image changed.")
                setTimeout(()=>{
                    setDialogMessage('')
                    setDialogTitle("Edit Profile Banner Image")
                },5000)
                setOpen(true)
                setUploading(false)
            }
        )
    }

    useEffect(()=>{ 
        setBannerPictureUrl(!profileBannerImageUrl ? defaultBannerImage : profileBannerImageUrl)
    },[setBannerPictureUrl,defaultBannerImage,profileBannerImageUrl])


    return <Dialog
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
                { !uploading && <img alt="profile_banner_picture" ref={coverImageRef} src={coverPictureUrl} width="100%" height="200px" style={{borderRadius : 0}}/>}
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
            <Button onClick={uploadNewSongCoverImage}>Upload New Profile Banner Image</Button>
        </DialogActions>
    </Dialog>
}
export default ProfileBannerEditor