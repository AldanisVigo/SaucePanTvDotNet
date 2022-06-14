import './SignIn.css';
import { auth } from '../../firebase'
import { signInWithEmailAndPassword,sendPasswordResetEmail } from 'firebase/auth'
import { useState,useEffect } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { TextField } from '@mui/material'

const SignIn = () => {
    const [email,setEmail] = useState<string>()
    const [password,setPassword] = useState<string>()
    const [user,setUser] = useState<any>()
    const [showDialog, setOpen] = useState<boolean>(false)
    const [dialogMessage,setDialogMessage] = useState<any>(null)
    const [dialogTitle,setDialogTitle] = useState<any>(null)
    const provider = new FacebookAuthProvider()

    useEffect(()=>{
        let authUnsub = auth.onAuthStateChanged(usr=>{
            if(usr){
                setUser(usr)
            }else{
                setUser(null)
            }
        })

        return ()=>{
            authUnsub()
        }
    },[user,setUser])

    const attemptSignIn = async (e:any) => {
        e.preventDefault()
        if(email !== undefined && password !== undefined){
            try{
                await signInWithEmailAndPassword(auth,email,password)
            }catch(err:any){
                setDialogTitle("Error")
                setDialogMessage(err.code)
                setOpen(true)             
            }
        }else{
            // alert("Please make sure you typed in your email and password before attempting to sign in.")
            setDialogTitle("Error")
            setDialogMessage("Please make sure you typed in your email and password before attempting to sign in.")
            setOpen(true)
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const initiateFacebookLogin = () => {
        // provider.addScope('user_birthday')
        signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            console.log(user)
            setUser(user)

            //Check if the user's username is setup
            console.log("Facebook User UID: " + user.uid)

            

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            // const credential = FacebookAuthProvider.credentialFromResult(result);
            // const accessToken = credential?.accessToken;

            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);
            console.error(error)
            // ...
        });
    }

    const initiatePasswordRecovery = async () => {
        if(email !== undefined && email !== null){
            try{
                await sendPasswordResetEmail(auth,email!)
                alert("We have sent you a password recovery email. Please check your spam folder if you don't see it in your inbox.")
            }catch(err){
                alert("There was an unexpected error. Please try again.")
                console.error(err)
            }
        }else{
            alert("Please enter an email in the email field and we will send you a recovery email to that address.")
        }
    }

    if(!user){
        return <div className="sign_in_menu" onClick={e=>e.stopPropagation()}>
            Welcome to the SaucePan. Please sign in.<br/><br/>
            <form className="sign_in_form" onSubmit={e=>e.preventDefault()} style={{background: 'white', padding: 10, borderRadius: 10}}>
                <TextField label="Email" className="login_input" defaultValue={email} onChange={e=>setEmail(e.target.value)} type="text" placeholder="Email" onClick={e=>e.preventDefault()}/>
                <TextField label="Password" className="login_input" defaultValue={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" onClick={e=>e.preventDefault()}/>
                <Button className="login_button" onClick={attemptSignIn}>Sign In</Button>
                <Button className="recover_password_button" onClick={initiatePasswordRecovery}>Recover Password</Button>
                {/* <button className="facebook_login_button" onClick={initiateFacebookLogin}>Facebook Login</button> */}
                <div className="facebook_login_button" onClick={initiateFacebookLogin}></div>
                {/* <button className="close_button">X</button> */}
            </form>
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
    }else{
        return <div>
            <span>Welcome {user.email}</span>
        </div>
    }
}

export default SignIn;
