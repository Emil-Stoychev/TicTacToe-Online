import { useState, useEffect } from 'react'

import * as gameService from '../../services/gameService'

export const RandomRoomComponent = ({ cancelRoom }) => {
    const [room, setRoom] = useState({
        roomId: '',
        gameId: '',
        members: []
    })
    
    const randomRoomHandler = (e) => {
        e.preventDefault()

        gameService.randomRoom(localStorage.getItem('sessionStorage'))
            .then(res => {
                if (!res.message) {
                    setRoom(res)
                } else {
                    console.log(res);
                }
            })
    }

    return (
        <>
            <h2>Random room component</h2>

            <form className="randomRoomForm">
                <div className="createAndJoinRoomBtns">
                    <h2>{room.members.map(x => `${x}, `)}</h2>
                    <button onClick={(e) => cancelRoom(e)}>Cancel</button>
                    <button onClick={(e) => randomRoomHandler(e)}>Join</button>
                </div>
            </form>
        </>
    )
}