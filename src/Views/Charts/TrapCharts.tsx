import AsideMenu from "../../Components/AsideMenu/AsideMenu"
import Header from "../../Components/Header/Header"
import './TrapCharts.css'
import ShareUs from "../../Components/ShareUs/ShareUs"
const TrapCharts = () => {
    return <div>
        <Header/>
        <div className="charts_container">
            <div className="aside_menu">
                <AsideMenu/>
            </div>
            <main style={{paddingLeft : 20}}>
                <h3 className="top_charts_label">Top Charts</h3>
                <section>
                    <p style={{textAlign : 'center', color: 'black', background: 'white', padding: 10, marginRight: 10, borderRadius: 10, maxWidth: 430}}>
                        Coming soon. We need more artists to join the platform before we launch this section. We encourage you to share this page with all your trap producers and artists.<br/><br/>
                        <ShareUs/>
                        {/* <FacebookShareButton style={{alignSelf: 'center'}} hashtag={"trapppcloud"} quote={"Come check out https://www.TrapppCloud.com. We need new trap artists and producers to come join the platform."} children={<button><Facebook style={{position: 'relative',top: 2}}/><span style={{position: 'relative', top: -5}}>Tell Your Friends</span></button>} url={"https://trapppcloud.com"}/> */}
                     </p>
                </section>
            </main>
        </div>
    </div>
}

export default TrapCharts