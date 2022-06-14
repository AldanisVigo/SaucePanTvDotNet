import {   FacebookShareButton } from 'react-share'
import { Facebook } from '@mui/icons-material'

const ShareUs = () => {
    return <FacebookShareButton style={{alignSelf: 'center'}} hashtag={"saucepantvdotnet"} quote={"Come check out https://www.saucepantv.net. Looking for Trap, Hip-Hop & RnB artists to feature in Spotify playlist. Bring your best tracks."} children={<button><Facebook style={{position: 'relative',top: 2}}/><span style={{position: 'relative', top: -5}}>Tell Your Friends</span></button>} url={"https://www.saucepantv.net"}/>
}

export default ShareUs