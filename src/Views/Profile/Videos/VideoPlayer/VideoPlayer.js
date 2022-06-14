import './VideoPlayer.css'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.css'
import YouTube from 'react-youtube';
import { useState } from 'react'
import VideoComments from './VideoComments/VideoComments';
import LeaveVideoComment from './LeaveVideoComment/LeaveVideoComment';
const VideoPlayer = ({videos,profileOwnerUid,user,userObject}) => {
    const [selectedVideo,setSelectedVideo] = useState(0)

    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    }


    const carouselSlideChanged = (e) => {
        console.log(e)
        setSelectedVideo(e)
    }

    const carouselItemClicked = (e) => {
        console.log(e)
    }

    const onClickThumb = (e) => {
        console.log(e)
    }

    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    return <div style={{marginBottom: '20px'}}>
        <Carousel showArrows={true} onChange={carouselSlideChanged} onClickItem={carouselItemClicked} onClickThumb={onClickThumb}>
            {videos.map((video,index)=><div key={index}>
                <div className="slide">
                    <YouTube className="video" videoId={video.video_id} opts={opts} onReady={_onReady} />
                </div>
                {/* <p className="legend">Legend 1</p> */}
            </div>)}
        </Carousel>
        <div className="video_comments">
            <LeaveVideoComment video={videos[selectedVideo]} profileOwnerUid={profileOwnerUid} user={user} userObject={userObject}/>
            <VideoComments  selectedVideo={videos[selectedVideo]} profileOwnerUid={profileOwnerUid} user={user} userObject={userObject}/>
        </div>
    </div>
}
export default VideoPlayer