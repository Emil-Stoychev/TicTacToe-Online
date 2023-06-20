import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

import styles from './DifferentRooms.module.css'

import * as gameService from '../../../services/gameService'
import { AuthContext } from "../../../context/UserContext"
import useGlobalErrorsHook from '../../../hooks/useGlobalError'

export const CreateRoomComponent = ({ cancelRoom, socket, gameOption, setGameOption, onlineGames, setOnlineGames, setRoom, room }) => {
    const [newGame, setNewGame] = useState(null)
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)
    let [errors, setErrors] = useGlobalErrorsHook()

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
                    setErrors({ message: res.message, type: '' })
                    console.log(res);
                }
            })
    }, [])

    useEffect(() => {
        if (room.members.length == 2) {
            setErrors({ message: 'Game is loading...', type: 'loading' })
            setTimeout(() => {
                navigate(`/game/${room._id}`)
            }, 3000);
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
            <h2 className={styles.mainHeader}>Create Room</h2>

            <h2 className={styles.mainHeader}>RoomId: <span className={styles.roomCode}>{room?.roomId}</span></h2>

            <h2 className={styles.mainHeader}>Waiting for players... {room.members.length}/2</h2>

            <div className={styles.createAndJoinRoomBtns}>
                <button className={styles.primaryBtn} onClick={(e) => cancelRoom(e, room?._id)}>Cancel</button>
            </div>
        </>
    )
}