import { useState, useEffect } from 'react'

import * as gameService from '../../services/gameService'

export const JoinRoomComponent = ({ guest, cancelRoom }) => {
    const [room, setRoom] = useState({
        roomId: '',
        gameId: '',
        members: []
    })

    useEffect(() => {
        if (guest.gameId != '') {
            gameService.joinRoom(localStorage.getItem('sessionStorage'), guest?.gameId)
                .then(res => {
                    if (!res.message) {
                        setRoom(res)
                    } else {
                        console.log(res);
                    }
                })
        }
    }, [])

    const changeCodeHandler = (e) => {
        setRoom(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    const joinRoomHandler = (e) => {
        e.preventDefault()

        if (room.roomId != '' && room.roomId.length > 3) {
            gameService.joinRoom(localStorage.getItem('sessionStorage'), room?.gameId, room?.roomId)
                .then(res => {
                    console.log(res);
                    if (!res.message) {
                        setRoom(res)
                    } else {
                        console.log(res);
                    }
                })
        }
    }

    return (
        <>
            <h2>Join room component</h2>

            <form className="joinRoomForm">
                {room.gameId == '' &&
                    <>
                        <label htmlFor="roomId">Code</label>
                        <input id="roomId" name="roomId" type="text" value={room?.roomId || ''} onChange={(e) => changeCodeHandler(e)} />
                    </>
                }

                <div className="createAndJoinRoomBtns">
                    <h2>{room.members.map(x => `${x}, `)}</h2>
                    <button onClick={(e) => cancelRoom(e)}>Cancel</button>

                    {room.gameId == '' &&
                        <button onClick={(e) => joinRoomHandler(e)}>Join</button>
                    }
                </div>
            </form >
        </>
    )
}