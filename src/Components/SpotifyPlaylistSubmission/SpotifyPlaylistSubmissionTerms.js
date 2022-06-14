import { Dialog, DialogTitle, DialogContent, DialogContentText,DialogActions, Button} from '@mui/material'
const SpotifyPlaylistSubmissionTerms = ({open,setOpen}) => {
    return <Dialog open={open} onClose={e=>setOpen(false)}>
        <DialogTitle title="Submissions Terms and Conditions"></DialogTitle>
        <DialogContent>
            <DialogContentText>
                <div className="spotify_playlist_submission_terms" style={{padding: 20}}>
                    <h3>Terms and Conditions</h3>
                    <h6>I. Ownership</h6>
                    <p> 
                        You agree that you own the track you are submitting to us. And that it does not belong to someone other than yourself.
                    </p>

                    <h6>II. Playlist Curation Agreement</h6>
                    <p>
                        You agree to allow SaucePanTv.net to add your track to their playlists as part of this submission agreement.
                    </p>
                </div>
            </DialogContentText>
            <DialogActions>
                <Button onClick={e=>setOpen(false)}>Close</Button>
            </DialogActions>
        </DialogContent>
    </Dialog>
}

export default SpotifyPlaylistSubmissionTerms