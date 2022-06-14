import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { firestore } from '../../../firebase';
import { doc, updateDoc,increment } from 'firebase/firestore'

const SongDeleteDialog = ({open,setOpen,song,user}:any) => {

    const handleClose = () => {
        setOpen(false)
    }

    const deleteSong = async () => {
        const songDocumentReference = doc(firestore,"/users/" + user.uid + "/songs/" + song.id)
        try{
            await updateDoc(songDocumentReference,{
                trashed : true
            })

            const userDocRef = doc(firestore,'users/' + user.uid)
            await updateDoc(userDocRef,{
                limit : increment(1)
            }) 

            alert("Song deleted.")
            setOpen(false)
        }catch(err){
            console.error(err)
        }
    }

    const [dialogTitle,] = useState<any>("Delete Song")
    const [dialogMessage,] = useState<any>("Are you sure you want to delete the song and all the data associated with it including comments, plays and likes?")
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
                {dialogMessage && dialogMessage}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>
                Cancel
            </Button>
            <Button color="error" onClick={deleteSong}>Delete Song</Button>
        </DialogActions>
    </Dialog>
}

export default SongDeleteDialog