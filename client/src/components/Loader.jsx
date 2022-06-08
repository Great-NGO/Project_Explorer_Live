import React from 'react';
// import loader from '../assets/images/Disk-1BlackBG.gif'
// import loader1 from '../assets/images/Disk-1WhiteBG.gif'
import loader2 from '../assets/images/loader.gif'
// import loader3 from '../assets/images/Spinner.gif'

const Loader = ({size}) => {
    return (
        <img src={loader2} style={{ width: size, margin: 'auto', display: 'block'}} alt="Loading..." />
    )
}

export default Loader;
