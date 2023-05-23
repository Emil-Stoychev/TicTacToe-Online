import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

import * as gameService from '../../services/gameService'
import { AuthContext } from "../../context/UserContext"

export const CreateRoomComponent = ({ cancelRoom, socket, gameOption, setGameOption, onlineGames, setOnlineGames }) => {
    const [room, setRoom] = useState({
        roomId: '',
        gameId: '',
        members: []
    })
    const [newGame, setNewGame] = useState(null)
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)

    useEffect(() => {

        let data = {
            option: gameOption.option || undefined
        }

        gameService.enterRoom(localStorage.getItem('sessionStorage'), data)
            .then(res => {
                if (!res.message) {
                    setRoom(res.newRoom)
                    setGameOption({ option: res.userGameOption, gameId: res.newRoom.gameId })
                } else {
                    console.log(res);
                }
            })
    }, [])

    useEffect(() => {
        if (room.members.length == 2) {
            console.log('NOW ROOM IS FULL');
            // navigate('/game/' + room?.gameId)
        }
    }, [room.members])

    // CREATE GAME
    useEffect(() => {
        if (gameOption.option != undefined && gameOption.option != '') {
            socket.current?.emit('new-game', room)
        }
    }, [gameOption])

    socket.current?.on('get-game', (data) => {
        setNewGame(data)
    })

    useEffect(() => {
        if (newGame != null) {
            let existGame = onlineGames.find(x => x?.room?.gameId == newGame?.room?.gameId)

            if (!existGame) {
                setOnlineGames(state => [...state, newGame])
            }
        }
    }, [newGame])

    return (
        <>
            <h2>Create Room</h2>

            <h2>RoomId: {room?.roomId}</h2>

            <h2>Waiting for players...</h2>

            <div className="createAndJoinRoomBtns">
                <h2>{room.members.map(x => `${x}, `)}</h2>
                <button onClick={(e) => cancelRoom(e, gameOption?.gameId)}>Cancel</button>
            </div>
        </>
    )
}