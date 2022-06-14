import './Contact.css'
import Header from '../../Components/Header/Header'
import AsideMenu from '../../Components/AsideMenu/AsideMenu'
import ShareUs from '../../Components/ShareUs/ShareUs'
import { auth,firestore } from '../../firebase'
import { useState,useEffect } from 'react'
import NewsComponent from '../../Components/News/News'
import { TextField, FormControl, Button } from '@mui/material'
import { collection, addDoc } from 'firebase/firestore'


const Contact = () => {
    const [user,setUser] = useState<any>(null)
    const [initialized,setInitialized] = useState<boolean>(false)
    const [email,setEmail] = useState('')
    const [message,setMessage] = useState('')
    useEffect(()=>{
        if(!initialized){
            auth.onAuthStateChanged(user=>{
                if(user){
                    setUser(user)
                }else{
                    setUser(null)
                }
            })
            setInitialized(true)
        }
    })

    const submitInquiry = async () => {
        if(email !== '' && message !== ''){
            try{
                const contact_inquiry_collection_ref = collection(firestore,'contact_inquiries')
                await addDoc(contact_inquiry_collection_ref, {
                    timestamp : new Date(),
                    message : message,
                    email : email
                })
                alert("Your inquiry has been received. Please allow some time for a member of our team to go over it and reach out to you via email. Thanks for contacting SaucePanTv.net")
                setEmail('')
                setMessage('')
            }catch(err){
                console.error(err)
            }
        }else{
            alert("Please enter an email address with which we can reach back out to you, as well as a short message describing your inquiry before submitting.")
        }
    }

    return <div>
        <Header/>
        <div className="home">
            {/* <aside className="left_menu">
                <div style={{display: 'grid', gridTemplateColumns : '1fr', gridAutoRows : '1fr'}}>
                    <button onClick={e=>navigate('/charts')}>Browse Charts</button>
                    <button onClick={e=>navigate('/upload')}>Upload</button>
                    <button>TrAppCloud News</button>
                    <button>Artist Focus</button>
                    <button>Placement Ops</button>
                    <button>Submit to Labels</button>
                    <button>Contact</button>
                    <button onClick={e=>navigate('/shows')}>Live Shows</button>
                </div>
            </aside> */}
            <AsideMenu/>
            <main className="home_main">
                <article style={{textAlign: 'left'}}>
                    <h3>Welcome</h3>
                    <section>
                        <p>
                            Thank you for your interest in SaucePanTv.net. The easiest way to contact us is to leave us a message using the form below. However, if this is an emergency you may dial 911. We will get back to you as soon as possible. Remember we are a very small team.
                            <br/><br/>
                            <form action="_" method="_" className="message_input_form">
                                <FormControl>
                                    <TextField placeholder="Email" type="email" label="Your Email Address" value={email} onChange={e=>setEmail(e.target.value)}/>
                                </FormControl><br/>
                                <FormControl>
                                    <TextField placeholder="Message" type="text" label="Your Message" multiline={true} rows={10} value={message} onChange={e=>setMessage(e.target.value)}/>
                                </FormControl><br/>
                                <FormControl>
                                    <Button onClick={e=>submitInquiry()}>Submit</Button>
                                </FormControl>
                            </form>
                            <br/><br/>
                            <div style={{textAlign : 'center'}}>
                                
                                {/* <ShareUs/> */}
                                {/* <FacebookShareButton style={{alignSelf: 'center'}} hashtag={"trapppcloud"} quote={"Come check out https://www.TrapppCloud.com. We need new trap artists and producers to come join the platform."} children={<button><Facebook style={{position: 'relative',top: 2}}/><span style={{position: 'relative', top: -5}}>Tell Your Friends</span></button>} url={"https://trapppcloud.com"}/> */}
                            </div>
                        </p>

                        {/* <RecentlyPlayed/> */}
                    </section>
                </article>
            </main>
            <aside style={{paddingRight: '10px'}}>
                {!user && <div>
                    Logged Off
                </div>}
                <br/>
                <hr/>
                <NewsComponent/>
                {/* <Follows joints={joints}/> */}
            </aside>
        </div>
    </div>  
}

export default Contact