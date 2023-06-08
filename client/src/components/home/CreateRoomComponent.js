import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

import * as gameService from '../../services/gameService'
import { AuthContext } from "../../context/UserContext"

export const CreateRoomComponent = ({ cancelRoom, socket, gameOption, setGameOption, onlineGames, setOnlineGames, setRoom, room }) => {
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
                    setGameOption({ option: res.userGameOption, gameId: res.newRoom._id })
                } else {
                    console.log(res);
                }
            })
    }, [])

    useEffect(() => {
        if (room.members.length == 2) {
            console.log('NOW ROOM IS FULL');
            // navigate('/game/' + room?._id)
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
            console.log('HERE');
            console.log(newGame);
            let existGame = onlineGames?.find(x => x?.room?._id == newGame?.room?._id)

            if (!existGame) {
                onlineGames.find(x => {
                    if (x.room._id == newGame.room._id) {
                        setRoom(newGame.room)
                    }
                })
                // setRoom(newGame.room)
                setOnlineGames(state => [...state, newGame])
            } else {
                onlineGames.find(x => {
                    if (x.room._id == newGame.room._id) {
                        setRoom(newGame.room)
                    }
                })

                setOnlineGames(state => state.map(x => {
                    if (x.room._id == newGame.room._id) {
                        return newGame
                    }

                    return x
                }))
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
                <button onClick={(e) => cancelRoom(e, room?._id)}>Cancel</button>
            </div>
        </>
    )
}