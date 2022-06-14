import './PlayCount.css'

const PlayCount = ({user,weeklyPlays}:any) => {
    return <div className="playcount">
        <span className="playcount_user_title">Hey {user.email}, you have</span><br/>
        <span className="playcount_number">{weeklyPlays | 0} Plays</span><br/>
        <span className="playcount_period">In the last 7 days</span><br/><br/>
        <button>View Insights</button>
    </div>
}

export default PlayCount