import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material'
import { useState,useRef } from 'react'
import './NewBattleDialog.scss'
import { firestore,storage } from '../../firebase'
import { collection, addDoc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import SignIn from '../../Components/SignIn/SignIn'
import UploadBar from '../Upload/uploadbar'

const NewBattleDialog = ({open,setOpen,user}) => {
    const [title,setTitle] = useState('') 
    const [cover,setCover] = useState(null)
    const [percentUpload,setPercentUpload] = useState(0)
    const [uploading,setUploading] = useState(false)
    const [description,setDescription] = useState('')
    const default_battle_image_src = "https://firebasestorage.googleapis.com/v0/b/trapppcloud.appspot.com/o/App%20Images%2Fbattledefaultimage.jpeg?alt=media&token=61626dda-c32b-4747-a6fb-94719a55c374"
    const newBattleImageRef = useRef()
    const newBattleImagePreviewRef = useRef()
    const imageChanged = (e) => {
        const selectedFile = e.target.files[0]
        setCover(selectedFile)
        const reader = new FileReader()
        reader.onload = function(event) {
            newBattleImagePreviewRef.current.src = event.target.result;
        }
        reader.readAsDataURL(selectedFile);
    }

    const hostNewBattle = async () => {
        const my_battles_collection_ref = collection(firestore,'/users/' + user.uid + '/battles')
        try{
            //Upload the image
            const uploadRef = ref(storage,"/" + user.uid + "/battles/battle_images/" + cover.name)
            const uploadTask = uploadBytesResumable(uploadRef, cover)
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
                async () => {
                    setPercentUpload(0)
                    alert("Your new battle has been created.")
                    setTitle('')
                    newBattleImagePreviewRef.current.src = default_battle_image_src
                    setUploading(false)
                    setOpen(false)

                    //Do this in the background
                    const dlurl = await getDownloadURL(uploadTask.snapshot.ref) //Get the download url
                    //Save the battle
                    await addDoc(my_battles_collection_ref,{
                        title : title,
                        cover : dlurl,
                        description: description
                    })
                    
                }
            )
        }catch(err){
            console.error(err)
        }
    }

    return <Dialog open={open} onClose={e=>setOpen(false)}>
        <DialogTitle>
            Host New Battle
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                {user && <div  style={{padding: 20}} className="new_battle_dialog_content">
                    <TextField value={title} onChange={e=>setTitle(e.target.value)} placeholder="Track vs Track" label="Battle Title"/>
                    <br/><br/>
                    <TextField multiline rows="10" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Battle Description" label="Battle Description"/>
                    <span>Add a cover image</span>
                    <input type="file" ref={newBattleImageRef} accept={['image/jpeg','image/png','image/jpg']} onChange={e=>imageChanged(e)}/>
                    <img src={default_battle_image_src} className="battle_cover_image_preview" ref={newBattleImagePreviewRef}/>
                    {uploading && <UploadBar percent={percentUpload}/>}
                </div>}
                {!user && <SignIn/>}
            </DialogContentText>
            <DialogActions>
                <Button onClick={e=>setOpen(false)}>Cancel</Button>
                {user && <Button onClick={e=>hostNewBattle()}>Host</Button>}
            </DialogActions>
        </DialogContent>
    </Dialog>
}

export default NewBattleDialog