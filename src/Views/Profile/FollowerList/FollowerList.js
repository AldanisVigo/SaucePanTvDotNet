import { Dialog, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { useEffect,useState } from 'react'
import { firestore } from '../../../firebase'
import { doc, getDoc } from 'firebase/firestore'

const FollowerList = ({open,setOpen, followers}) => {
    const [followerExtendedList,setFollowerExtendedList] = useState([])

    const getFollowerData = async (s,fl) => {
        let extlist = []
        for(let f = 0; f < fl.length; f++){
            const currentFollower = followers[f]
            const followerDocumentReference = doc(firestore,'/users/' + currentFollower)
            const followerSnapshot = await getDoc(followerDocumentReference)
            const followerSnapshotData = followerSnapshot.data()
            const followerObject = {
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
