import AsideMenu from '../../Components/AsideMenu/AsideMenu'
import './news.css'
import Header from '../../Components/Header/Header'
// import { collection, onSnapshot } from 'firebase/firestore'
// import { firestore } from '../../firebase'
import { useState, useEffect } from 'react'
import NewsComponent from '../../Components/News/News'
const News = ( ) => {
    const [initialized,setInitialized] = useState<boolean>()
    // const [news,setNews] = useState<any>([])

    useEffect(()=>{
        // let newsUnsub = () => {}
        if(!initialized){
            // const newsRef = collection(firestore,'/news')
            // newsUnsub = onSnapshot(newsRef,snap=>{
            //     let tmp_news:any = []
            //     snap.forEach(news_entry=>{
            //         if(news_entry.data() !== undefined){
            //             tmp_news.push(news_entry.data())
            //         }
            //     })
            //     setNews(tmp_news)
            // })
            setInitialized(true)
        }
    },[setInitialized,initialized])

    return <div>
        <Header/>
        <div className="news_container">
            <div className="aside_menu">
                <AsideMenu/>
            </div>
            <main className="news_container_main">
                {/* <h3 className="news_label">News</h3>
                {news && news.map((news_entry:any,i:any)=><article key={i} className="news">
                    <h2>{news_entry.title}</h2>
                    <section>
                        {news_entry.text}<br/><br/>
                        <span className="news_timestamp">{news_entry.author} @ {news_entry.timestamp.toDate().toString()}</span>
                    </section>
                </article>)} */}
                <NewsComponent direction="horizontal"/>
            </main>
        </div>
    </div>
}

export default News