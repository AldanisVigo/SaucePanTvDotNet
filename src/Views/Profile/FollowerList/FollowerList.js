import { Dialog, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemAvatar, ListItemText,ListItemButton } from '@mui/material'
import { DeleteForever } from '@mui/icons-material'
import { useEffect,useState } from 'react'
import { firestore } from '../../../firebase'
import { doc, getDoc, deleteDoc,collection, getDocs } from 'firebase/firestore'

const FollowerList = ({open,setOpen, followers,user}) => {
    const [followerExtendedList,setFollowerExtendedList] = useState([])

    const getFollowerData = async (s,fl) => {
        let extlist = []
        for(let f = 0; f < fl.length; f++){
            const currentFollower = followers[f]
            const followerDocumentReference = doc(firestore,'/users/' + currentFollower)
            const followerSnapshot = await getDoc(followerDocumentReference)
            const followerSnapshotData = followerSnapshot.data()
            const followerObject = {
                id : followerSnapshot.id,
                username : followerSnapshotData.username,
                profile_image : followerSnapshotData.profile_image
            }
            extlist.push(followerObject)
        }
        s(extlist)
    }

    useEffect(()=>{
        if(followers){
            getFollowerData(setFollowerExtendedList,followers)
        }
    },[followers,setFollowerExtendedList])
    
    const removeUser = async (i) => {
        const u = followerExtendedList[i]
        await deleteDoc(doc(firestore,'/users/' + u.id + '/following/' + user.uid))
        await deleteDoc(doc(firestore,'/users/' + user.uid + '/followers/' + u.id))
        const feedRef = collection(firestore,'/users/' + user.uid + '/feed')
        const feedDocumentSnapshot = await getDocs(feedRef)
        
        feedDocumentSnapshot.forEach(async doc=>{
            const feedItemData = doc.data()
            if(feedItemData.ownerid === u.id){
                await deleteDoc(doc.ref)
            }
        })
    }

    return <Dialog open={open} onClose={e=>setOpen(false)}>
        <DialogContent>
            <div className="follower_list">
                <List>
                    {followerExtendedList && followerExtendedList.map((f,i)=><ListItem key={i}>
                        <ListItemAvatar>
                            <img src={f.profile_image} width="45px" height="45px" style={{borderRadius : 100}}/>
                        </ListItemAvatar>
                        <ListItemText>
                            <a style={{textDecoration : 'none', fontWeight : 'bold', color : 'orange'}} href={"/profiles/" + f.username}>{f.username}</a>
                        </ListItemText>
                        <ListItemButton>
                            <DeleteForever onClick={e=>removeUser(i)}/>
                        </ListItemButton>
                    </ListItem>)}
                </List>
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={e=>setOpen(false)}>Close</Button>
        </DialogActions>
    </Dialog>
}

export default FollowerList
