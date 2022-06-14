import { PlayArrow } from '@mui/icons-material'
const PlayCounter = ({song}:any) => {
    return <div className="play_counter">
        <PlayArrow/> {song.plays}
    </div>
}
export default PlayCounter