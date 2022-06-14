
const UploadBar = ({percent}) => {
    if(percent > 0){
        return <div style={{width : percent + '%',background : 'purple', height: 22, fontWeight : 'bold', marginTop: 10, marginBottom: 10, borderTopRightRadius: percent < 100 ? '30px' : '0px', borderBottomRightRadius: percent < 100 ? '30px' : '0px', fontSize: percent < 10 ? 'small' : 'normal', textAlign : 'center'}}>
            <span style={{position: 'relative',top: 2}}>{percent && percent > 0 && percent + "%"}</span>
        </div>
    }else{
        return <div></div>
    }
}

export default UploadBar