import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import YouTube  from "react-youtube";
const MainSlider = () => {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
    }

    const subsequent_opts = {
      height: '390',
      width: '640',
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    }



    return <div className="main_slider">
        <Carousel showIndicators={true}>
            <div>
              <img src="https://i.scdn.co/image/ab67616d0000b273a01a1a2f5e3c04c48ddfac0e"/>
              <div>Latest approved Spotify playlist submission from KhyKush. Check him out on Spotify. Submit your best track below.</div>
            </div>
            <div>
                <YouTube opts={opts} videoId="ut03bkpZcSY"/>
            </div>
            <div>
                <YouTube opts={subsequent_opts} videoId="GWgwppPDSmU"/>
            </div>     
            <div>
                <YouTube opts={subsequent_opts} videoId="ezGkusZFoBM"/>
            </div>
        </Carousel>
    
    </div>
}

export default MainSlider