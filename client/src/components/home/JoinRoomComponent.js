import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import * as gameService from '../../services/gameService'
import { AuthContext } from '../../context/UserContext'

export const JoinRoomComponent = ({ cancelRoom, socket }) => {
    const [room, setRoom] = useState({
        roomId: '',
        gameId: '',
        members: []
    })
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)

    useEffect(() => {
        if (user.gameId != '') {
            gameService.joinRoom(localStorage.getItem('sessionStorage'), user?.gameId)
                .then(res => {
                    if (!res.message) {
                        setRoom(res)
                    } else {
                        console.log(res);
                    }
                })
        }
    }, [])

    useEffect(() => {
        if (room.members.length == 2) {
            navigate('/game/' + room.gameId)
        }
    }, [room.members])

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