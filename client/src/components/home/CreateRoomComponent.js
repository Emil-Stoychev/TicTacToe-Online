import { useEffect, useState } from "react"

import * as gameService from '../../services/gameService'

export const CreateRoomComponent = ({ cancelRoom }) => {
    const [room, setRoom] = useState({
        roomId: '',
        gameId: '',
        members: []
    })

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