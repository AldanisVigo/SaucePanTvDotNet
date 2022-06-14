import './FollowFeed.css'
import { useState, useEffect } from 'react'

const FollowFeed = ({feed}:any) => {
    return <div className="follow_feed">
        <h5>The Hommies Released</h5>
        {feed && feed.reverse().map((i:any,p:any)=><span key={p} style={{display: 'grid', gridTemplateColumns: '52px auto', padding: '3px'}}>
            <img style={{borderRadius : 0, position: 'relative', top : 5, left: 5}} src={i.coverUrl} width="45px" height="45px"/> 
            <div style={{display: 'flex', alignItems: 'center',justifyContent: 'center', width : 'fit-content'}}>
                <a href={i.backLink} style={{textDecoration : 'none', color : 'white',position: 'relative', top : '8px'}}>{i.backLink.split('/')[2]} - {i.name}</a>
            </div>
        </span>)}
    </div>
}

export default FollowFeed