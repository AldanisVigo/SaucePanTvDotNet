import Header from "../../Components/Header/Header"
import { auth,storage,firestore } from '../../firebase'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { useState, useEffect, useRef, useCallback } from 'react'
import SignIn from "../../Components/SignIn/SignIn"
import UploadBar from "./uploadbar"
import { doc, getDoc } from 'firebase/firestore'
import AsideMenu from "../../Components/AsideMenu/AsideMenu"
import './upload.css'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TermsAndConditions from "../TermsAndConditions/TermsAndConditions"

const Upload = () => {
    // const navigate = useNavigate()
    const [user,setUser] = useState<any>(null)
    const [percentUpload,setPercentUpload] = useState<number>(0.00)
    const [song , setSong] = useState<any>();
    const [agreedToTerms,setAgreedToTerms] = useState<boolean>(false)
    const [uploadLimit,setUploadLimit] = useState<number>(0)
    const uploadInputRef = useRef<any>()
    const [showDialog, setOpen] = useState<boolean>(false)
    const [dialogMessage,setDialogMessage] = useState<any>(null)
    const [dialogTitle,setDialogTitle] = useState<any>(null)
    const [uploading,setUploading] = useState<boolean>(false)
    const [showTerms,setShowTerms] = useState<boolean>(false)

    const getMyUploadLimit = useCallback(async () => {
        if(user){
            const usrRef = doc(firestore,'users/' + user.uid)
            const usr = await getDoc(usrRef)
            const data = usr.data()
            if(data){
                return data.limit
            }else{
                return false
            }
        }
    },[user])

    useEffect(()=>{
        let authUnsub = auth.onAuthStateChanged(usr=>{
            if(usr){
                setUser(usr)
            }else{
                setUser(null)
            }
        })

        getMyUploadLimit().then(lim=>{
            if(lim){
                setUploadLimit(parseInt(lim))
            }
        })
        

        return () => {
            if(authUnsub != null){
                authUnsub()
            }
        }
    },[user,setUser,getMyUploadLimit,setUploadLimit])

    

    const uploadSong = async () => {
        if(song == null || user == null)
            return
        
        const uploadLim = await getMyUploadLimit()
        if( uploadLim === false || uploadLim === 0 ){
            // alert("You have ran out of the free upload quota. Please sign up for the Pro plan to get unlimited uploads.")
            setDialogTitle("Please Upgrade")
            setDialogMessage("You have ran out of the free upload quota. Please sign up for the Pro plan to get unlimited uploads.")
            setOpen(true)

            return
        }

        if(!agreedToTerms){
            // alert("You must agree to our Terms and Conditions before uploading music to the platform.")
            setDialogTitle("Please Review")
            setDialogMessage("You must agree to our Terms and Conditions before uploading music to the platform.")
            setOpen(true)
            return
        }

        console.log(song)
        // storage.ref(`/images/${image.name}`).put(image)
        // .on("state_changed" , alert("success") , alert);
        const uploadRef = ref(storage,"/" + user.uid + "/songs/" + song.name)
        const uploadTask = uploadBytesResumable(uploadRef, song)
        uploadTask.on('state_changed', 
            (snapshot) => {
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
                // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                //     console.log('File available at', downloadURL)
                // })
                setTimeout(()=>{
                    getMyUploadLimit().then(lim=>{
                        setUploadLimit(lim)
                        uploadInputRef.current.files = null
                        uploadInputRef.current.value = null
                    })
                },6000)

                // alert("Your song has been uploaded and it's private on your profile. You can edit it there and set it to public when you're ready.")
                setDialogTitle("Upload Successful")
                setDialogMessage("Your song has been uploaded and it's private on your profile. You can edit it there and set it to public when you're ready.")
                setOpen(true)
                setUploading(false)
            }
        )
    }

    const handleClose = () => {
        setOpen(false);
    };

    if(user){
        return <div>
            <Header/>
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
            <div className="upload_container">
                <AsideMenu/>
                <main className="upload_container_main">
                    <h3 className="upload_music_label">Upload Music</h3>
                    <p>You have {uploadLimit} free uploads left.</p>
                    {/* <p>If you'd like to upload unlimited music, you can check out our <a href="/proplans" style={{textDecoration : 'none', color : 'orange', fontWeight : 'bold'}}>Pro Plans</a></p> */}
                    <p>Soon we will be offering Pro plans which include unlimited uploads and other features.</p>
                    {!uploading && <div style={{display: 'flex',flexDirection: 'column'}}>
                        <input ref={uploadInputRef} style={{alignSelf : 'center'}} accept=".mp3,audio/*" type="file" onChange={(e)=>{setSong(e.target!.files![0])}}></input>
                        <div style={{display: 'grid', gridTemplateColumns : '1fr 11fr', maxWidth : 'fit-content', alignSelf: 'center'}}>
                            <input name="agreee" type="checkbox" checked={agreedToTerms} onChange={e=>setAgreedToTerms(e.target.checked)}></input>
                            <label htmlFor="agreee">I agree to the <span onClick={e=>setShowTerms(true)} className="terms_and_conditions_link">Terms and Conditions</span></label>
                            <TermsAndConditions open={showTerms} setOpen={setShowTerms}/>
                        </div>
                        <button className="upload_button" style={{maxWidth: 200, alignSelf: 'center'}} onClick={uploadSong}>Upload</button>
                    </div>}
                    {uploading && <span>Please wait while your song is being uploaded.</span>}
                    <UploadBar percent={percentUpload}/>
                </main>
                 <Dialog
                    open={showDialog}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {dialogTitle}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    {dialogMessage}
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Ok
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    }else{
        return <div>
            <Header/>
            Please log in in order to upload music
            <SignIn/>
        </div>
    }
}

export default Upload