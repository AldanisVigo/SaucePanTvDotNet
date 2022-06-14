import { useState,useEffect } from 'react'
import axios from 'axios'
import './Follows.css'

const Follows = ({joints}) => {

    return <div>
        <span style={{fontSize: 'small'}}>Latest from people you follow</span><br/><br/>
        <div className="joints_list">
            {joints && joints.map((joint,i)=><div key={i}>
                <img src={joint.picture.thumbnail}/>
            </div>)}
        </div>
    </div>
}

export default Follows