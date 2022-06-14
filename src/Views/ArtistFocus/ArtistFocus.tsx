import ShareUs from '../../Components/ShareUs/ShareUs'
import AsideMenu from '../../Components/AsideMenu/AsideMenu'
import Header from '../../Components/Header/Header'
import './ArtistFocus.css'

const ArtistFocus = () => {
    return <div>
        <Header/>
        <div className="artist_focus_container">
            <div className="aside_menu">
                <AsideMenu/>
            </div>
            <main style={{paddingLeft : 20}}>
                <h3 className="artist_focus_label">Artist Focus</h3>
                <section>
                    <p style={{textAlign : 'center', color: 'black', background: 'white', padding: 10, marginRight: 10, borderRadius: 10, maxWidth: 430}}>
                        Coming soon. We need more artists to join the platform before we launch this section. We encourage you to share this page with all your trap producers and artists.<br/><br/>
                        <ShareUs/>
                     </p>
                </section>
            </main>
        </div>
    </div>
}

export default ArtistFocus