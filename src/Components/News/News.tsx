import './news.css'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '../../firebase'
import { useState, useEffect } from 'react'
// import { Button } from '@mui/material'
const NewsComponent = ({direction}:any) => {
    const [initialized,setInitialized] = useState<boolean>()
    const [news,setNews] = useState<any>([])

    useEffect(()=>{
        let newsUnsub = () => {}
        if(!initialized || news.length === 0){
            const newsRef = collection(firestore,'/news')
            try{
                newsUnsub = onSnapshot(newsRef,snap=>{
                    let tmp_news:any = []
                    // console.log(snap)
                    snap.forEach(news_entry=>{
                        // console.log(news_entry)
                        if(news_entry.data() !== undefined){
                            tmp_news.push(news_entry.data())
                        }
                    })
                    tmp_news.sort((a:any,b:any)=>b.timestamp - a.timestamp)
                    setNews(tmp_news)
                })
            }catch(err){
                console.error(err)
            }
            setInitialized(true)
        }
        return ()=>{
            newsUnsub()
        }
    },[setInitialized,initialized,news,setNews])

    // const retrieveNews = async () => {
    //     console.log("Getting news")
    //     try{
    //         const newsRef = collection(firestore,'/news')
    //         const snap = await getDocs(newsRef)
    //         let tmp_news:any = []
    //         snap.forEach(news_entry=>{
    //             if(news_entry.data() !== undefined){
    //                 tmp_news.push(news_entry.data())
    //             }
    //         })
    //         console.log("News")
    //         console.log(tmp_news)
    //         setNews(tmp_news)
    //     }catch(err){
    //         console.error(err)
    //     }
    // }

    return <div>
        <div className="news_component_container">
            <main className="news_container_main">
                <h3 className="news_label">News</h3>
                <div style={{display : 'grid', gridTemplateColumns : direction === 'vertical' ? '1fr' : 'auto', gridTemplateRows : direction === 'horizontal' ? 'auto' : '1fr'}}>
                    {news.length === 0 && <span>No News</span>}
                    {news && news.map((news_entry:any,i:any)=><article key={i} className="news">
                        <h3 style={{fontWeight : 'extra-bold'}}>{news_entry.title}</h3>
                        <section>
                            {news_entry.text}<br/><br/>
                            <span className="news_timestamp">{news_entry.author} @ {news_entry.timestamp.toDate().toString()}</span>
                        </section>
                    </article>)}
                    {/* <Button onClick={e=>retrieveNews()}>Get News</Button> */}
                </div>
            </main>
        </div>
    </div>
}

export default NewsComponent