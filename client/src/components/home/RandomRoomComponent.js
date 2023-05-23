import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import * as gameService from '../../services/gameService'
import { AuthContext } from '../../context/UserContext'

export const RandomRoomComponent = ({ cancelRoom, socket, gameOption, setGameOption, onlineGames, setOnlineGames }) => {
    const [room, setRoom] = useState({
        roomId: '',
        gameId: '',
        members: []
    })
    const navigate = useNavigate()
    const { user, setUser } = useContext(AuthContext)

    useEffect(() => {
        if (user.gameId != '') {
            let data = {
                option: user?.gameOption || undefined
            }

            gameService.enterRoom(localStorage.getItem('sessionStorage'), data)
                .then(res => {
                    if (!res.message) {
                        setRoom({
                            roomId: res?.roomId,
                            gameId: res?._id,
                            members: res?.members
                        })
                    } else {
                        console.log(res);
                    }
                })
        }
    }, [])

    const randomRoomHandler = (e) => {
        e.preventDefault()

        let data = {
            option: gameOption.option || undefined
        }

        gameService.enterRoom(localStorage.getItem('sessionStorage'), data)
            .then(res => {
                if (!res.message) {
                    setRoom({
                        roomId: res?.roomId,
                        gameId: res?._id,
                        members: res?.members
                    })
                } else {
                    console.log(res);
                }
            })
    }

    useEffect(() => {
        if (room.members.length == 2) {
            setTimeout(() => {
                navigate('/game/' + room.gameId)
            }, 3000);
        }
    }, [room.members])

    return (
        <>
            <h2>Random room component</h2>

            <form className="randomRoomForm">
                <div className="createAndJoinRoomBtns">
                    <h2>{room.members.map(x => `${x}, `)}</h2>
                    <button onClick={(e) => cancelRoom(e)}>Cancel</button>
                    {/* <button onClick={(e) => randomRoomHandler(e)}>Join</button> */}
                </div>
            </form>
        </>
    )
}