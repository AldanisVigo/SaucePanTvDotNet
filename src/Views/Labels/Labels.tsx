import './Labels.css'
import Header from '../../Components/Header/Header'
import AsideMenu from '../../Components/AsideMenu/AsideMenu'
import ShareUs from '../../Components/ShareUs/ShareUs'
import { auth } from '../../firebase'
import { useState,useEffect } from 'react'
import NewsComponent from '../../Components/News/News'
const Labels = () => {
    const [user,setUser] = useState<any>(null)
    const [initialized,setInitialized] = useState<boolean>(false)

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

    return <div>
        <Header/>
        <div className="labels_container">
            <AsideMenu/>
            <main className="labels_main">
                <article style={{textAlign: 'left'}}>
                    <h3>Welcome</h3>
                    <section>
                        <p>
                            Thank you for your interest in TrapppCloud. The easiest way to contact us is to leave us a message using the form below. However, if this is an emergency you may dial 911. We will get back to you as soon as possible. Remember we are a very small team.
                            <br/><br/>
                           
                            <br/><br/>
                            <div style={{textAlign : 'center'}}>
                                
                                <ShareUs/>
                                {/* <FacebookShareButton style={{alignSelf: 'center'}} hashtag={"trapppcloud"} quote={"Come check out https://www.TrapppCloud.com. We need new trap artists and producers to come join the platform."} children={<button><Facebook style={{position: 'relative',top: 2}}/><span style={{position: 'relative', top: -5}}>Tell Your Friends</span></button>} url={"https://trapppcloud.com"}/> */}
                            </div>
                        </p>

                        {/* <RecentlyPlayed/> */}
                    </section>
                </article>
            </main>
            <aside className="right_aside" style={{paddingRight: '10px'}}>
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

export default Labels