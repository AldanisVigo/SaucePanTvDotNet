import { useRef,useState } from 'react'
const AudioStreamingTest = () => {
    const [stream,setStream] = useState<any>()
    const [mediaRecorder,setMediaRecorder] = useState<any>()
    const [recording,setRecording] = useState<boolean>(false)
    const [chunks,setChunks] = useState<any>()
    const player:any = useRef()
    const talk = () => {
        if(!recording){
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("recorder started");
            // record.style.background = "red";
            // record.style.color = "black";
            setRecording(true)
        }else{
            mediaRecorder.stop();
            setRecording(false)
        }
        
    }

    const initiateStreaming = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia (
                // constraints - only audio needed for this app
                {
                    audio: true
                })

                // Success callback
                .then(function(stream) {

                    console.log(stream)
                    setStream(stream)
                    const mr = new MediaRecorder(stream);
                    setMediaRecorder(mr)
                    if(mr){
                        mr.ondataavailable = (e:any)=>{
                            console.log(e.data)
                            const audioURL = window.URL.createObjectURL(e.data)
                            console.log(audioURL)
                            player.current.src=audioURL
                            setChunks(Object.assign([],chunks).push(e.data))
                        }
                    }
                })

                // Error callback
                .catch(function(err) {
                    console.log('The following getUserMedia error occurred: ' + err);
                }
            );
        } else {
            console.log('getUserMedia not supported on your browser!');
        }
    }

    return <div>
        <button onClick={initiateStreaming}>Stream Streaming</button>
        <audio ref={player} src={stream} controls autoPlay/>
        <button style={{background : recording ? 'red' : 'grey'}} onClick={talk}>Talk</button>
    </div>
}

export default AudioStreamingTest