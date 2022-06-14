import { auth, firestore } from '../../../firebase'
import { addDoc, collection } from 'firebase/firestore'
import { useState,useEffect } from 'react'
import Select from 'react-select'
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography, Button, TextField, FormControlLabel, Checkbox } from '@mui/material'
import './DiscoveryForm.css'
import SelectUSState from 'react-select-us-states';

const DiscoveryForm = ({open,setOpen}) => {
    const [user,setUser] = useState(null)
    const [name,setName] = useState('')
    const [last_name, setLastName] = useState('')
    const [artistName,setArtistName] = useState('')
    const [email,setEmail] = useState('')
    const [genre,setGenre] = useState('Trap')
    const [facebookLink,setFacebookLink] = useState('')
    const [spotifyLink,setSpotifyLink] = useState('')
    const [soundcloudLink,setSoundcloudLink] = useState('')
    const [signed,setSigned] = useState(false)
    const [label,setLabel] = useState('')
    const [state,setState] = useState('')
    const [city,setCity] = useState('')
    const [willingToTour,setWillingToTour] = useState('')

    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                setUser(user)
            }else{
                setUser(null)
            }
        })
    })

    const genres = [
        {label : "Trap", value : "Trap"},
        {label : "Hip-Hop", value : "Hip-Hop"},
        {label : "R&B", value : "R&B"}
    ]

    const checkInput = () => {
        let errors = []

        if(name === ''){
            errors.push("Please enter your first name.")
        }

        if(last_name === ''){
            errors.push("Please enter your last name.")
        }

        if(email === ''){
            errors.push("Please enter your email address.")
        }

        if(genre === null){
            errors.push("Please select your primary genre.")
        }
        
        if(facebookLink === '' && spotifyLink === '' && soundcloudLink === ''){
            errors.push("Please include either a facebook profile link, spotify artist link, or soundcloud profile link that contains music.")
        }

        if(city === null){
            errors.push("Please tell us what city you're from.")
        }

        if(state === null){
            errors.push("Please tell us what state you are from.")
        }

        if(errors.length > 0){
            let msg = ''
            for(let i = 0; i < errors.length; i++){
                msg = msg + '\n' + Number(i+1) + " - " + errors[i];
            }
            alert(msg)
            return false
        }else{
            return true
        }
    }

    const submitDiscoveryForm = async () => {
        if(checkInput() === true){
            try{
                const discovery_form_collection_ref = collection(firestore,'discovery_entries')
                await addDoc(discovery_form_collection_ref,{
                    timestamp : new Date(),
                    first_name : name,
                    last_name : last_name,
                    artistName : artistName,
                    genre : genre,
                    email : email,
                    city: city,
                    state : state,
                    signed : signed,
                    label : label,
                    spotifyLink : spotifyLink,
                    soundcloudLink : soundcloudLink,
                    facebookLink : facebookLink,
                    willingToTour : willingToTour
                })

                setName('')
                setLastName('')
                setArtistName('')
                setGenre('')
                setEmail('')
                setCity('')
                setState(null)
                setSigned(null)
                setLabel(null)
                setSpotifyLink('')
                setSoundcloudLink('')
                setFacebookLink('')
                setWillingToTour(null)
                alert("We have received your discovery form. Please allow some time for us to look over it and we will get back to you via email. Thanks for taking the time to send in your information.")
                setOpen(false)
            }catch(err){
                console.error(err)
            }
        }
    }

    return <Dialog open={open} onClose={e=>setOpen(false)}>
        <DialogTitle title="Discovery Submission"></DialogTitle>
        <DialogContent>
            <DialogContentText>
                <div className="discovery_entry" style={{textAlign : 'center'}}>
                     <Typography>
                        Please enter the details below, and we'll get back to you if you caught our eye.
                    </Typography>
                    <br/>
                    <TextField placeholder="First Name" value={name} onChange={e=>setName(e.target.value)}/>
                    <TextField placeholder="Last Name" value={last_name} onChange={e=>setLastName(e.target.value)}/>
                    <TextField placeholder="Artistic Name" value={artistName} onChange={e=>setArtistName(e.target.value)}/>
                    <TextField placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)}/>
                    <TextField placeholder="Facebook Profile Link" value={facebookLink} onChange={e=>setFacebookLink(e.target.value)}/>
                    <TextField placeholder="Soundcloud Profile Link" value={soundcloudLink} onChange={e=>setSoundcloudLink(e.target.value)}/>
                    <TextField placeholder="Spotify Artist Link" value={spotifyLink} onChange={e=>setSpotifyLink(e.target.value)}/>
                     <FormControlLabel
                        label="I am signed to a label or sub-label"
                        control={<Checkbox checked={signed} onChange={e=>setSigned(e.target.checked)} />}
                    />
                    {signed && <TextField placeholder="Label Name" value={label} onChange={e=>setLabel(e.target.value)}/>}
                    <Select value={genre} options={genres} onChange={e=>setGenre(e)} placeholder="My Primary Genre"/>
                    <FormControlLabel
                        label="I am willing to tour across the United States."
                        control={<Checkbox checked={willingToTour} onChange={e=>setWillingToTour(e.target.checked)} />}
                    />
                    <FormControlLabel
                        label="&nbsp;is my home state."
                        control={
                            <SelectUSState placeholder="State" value={state} onChange={e=>setState(e)}/>
                        }
                    />
                    <TextField placeholder="My City" value={city} onChange={e=>setCity(e.target.value)}/>
                </div>
            </DialogContentText>
            <DialogActions>
                <Button color="warning" onClick={e=>setOpen(false)}>Cancel</Button>
                <Button color="primary" onClick={e=>submitDiscoveryForm()}>Submit</Button>
            </DialogActions>
        </DialogContent>    
    </Dialog>
   
}

export default DiscoveryForm