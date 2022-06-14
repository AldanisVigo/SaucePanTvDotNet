import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { firestore } from '../../../firebase';
import { collection,addDoc } from 'firebase/firestore'
import { Close } from '@mui/icons-material';
import './Videos.css'
import VideoPlayer from './VideoPlayer/VideoPlayer';
import { TextField } from '@mui/material';
const Videos = ({open,setOpen,user,userObject,profileOwnerUid,videos}:any) => {
    const [dialogTitle,_] = useState<any>("Videos")
    const [newVideoId,setNewVideoId] = useState<any>(null)
    const [addingVideo,setAddVideo] = useState<boolean>(false)

    const handleClose = () => {
        setOpen(false)
    }

    const addVideo = async () => {
        // setAddVideo(true)
        // console.log("Adding new video with id: " + newVideoId)
        const videosRef = collection(firestore,'/users/' + user.uid + '/videos/')
        await addDoc(videosRef,{
            video_id : newVideoId
        })
        setNewVideoId(null)
        setAddVideo(false)
    }

    return <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen={true}
        >
        {/* <DialogTitle id="alert-dialog-title">
            {dialogTitle}
        </DialogTitle> */}
        <DialogContent className="videos_dialog">
            <DialogContentText id="alert-dialog-description" style={{textAlign : 'center', padding: '0px', margin: '0px'}}>
                <div className="videos_header">
                    <span className="title">Videos</span><Close onClick={handleClose} style={{float: 'right', cursor: 'pointer'}} className="close_button"/>
                </div>
                <div className="videos_content">
                    {videos && videos.length > 0 && !addingVideo && <VideoPlayer videos={videos} profileOwnerUid={profileOwnerUid} user={user} userObject={userObject} />}
                    {addingVideo && <div>
                        {videos.length === 0 && addingVideo && <div style={{padding: 10, color: 'white'}}>
                            Add your first video<br></br>
                            <TextField style={{background: 'white'}} type="text" placeholder="YouTube Video ID" onChange={e=>setNewVideoId(e.target.value)}/><br/><br/>
                            <Button color="primary" style={{background:  'white'}} onClick={addVideo}>Add Video From YouTube</Button><br/><br/>
                            <Button color="primary" style={{background:  'white'}} onClick={e=>setOpen(false)}>Cancel</Button>

                        </div>}
                        {videos.length > 0 && addingVideo && <div style={{padding : 10, color: 'white'}}>
                            Add new video<br></br>
                            <TextField style={{background: 'white'}} type="text" placeholder="YouTube Video ID" onChange={e=>setNewVideoId(e.target.value)}/><br/><br/>
                            <Button color="primary" style={{background:  'white'}} onClick={addVideo}>Add New Video From YouTube</Button><br/><br/>
                            <Button color="primary" style={{background:  'white'}} onClick={e=>setAddVideo(false)}>Cancel</Button>
                        </div>}
                    </div>}
                    {videos.length === 0 && !addingVideo && <div style={{color: 'white'}}>Haven't added any videos yet.</div>}
                </div>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            {!addingVideo && user.uid === profileOwnerUid && <Button onClick={e=>setAddVideo(true)}>Add Video</Button>}
            <Button onClick={handleClose}>
                Close
            </Button>
        </DialogActions>
    </Dialog>
}

export default Videos