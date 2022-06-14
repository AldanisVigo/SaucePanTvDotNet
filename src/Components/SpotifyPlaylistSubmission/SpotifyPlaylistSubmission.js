import { Button, TextField, Typography, Checkbox, FormControlLabel } from '@mui/material'
import { firestore,auth } from '../../firebase'
import { collection, addDoc, query, getDocs,onSnapshot, where } from 'firebase/firestore'
import { useState,useEffect } from 'react'
import SignIn from '../SignIn/SignIn'
import './SpotifyPlaylistSubmission.css'
import { useNavigate } from 'react-router-dom'
import SpotifyPlaylistSubmissionTerms from './SpotifyPlaylistSubmissionTerms'

const SpotifyPlaylistSubmission = () => {
    const [trackUrl,setTrackUrl] = useState('')
    const [user,setUser] = useState(null)
    const [submission,setSubmission] = useState(null)
    const [agreeToTerms,setAgreeToTerms] = useState(false)
    const nav = useNavigate()

    useEffect(()=>{
        try{
            auth.onAuthStateChanged(async user=>{
                if(user){
                    setUser(user)
                    const spotify_playlist_submissions_ref = collection(firestore,'spotify_playlist_submissions')
                    const existing_submission_query = query(spotify_playlist_submissions_ref,where('submitter','==',user.email))
                    onSnapshot(existing_submission_query,(existing_submissions)=>{
                        console.log(existing_submissions)
                        if(existing_submissions.docs.length >= 1){
                            const sub = existing_submissions.docs[0].data()
                            setSubmission(sub)
                        }else{
                            setSubmission(null)
                        }
                    })
                }else{
                    setUser(null)
                }
            })
        }catch(err){
            console.error(err)
        }
    },[user,setUser])

    const submitTrack = async () => {
        if(trackUrl !== '' && agreeToTerms === true){
            try{
                const spotify_playlist_submissions_ref = collection(firestore,'spotify_playlist_submissions')
                const submission = {
                    timestamp : new Date(),
                    trackUrl : trackUrl,
                    submitter : user.email
                }

                await addDoc(spotify_playlist_submissions_ref,submission)

                alert("Your track has been submitted, we will have a listen and let you know right here in a little while weather it was accepted or denied.")

            }catch(err){
                console.error(err)
            }
        }else if(agreeToTerms === false && trackUrl !== null){
            alert("Please make sure you agree to our terms and conditions before submitting your track.")
        }else{
            alert("Please paste in a track url from Spotify.")
        }
    }

    const terms_label = { inputProps: { 'aria-label': 'I agree to the terms and conditions' } };
    const [showSubmissionTerms,setShowSubmissionTerms] = useState(false)

    
    return <div className="spotify_playlist_submission">
        {!user && <SignIn/>}
        {user && submission && <div>
            Thanks for submitting your song.
            {(!submission.approved && !submission.denied) && <span> We will have a listen to your track, and if we think it fits our Spotify Playlist, we will add you and let you know right here.</span>}
            {submission.approved && <span>Your submission was approved and added to our Spotify playlist.</span>}
            {submission.denied && <span>Your submission was denied. If you'd like a second chance to submit, please get ahold of us through our contact page.</span>}

            {submission.reason}
            
        </div>}
        {user && !submission && <div>
            <div className="spotify_playlist_submission_form" style={{padding: 20}}>
                <Typography>You are limited to 1 submission, send your best track.</Typography>
                <TextField value={trackUrl} onChange={e=>setTrackUrl(e.target.value)} placeholder="Spotify Track URL"/>
                <FormControlLabel
                    label="I agree to the terms and conditions"
                    control={<Checkbox checked={agreeToTerms} onChange={e=>setAgreeToTerms(e.target.checked)} />}
                />
                <Button onClick={e=>setShowSubmissionTerms(true)}>Read Terms and Conditions</Button>
                <SpotifyPlaylistSubmissionTerms open={showSubmissionTerms} setOpen={setShowSubmissionTerms}/>
                <Button onClick={e=>submitTrack()}>Submit Track</Button>
            </div>
        </div>}
    </div>
}

export default SpotifyPlaylistSubmission