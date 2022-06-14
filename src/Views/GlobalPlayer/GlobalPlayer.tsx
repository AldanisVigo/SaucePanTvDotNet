import { PlayCircle,PauseCircle,FastForwardRounded,FastRewindRounded } from "@mui/icons-material"
import "./GlobalPlayer.css"

const GlobalPlayer = () => {
    return <div className="global_player">
        <img src="https://firebasestorage.googleapis.com/v0/b/trapppcloud.appspot.com/o/App%20Images%2Flogo.png?alt=media&token=f8eed714-e391-41e9-985f-b7ce9cfc6cfa" className="cover"></img>
        <PlayCircle className="play action"/>
        <PauseCircle className="pause action"/>
        <FastRewindRounded className="previous action"/>
        <FastForwardRounded className="forward action"/>
    </div>
}

export default GlobalPlayer