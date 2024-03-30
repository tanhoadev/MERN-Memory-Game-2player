import React from 'react'

function InforUserTurn({ user, pairs }) {
    return (
        <div class="card-info d-flex justify-content-center flex-column cardInfoUserTurn">
            <span className='user-name-start' >{user}</span>
            <span className='pair-info' >Pairs: <span className='pair-value' >{pairs}</span></span>
        </div>
    )
}

export default InforUserTurn