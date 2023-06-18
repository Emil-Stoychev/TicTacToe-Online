import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './DifferentRooms.module.css'

import * as gameService from '../../../services/gameService'
import { AuthContext } from '../../../context/UserContext'
import useGlobalErrorsHook from '../../../hooks/useGlobalError'

export const JoinRoomComponent = ({ cancelRoom, socket, gameOption, setGameOption, onlineGames, setOnlineGames, setRoom, room }) => {
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)
    let [errors, setErrors] = useGlobalErrorsHook()
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
            setErrors({ message: 'Game is loading...', type: 'loading' })
            setTimeout(() => {
                navigate(`/game/${room._id}`)
            }, 3000);
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
                    if (!res.message) {
                        setRoom(res.newRoom)
                        setGameOption({ option: res.userGameOption, gameId: res.newRoom._id })
                    } else {
                        setErrors({ message: res.message, type: '' })
                    }
                })
        } else {
            setErrors({ message: 'Please type your code first!', type: '' })
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
            <h2 className={styles.mainHeader}>Join room</h2>

            <form className="joinRoomForm">
                {room._id == '' &&
                    <div className={styles.codeRoomInput}>
                        <input name="roomId" type="text" value={room?.roomId || ''} onChange={(e) => changeCodeHandler(e)} placeholder='Code here' />
                    </div>
                }

                <div className={styles.JoinRoomBtns}>
                    <h2>{room.members.map(x => `${x}, `)}</h2>
                    <button className={styles.primaryBtn} onClick={(e) => cancelRoom(e, room?._id)}>Cancel</button>

                    {room._id == '' &&
                        <button className={styles.primaryBtn} onClick={(e) => joinRoomHandler(e)}>Join</button>
                    }
                </div>
            </form >
        </>
    )
}