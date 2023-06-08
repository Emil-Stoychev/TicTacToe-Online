import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import * as gameService from '../../services/gameService'
import { AuthContext } from '../../context/UserContext'

export const JoinRoomComponent = ({ cancelRoom, socket, gameOption, setGameOption, onlineGames, setOnlineGames, setRoom, room }) => {
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)
    const [joinGame, setJoinGame] = useState(null)

    useEffect(() => {
        if (user._id != '') {
            let data = {
                option: user?.gameOption || undefined
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
        }
    }, [])

    useEffect(() => {
        if (room.members.length == 2) {
            // navigate('/game/' + room._id)
            console.log('NOW ROOM IS FULL');
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

        let data = {
            option: gameOption.option || undefined,
            roomId: room.roomId || ''
        }

        if (room.roomId != '' && room.roomId.length > 3) {
            gameService.enterRoom(localStorage.getItem('sessionStorage'), data)
                .then(res => {
                    console.log(res);
                    if (!res.message) {
                        setRoom(res.newRoom)
                        setGameOption({ option: res.userGameOption, gameId: res.newRoom._id })
                    } else {
                        console.log(res);
                    }
                })
        }
    }

    // JOIN GAME
    useEffect(() => {
        if (gameOption.option != undefined && gameOption.option != '') {
            socket.current?.emit('join-game', { room: room, userId: user._id })
        }
    }, [gameOption])

    socket.current?.on('get-game', (data) => {
        setJoinGame(data)
    })

    useEffect(() => {
        if (joinGame != null) {
            let existGame = onlineGames.find(x => x?.room?._id == joinGame?.room?._id)

            if (existGame) {
                if (existGame?.room?._id == joinGame.room._id) {
                    setRoom(joinGame.room)

                    if (joinGame?.room?.author?.toString() == user._id) {
                        if (gameOption.option != 'create') {
                            setGameOption(state => ({
                                ...state,
                                option: 'create'
                            }))
                        }
                    }
                }

                setOnlineGames(state => state.map(x => {
                    if (x.room._id == joinGame.room._id) {
                        return joinGame
                    } else {
                        return x
                    }
                }))
            }
        }
    }, [joinGame])

    return (
        <>
            <h2>Join room component</h2>

            <form className="joinRoomForm">
                {room._id == '' &&
                    <>
                        <label htmlFor="roomId">Code</label>
                        <input id="roomId" name="roomId" type="text" value={room?.roomId || ''} onChange={(e) => changeCodeHandler(e)} />
                    </>
                }

                <div className="createAndJoinRoomBtns">
                    <h2>{room.members.map(x => `${x}, `)}</h2>
                    <button onClick={(e) => cancelRoom(e, room?._id)}>Cancel</button>

                    {room._id == '' &&
                        <button onClick={(e) => joinRoomHandler(e)}>Join</button>
                    }
                </div>
            </form >
        </>
    )
}