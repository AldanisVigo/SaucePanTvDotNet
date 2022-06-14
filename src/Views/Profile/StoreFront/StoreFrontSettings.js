import { Dialog, DialogContent, DialogActions,Button,List,ListItem,ListItemAvatar,ListItemText, ListItemButton, TextField } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Edit,Save } from '@mui/icons-material'
import { brands } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used
import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { firestore } from '../../../firebase'

const StoreFrontSettings = ({open,setOpen,userObject,user}) => {
    const [editPaypalClientId,setEditPaypalClientId] = useState(false)
    const [editPaypalSandboxClientId,setEditPaypalSandboxClientId] = useState(false)
    const [tmpPaypalClientId,setTmpPaypalClientId] = useState('')
    const [tmpPaypalSandboxClientId,setTmpPaypalSandboxClientId] = useState('')

    const beginEdit = (which) => {
        if(which === 'liveid'){
            setTmpPaypalClientId(userObject.paypalClientId)
            setEditPaypalClientId(true)
        }else if(which === 'sandboxid'){
            setTmpPaypalSandboxClientId(userObject.paypalSandboxClientId)
            setEditPaypalSandboxClientId(true)
        }
    }

    const doneEdit = async (which) => {
        if(which === 'liveid'){
            const userDocRef = doc(firestore,'/users/' + user.uid)
            await updateDoc(userDocRef,{
                paypalClientId : tmpPaypalClientId
            })
            setEditPaypalClientId(false)
        }else if(which === 'sandboxid'){
            const userDocRef = doc(firestore, '/users/' + user.uid)
            await updateDoc(userDocRef,{
                paypalSandboxClientId : tmpPaypalSandboxClientId
            })
            setEditPaypalSandboxClientId(false)
        }
    }

    return <Dialog open={open} onClose={e=>setOpen(false)}>
        <DialogContent>
            <div className="store_front_settings">
                <strong>StoreFront Settings</strong>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <FontAwesomeIcon icon={brands('paypal')} size="4x"/>
                        </ListItemAvatar>
                        <ListItemText>
                            {!editPaypalClientId && <div><strong style={{fontSize : 'x-small'}}>PayPal App Live Client Id :</strong><br/> {userObject.paypalClientId || 'not set'}</div>}
                            {editPaypalClientId && <TextField fullWidth placeholder="PayPal App Client Id" label="PayPal App Client Id" value={tmpPaypalClientId} onChange={e=>setTmpPaypalClientId(e.target.value)}></TextField>}
                        </ListItemText>
                        {!editPaypalClientId && <ListItemButton onClick={e=>beginEdit('liveid')}>
                            <Edit/>
                        </ListItemButton>}
                        {editPaypalClientId && <ListItemButton onClick={e=>doneEdit('liveid')}>
                            <Save/>
                        </ListItemButton>}
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <FontAwesomeIcon icon={brands('paypal')} size="4x"/>
                        </ListItemAvatar>
                        <ListItemText>
                            {!editPaypalSandboxClientId && <div><strong style={{fontSize : 'x-small'}}>PayPal App Sandbox Client Id :</strong><br/> {userObject.paypalSandboxClientId || 'not set'}</div>}
                            {editPaypalSandboxClientId && <TextField fullWidth placeholder="PayPal App Sandbox Client Id" label="PayPal App Sandbox Client Id" value={tmpPaypalSandboxClientId} onChange={e=>setTmpPaypalSandboxClientId(e.target.value)}></TextField>}
                        </ListItemText>
                        {!editPaypalSandboxClientId && <ListItemButton onClick={e=>beginEdit('sandboxid')}>
                            <Edit/>
                        </ListItemButton>}
                        {editPaypalSandboxClientId && <ListItemButton onClick={e=>doneEdit('sandboxid')}>
                            <Save/>
                        </ListItemButton>}
                    </ListItem>
                </List>
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={e=>setOpen(false)}>Close</Button>
        </DialogActions>
    </Dialog>
}

export default StoreFrontSettings