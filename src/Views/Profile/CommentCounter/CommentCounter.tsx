import { Comment } from '@mui/icons-material'
const CommentCounter = ({song}:any) => {
    return <div className="comment_counter">
        <Comment/> {song.comments}
    </div>
}
export default CommentCounter