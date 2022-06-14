import { useState } from 'react'
import { Dialog, DialogContent, DialogActions, Button, TextField, Collapse, List, ListItem, ListItemAvatar, ListItemText, IconButton} from '@mui/material'
import './StoreFront.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { Close, Error, Settings } from '@mui/icons-material'
import { firestore } from '../../../firebase'
import { doc, updateDoc } from 'firebase/firestore'
import StoreFrontSettings from './StoreFrontSettings'
import DripForm from './DripForm'

const StoreFront = ({open,setOpen,user,userObject,profileOwnerUid,drip}) => {
    const [paypalClientId,setPaypalClientId] = useState('')
    const [sandboxClientId,setSandboxClientId] = useState('')
    const [showErrors,setShowErrors] = useState(false)
    const [errors,setErrors] = useState('')
    const [showSettings,setShowSettings] = useState(false)
    const [selectedDrip,setSelectedDrip] = useState(null)
    const [showDripForm,setShowDripForm] = useState(false)
    const [dripFormMode,setDripFormMode] = useState('add')

    const hasPayPalClientId = () => {
        if(userObject !== null && userObject !== undefined){
            if('paypalClientId' in userObject){
                if(userObject.paypalClientId !== null && userObject.paypalClientId !== undefined && userObject.paypalClientId !== ''){
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
        }else{
            return false
        }
    }

    const checkInput = () => {
        let errs = []

        if(paypalClientId === ''){
            errs.push("Please paste in a client id for your PayPal app.")
        }  

        if(sandboxClientId === ''){
            errs.push("Please paste in a sandbox client id for your PayPal app.")
        }

        if(errs.length > 0){
            setErrors(errs)
            setShowErrors(true)
            return false
        }else{
            return true
        }
    }

    const initializeStore = async () => {
        if(checkInput()){
            const userDocRef = doc(firestore,'/users/' + user.uid)
            try{
                await updateDoc(userDocRef,{
                    paypalClientId : paypalClientId,
                    paypalSandboxClientId : sandboxClientId
                })
            }catch(err){
                console.error(err)
                alert("There was an unexpected error.")
            }
        }
    }

    const beginEditDrip = (dripIndex) => {
        console.log("Drip click event firing.")
        setSelectedDrip(drip[dripIndex])
        setDripFormMode('edit')
        setShowDripForm(true)
    }

    return <Dialog open={open} onClose={e=>setOpen(false)}>
        <DialogContent>
            <StoreFrontSettings userObject={userObject} user={user} open={showSettings} setOpen={setShowSettings}/>
            <div className="store_front">  
                <strong>Drip Store</strong><br/><br/>  
                {/* {userObject && hasPayPalClientId() && <span>You have {drip.length} drip for sale</span>} */}
                {userObject && hasPayPalClientId() && <List>
                    {drip && drip.map((d,i)=><ListItem key={i} onClick={e=>beginEditDrip(i)}>
                        <ListItemAvatar>
                            <img src={d.imageUrl} width="45px" height="45px"/>
                        </ListItemAvatar>
                        <ListItemText>
                            {d.title} - ${d.price}
                        </ListItemText>
                    </ListItem>)}
                </List>}
                {userObject && !hasPayPalClientId() && user.uid === profileOwnerUid && <div style={{display : 'grid', gridTemplateColumns : 'auto auto'}}>
                    <FontAwesomeIcon icon={brands('paypal')} size="5x"/>
                    <div style={{display: 'flex', flexDirection : 'column', gap: '8px', justifyContent : 'center', alignContent : 'center', alignItems : 'center', textAlign : 'center'}}>
                        To initialize your PayPal store go to https://developer.paypal.com, sign in and create a new App. Copy your PayPal App's Client Id and Sandbox Client Id and paste them in. Then click the button below.
                        <br/><br/>
                        <TextField placeholder="PayPal App Client ID" label="PayPal App Client Id" value={paypalClientId} onChange={e=>setPaypalClientId(e.target.value)}/><br/>
                        <TextField placeholder="PayPal App Sandbox Client ID" label="PayPal App Sandbox Client Id" value={sandboxClientId} onChange={e=>setSandboxClientId(e.target.value)}/>
                        <Collapse in={showErrors}>
                            <Close style={{float: 'right'}} onClick={e=>setShowErrors(false)}/>
                            <List>
                                {errors && errors.map((e,i)=><ListItem key={i}>
                                    <ListItemAvatar>
                                        <Error/>
                                    </ListItemAvatar>
                                    <ListItemText>
                                        {e}
                                    </ListItemText>
                                </ListItem>)}
                            </List>
                        </Collapse>
                    </div>
                </div>}
                {user.uid !== profileOwnerUid && drip.length === 0 && <span>There's no drip for sale yet.</span>}
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={e=>setOpen(false)}>Close</Button>
            {user && user.uid === profileOwnerUid && hasPayPalClientId() && <Button onClick={e=>setShowDripForm(true)}>Add Drip</Button>}
            <DripForm selectedDrip={selectedDrip} open={showDripForm} setOpen={setShowDripForm} user={user} mode={dripFormMode}/>
            {user && user.uid === profileOwnerUid && hasPayPalClientId() && <IconButton children={<Settings/>} onClick={e=>setShowSettings(true)}/>}

            {!hasPayPalClientId() && user.uid === profileOwnerUid && <Button onClick={e=>initializeStore()}>Initialize PayPal Store</Button>}

        </DialogActions>
    </Dialog>
}

export default StoreFront