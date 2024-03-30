import React, { useEffect, useState } from 'react'
import BackVideo from '../../../assets/video-back.mp4'
import { Outlet } from 'react-router-dom'
import HeaderH from './HeaderH'


function LayoutUser() {

    return (
        <div className='body-Home overflow-hidden'>
            <video src={BackVideo} autoPlay loop muted className='video-background'>
            </video>

            <div className="container-fluid p-0">
                <div className="row position-relative">
                    <div className="col"><HeaderH /></div>
                </div>
                <div className="row justify-content-center">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default LayoutUser