import { JitsiMeeting } from "@jitsi/react-sdk"
import { CircularProgress, Button } from '@mui/material'
import { useState } from "react"
import { People } from '@mui/icons-material'
const ProfileHangout = ({profileOwnerUid,userObject}) => {
    const [showMeet,setShowMeet] = useState(true)

    const handleJitsiApi = (api) => {
        console.log(api)
    }

    if(userObject && showMeet){
        return <JitsiMeeting
            style={{width: '100%'}}
            onReadyToClose={e=>setShowMeet(false)}
            domain="jitsi.trapppcloud.com"
            className="meeting"
            roomName = {userObject.username + ' Hangout'}
            onApiReady={handleJitsiApi}
        />
    }else if(userObject && !showMeet){
        return <Button style={{color: 'white'}} onClick={e=>setShowMeet(true)}><People/>Show Hangout</Button>
    }else {
        return <CircularProgress/>
    }
}

export default ProfileHangout