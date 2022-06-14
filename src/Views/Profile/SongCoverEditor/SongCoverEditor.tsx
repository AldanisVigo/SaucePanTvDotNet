import { uploadBytesResumable,ref, getDownloadURL } from 'firebase/storage'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useState,useRef,useEffect } from 'react';
import UploadBar from "../../Upload/uploadbar"
import { storage, firestore } from '../../../firebase';
import { doc,updateDoc } from 'firebase/firestore';

const SongCoverEditor = ({open,setOpen,song,user}:any) => {
    const handleClose = () => {
        setOpen(false)
    }

    const [dialogTitle,setDialogTitle] = useState<any>("Update Song Cover Image")
    const [dialogMessage,setDialogMessage] = useState<any>("")
    const [uploading,setUploading] = useState<boolean>(false)
    const [percentUpload,setPercentUpload] = useState<number>(0)
    const coverImageRef:any = useRef()
    const uploadInputRef:any = useRef()
    const [coverPictureFile,setCoverPictureFile] = useState<any>()
    const [coverPictureUrl,setCoverPictureUrl] = useState<any>()
    const defaultCoverImage = "https://firebasestorage.googleapis.com/v0/b/trapppcloud.appspot.com/o/App%20Images%2Fdefault_music_cover.webp?alt=media&token=28ef8400-8017-4ada-8291-d1f32b1b8209"
    
    const changePicture = (e:any) => {
        setCoverPictureFile(e.target!.files![0])
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.addEventListener("load", function () {
            setCoverPictureUrl(reader.result)
        }, false)
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    const uploadNewSongCoverImage = () => {
        const uploadRef = ref(storage,"/" + user.uid + "/song_covers/" + coverPictureFile.name)
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
                    const userDocRef = doc(firestore, "/users/" + user.uid + "/songs/" + song.id)
                    await updateDoc(userDocRef,{
                        coverUrl : downloadURL,
                        cover_image_path : uploadTask.snapshot.ref.fullPath
                    })
                })

                // alert("Your song has been uploaded and it's private on your profile. You can edit it there and set it to public when you're ready.")
                setDialogTitle("Song Cover Image Uploading")
                setDialogMessage("Song cover image changed.")
                setTimeout(()=>{
                    setDialogMessage('')
                    setDialogTitle("Edit Song Cover Image")
                },5000)
                setOpen(true)
                setUploading(false)
            }
        )
    }

    useEffect(()=>{ 
        setCoverPictureUrl(!song?.coverUrl ? defaultCoverImage : song?.coverUrl)
    },[setCoverPictureUrl,defaultCoverImage,song])


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
                { !uploading && <img alt="song_cover_picture" ref={coverImageRef} src={coverPictureUrl} width="200px" height="200px" style={{borderRadius : 100}}/>}
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
            <Button onClick={uploadNewSongCoverImage}>Upload New Cover Image</Button>
        </DialogActions>
    </Dialog>
}
export default SongCoverEditor