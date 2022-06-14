import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import Home from './Views/Home/Home'
import Login from './Views/Login/Login'
import SignUp from './Views/SignUp/SignUp'
import TrapCharts from './Views/Charts/TrapCharts'
import Hangout from './Views/Hangout/hangout'
import TermsAndConditions from './Views/TermsAndConditions/TermsAndConditions'
import Upload from './Views/Upload/upload'
import News from './Views/News/news'
import ProPlans from './Views/ProPlans/ProPlans'
import Profile from './Views/Profile/Profile'
import AudioStreamingTest from './Views/AudioStreamingTest/AudioStreaming'
import ArtistFocus from './Views/ArtistFocus/ArtistFocus'
import PlacementOps from './Views/PlacementOps/PlacementOps'
import Contact from './Views/Contact/Contact'
import Labels from './Views/Labels/Labels'
import PrivacyPolicy from './Views/PrivacyPolicy/PrivacyPolicy'
import HostedBattle from './Views/HostedBattle/HostedBattle'
import HostBattle from './Views/HostedBattle/HostBattle'

function App(props:any) {
  return(
    <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="login" element={<Login />}/>
            <Route path="signup" element={<SignUp/>}/>
            <Route path="charts" element={<TrapCharts/>}/>
            <Route path="hangout" element={<Hangout/>}/>
            <Route path="termsandconditions" element={<TermsAndConditions/>}/>
            <Route path="privacypolicy" element={<PrivacyPolicy/>}/>
            <Route path="upload" element={<Upload/>}/>
            <Route path="news" element={<News/>}/>
            <Route path="proplans" element={<ProPlans/>}/>
            <Route path="profiles/:id" element={<Profile/>}/>
            <Route path="trappphouse" element={<AudioStreamingTest/>}/>
            <Route path="artistfocus" element={<ArtistFocus/>}/>
            <Route path="placementops" element={<PlacementOps/>}/>
            <Route path="contact" element={<Contact/>}/>
            <Route path="labels" element={<Labels/>}/>
            <Route path='battle/host' element={<HostBattle/>}/>
            <Route path="battles/:id/:battleid" element={<HostedBattle/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App;
