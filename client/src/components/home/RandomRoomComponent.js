import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import * as gameService from '../../services/gameService'
import { AuthContext } from '../../context/UserContext'
import useGlobalErrorsHook from '../../hooks/useGlobalError'

export const RandomRoomComponent = ({ cancelRoom, socket, gameOption, setGameOption, onlineGames, setOnlineGames, setRoom, room }) => {
    const [randomGame, setRandomGame] = useState(null)

    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)
    let [errors, setErrors] = useGlobalErrorsHook()

    useEffect(() => {
        if (user.gameId != '') {
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

    // const randomRoomHandler = (e) => {
    //     e.preventDefault()

    //     let data = {
    //         option: gameOption.option || undefined
    //     }

    //     gameService.enterRoom(localStorage.getItem('sessionStorage'), data)
    //         .then(res => {
    //             if (!res.message) {
    //                 setRoom(res.newRoom)
    //                 setGameOption({ option: res.userGameOption, gameId: res.newRoom._id })
    //             } else {
    //                 console.log(res);
    //             }
    //         })
    // }

    useEffect(() => {
        if (gameOption.option != undefined && gameOption.option != '') {
            socket.current?.emit('random-game', { room: room, userId: user._id })
        }
    }, [gameOption])

    useEffect(() => {
        if (room.members.length == 2) {
            setErrors({ message: 'Game is loading...', type: 'loading' })
            setTimeout(() => {
                navigate(`/game/${room._id}`)
            }, 3000);
            console.log('NOW ROOM IS FULL');
        }
    }, [room.members])


    socket.current?.on('get-game', (data) => {
        setRandomGame(data)
    })

    useEffect(() => {
        if (randomGame != null) {
            let existGame = onlineGames.find(x => x?.room?._id == randomGame?.room?._id)

            if (randomGame.room.members.includes(user._id) || randomGame.room.author == user._id) {
                if (existGame?.room?._id == randomGame.room._id) {
                    onlineGames.find(x => {
                        if (x.room._id == randomGame.room._id) {
                            setRoom(randomGame.room)
                        }
                    })

                    setOnlineGames(state => state.map(x => {
                        if (x.room._id == randomGame.room._id) {
                            return randomGame
                        } else {
                            return x
                        }
                    }))
                }
            }
        }
    }, [randomGame])

    return (
        <>
            <h2>Random room component</h2>

            <form className="randomRoomForm">
                <div className="createAndJoinRoomBtns">
                    <h2>{room.members.map(x => `${x}, `)}</h2>
                    {room?.members?.length == 2 && <h2>Please wait, game is loading...</h2>}
                    <button onClick={(e) => cancelRoom(e)}>Cancel</button>
                    {/* <button onClick={(e) => randomRoomHandler(e)}>Join</button> */}
                </div>
            </form>
        </>
    )
}