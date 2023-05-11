import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

import * as gameService from '../../services/gameService'

export const CreateRoomComponent = ({ cancelRoom, socket }) => {
    const [room, setRoom] = useState({
        roomId: '',
        gameId: '',
        members: []
    })
    const navigate = useNavigate()

    useEffect(() => {
        gameService.createRoom(localStorage.getItem('sessionStorage'))
            .then(res => {
                console.log(res);
                try {
                    setRoom(res)
                } catch (error) {
                    console.log(error);
                }
            })
    }, [])

    useEffect(() => {
        if (room.members.length == 2) {
            navigate('/game/' + room.gameId)
        }
    }, [room.members])

    return (
        <>
            <h2>Create Room</h2>

            <h2>RoomId: {room?.roomId}</h2>

            <h2>Waiting for players...</h2>

            <div className="createAndJoinRoomBtns">
                <h2>{room.members.map(x => `${x}, `)}</h2>
                <button onClick={(e) => cancelRoom(e)}>Cancel</button>
            </div>
        </>
    )
}