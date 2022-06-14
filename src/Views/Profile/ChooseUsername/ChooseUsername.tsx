import { useState, useEffect } from 'react'
import { firestore,auth } from '../../../firebase'
import { useNavigate } from "react-router-dom"
import { query, collection, where, getDocs, doc, updateDoc } from 'firebase/firestore'
// import { signOut } from 'firebase/auth'
import { Dialog, DialogContent, DialogActions, Button, TextField} from '@mui/material'
import './ChooseUsername.css'
import TermsAndConditions from '../../TermsAndConditions/TermsAndConditions'

const ChooseUsername = ({open,setOpen}:any) => {
    const [agreeTerms,setAgreeTerms] = useState<boolean>(false)
    const [username,setUsername] = useState<any>(null)
    const [usernameAvaialable,setUsernameAvailable] = useState<boolean>(false)
    const [user,setUser] = useState<any>(null)
    const [showTerms,setShowTerms] = useState<boolean>(false)

    const nav = useNavigate()
    const checkUsername = async (username:any) => {
        if(username !== null && username !== '' && username.length >= 7){
            const usersCol = collection(firestore,'users')
            const usernameQuery = query(usersCol,where('username',"==",username))
            const usernameSnap = await getDocs(usernameQuery)
            return usernameSnap.empty
        }else{ 
            return false
        }
    }

    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                setUser(user)
            }else{
                setUser(null)
            }
        })

        checkUsername(username).then(available=>{
            setUsernameAvailable(available)
        })
    },[username,setUsernameAvailable])

    const submitForm = async (e:any) => {
        e.preventDefault();
        if(!agreeTerms){
            alert("You must agree to the terms and conditions to use this application.")
        }else{
            //The user has agreed to the terms and conditions

            const errors = []
            //Check that their email is valid
           
            if(username){
                if(!usernameAvaialable){
                    errors.push("The username you chose is already taken. Please select a different one.")
                }else{
                    //Set the username
                    console.log("Setting your username to " + username)
                    const userDocRef = doc(firestore,'/users/' + user.uid)
                    await updateDoc(userDocRef,{
                        username : username
                    })
                    alert("Your username has been set to " + username + " redirecting you to your new profile.")
                    nav('/profiles/' + username)
                }
            }else{
                errors.push("Please enter a username for your profile. We need this for your profile link.")
            }
            let msg = ''
            errors.forEach((err,i)=>{
                msg += i+1 + ". " + err + "\n"
            })
            if(msg){
                alert(msg)
            }
        }
    }

    return <Dialog open={open} onClose={e=>setOpen(false)}>
        <DialogContent>
            <form onSubmit={e=>e.preventDefault} className="username_form">
                <TextField label="Preferred Username" type="text" placeholder="Preferred Username" onChange={e=>setUsername(e.target.value)} value={username}/>&nbsp;
                <span style={{color : usernameAvaialable ? 'lightgreen' : 'orange', textAlign : 'left', position: 'relative', top: 16, left: 4}}>Available: {usernameAvaialable ? 'yes' : 'no'}</span>
                <br/><br/>
                <fieldset name="terms_and_conditions">
                    <legend>Terms and Conditions</legend>
                    <input checked={agreeTerms} onChange={e=>setAgreeTerms(e.target.checked)} id="agree" type="checkbox"></input>
                    <label htmlFor="agree">I agree to the <span className="terms_and_conditions_link" onClick={e=>{e.preventDefault();setShowTerms(true)}}>Terms and Conditions</span></label>
                </fieldset>
                <TermsAndConditions open={showTerms} setOpen={setShowTerms}/>
            </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={e=>setOpen(false)}>Close</Button>
            <Button onClick={e=>submitForm(e)}>Select Username</Button>
        </DialogActions>
    </Dialog>
}

export default ChooseUsername