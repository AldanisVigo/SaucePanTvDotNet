import Header from "../../Components/Header/Header"
import { useState, useEffect } from 'react'
import './SignUp.css'
import { auth,firestore } from '../../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import passwordValidator from 'password-validator'
import validator from 'validator'
import { useNavigate } from "react-router-dom"
import { query, collection, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

var schema = new passwordValidator();
schema
.is().min(6)                                    // Minimum length 8
.is().max(12)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 1 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values



const SignUp = (props:any) => {
    const [email,setEmail] = useState<string>()
    const [pass,setPass] = useState<string>()
    const [passConf,setPassConf] = useState<string>()
    const [agreeTerms,setAgreeTerms] = useState<boolean>(false)
    const [user,setUser] = useState<any>(null)
    const [username,setUsername] = useState<any>(null)
    const [usernameAvaialable,setUsernameAvailable] = useState<boolean>(false)


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
        checkUsername(username).then(available=>{
            setUsernameAvailable(available)
        })
    },[username,setUsernameAvailable])

    const navigate = useNavigate()
    useEffect(()=>{
        let authUnsub = auth.onAuthStateChanged(usr=>{
            if(usr){
                setUser(usr)
                signOut(auth)
                alert("Thank you for registering. Please check your email for a confirmation email. We will now redirect you to the home page.")
                setTimeout(()=>{
                    navigate('/')
                },2000)
            }else{
                setUser(null)
            }
        })

        return ()=> {
            if(authUnsub){
                authUnsub()
            }
        }
    },[user,setUser,navigate])

    const submitForm = async (e:any) => {
        e.preventDefault();
        if(!agreeTerms){
            alert("You must agree to the terms and conditions to use this application.")
        }else{
            //The user has agreed to the terms and conditions

            const errors = []
            //Check that their email is valid
            if(email){
                if(validator.isEmail(email)){
                    if(pass !== '' && pass !== undefined){
                        let passCheck = schema.validate(pass)
                        console.log(passCheck)
                        if(passCheck === true){
                            //Email is valid and so is the password
                            if(passConf === pass){
                                if(username){
                                    if(!usernameAvaialable){
                                        errors.push("The username you chose is already taken. Please select a different one.")
                                    }else{
                                        //Email, password, and passconf are valid and passconf == pass
                                        const accountCreationResult = await createUserWithEmailAndPassword(auth,email,pass)
                                        const userDocRef = doc(firestore,'/users/' + accountCreationResult.user.uid)
                                        setTimeout(async ()=>{
                                            await updateDoc(userDocRef,{
                                                username : username
                                            })
                                        },2000)
                                        console.log(accountCreationResult)
                                    }
                                }else{
                                    errors.push("Please enter a username for your profile. We need this for your profile link.")
                                }
                            }else{
                                errors.push("Your passwords don't match. Make sure you typed them in correctly.")
                            }
                        }else{
                            errors.push("Provide a password between 6 and 12 characters long, include an uppercase letter, lowercase letter and number.")
                        }
                    }else{
                        errors.push("Please enter a password.")
                    }
                }else{
                    errors.push("Please provide a valid email address.")
                }
            }else{
                errors.push("Please provide your email address.") 
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

    if(!user){
        return <div className="signup_container">
            <Header/>
            <h3>Sign Up</h3>
            <div className="form_container">
                <form onSubmit={e=>e.preventDefault} className="signup_form">
                    <input type="email" placeholder="Email Address" onChange={e=>setEmail(e.target.value)} value={email}/>
                    <input type="password" placeholder="Password" onChange={e=>setPass(e.target.value)} value={pass}/>
                    <input type="password" placeholder="Confirm Password" onChange={e=>setPassConf(e.target.value)} value={passConf}/>
                    <input type="text" placeholder="Username" onChange={e=>setUsername(e.target.value)} value={username}/>
                    <span style={{color : usernameAvaialable ? 'lightgreen' : 'orange', textAlign : 'left'}}>Available: {usernameAvaialable ? 'yes' : 'no'}</span>
                    <fieldset name="terms_and_conditions">
                        <legend>Terms and Conditions</legend>
                        <input checked={agreeTerms} onChange={e=>setAgreeTerms(e.target.checked)} id="agree" type="checkbox"></input>
                        <label htmlFor="agree">I agree to the <a href="/termsandconditions" style={{textDecoration: 'none', color: 'white'}}>Terms and Conditions</a></label>
                    </fieldset>
                    <button onClick={e=>submitForm(e)}>Submit</button>
                </form>
            </div>
        </div>
    }else{
        return <div>
            <Header/>
            <h5>Thank you for signing up.</h5>
            <button onClick={e=>navigate('/')}>Home</button>
        </div>
    }
}

export default SignUp