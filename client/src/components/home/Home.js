import styles from './Home.module.css'

import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import * as gameService from '../../services/gameService'

import { CreateRoomComponent } from './Options for rooms/CreateRoomComponent'
import { JoinRoomComponent } from './Options for rooms/JoinRoomComponent'
import { RandomRoomComponent } from './Options for rooms/RandomRoomComponent'


import { io } from 'socket.io-client'
import { AuthContext } from '../../context/UserContext'
import useGlobalErrorsHook from '../../hooks/useGlobalError'
import { ChatComponent } from './chat/ChatComponent'
import { LoginComponent } from './login/LoginComponent'
import { GameStatisticComponent } from './statistic/GameStatisticComponent'


export const HomeComponent = ({ socket, setOnlineUsers, onlineUsers, onlineGames, setOnlineGames }) => {
    let { user, setUser } = useContext(AuthContext)
    let [errors, setErrors] = useGlobalErrorsHook()
    const [messages, setMessages] = useState([])
    const [room, setRoom] = useState({
        roomId: '',
        _id: '',
        members: []
    })
    const [gameOption, setGameOption] = useState({
        option: '',
        gameId: '',
    })
    const navigate = useNavigate()

    useEffect(() => {
        window.onload = window.scrollTo(0, 0)
        let token = localStorage.getItem('sessionStorage')

        if (token != null) {
            gameService.getUser(token)
                .then(res => {
                    if (!res.message) {
                        setUser({
                            username: res?.username,
                            uuid: res?.uuid,
                            _id: res?._id,
                            gameId: res?.gameId || '',
                            token: localStorage.getItem('sessionStorage')
                        })

                        setErrors({ message: res?.username, type: 'logged' })
                        setGameOption({ option: res?.gameOption || '', gameId: res?.gameId || '' })
                    } else {
                        setErrors({ message: 'Please log in again!', type: 'Unauthorized!' })
                        localStorage.removeItem('sessionStorage')
                        setUser({
                            username: '',
                            uuid: '',
                            _id: '',
                            gameId: '',
                            token: null
                        })
                        setGameOption({ option: '', gameId: '' })
                    }
                })
        }

        gameService.getMessages(0)
            .then(res => {
                setMessages(res)
            })
    }, [])

    const cancelRoom = (e, gameId) => {
        socket.current?.emit('remove-game', { gameId: gameId, userId: user._id })

        // setOnlineGames(state => state.filter(x => x?.room?.roomId != gameOption.gameId))

        setGameOption({
            option: '',
            gameId: '',
        })

        setRoom({
            roomId: '',
            _id: '',
            members: []
        })

        setUser(state => ({
            ...state,
            gameId: '',
        }))



        gameService.leaveRoom(localStorage.getItem('sessionStorage'))
    }

    return (
        <section className={styles.mainContainer}>

            <div className={styles.stage}>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
                <div className={styles.layer}></div>
            </div>

            <LoginComponent gameOption={gameOption} setGameOption={setGameOption} setOnlineUsers={setOnlineUsers} setRoom={setRoom} />

            {gameOption.option == 'create' && <CreateRoomComponent
                cancelRoom={cancelRoom}
                socket={socket}
                gameOption={gameOption}
                setGameOption={setGameOption}
                onlineGames={onlineGames}
                setOnlineGames={setOnlineGames}
                setRoom={setRoom}
                room={room}
            />}

            {gameOption.option == 'join' && <JoinRoomComponent
                cancelRoom={cancelRoom}
                socket={socket}
                gameOption={gameOption}
                setGameOption={setGameOption}
                onlineGames={onlineGames}
                setOnlineGames={setOnlineGames}
                setRoom={setRoom}
                room={room}
            />}

            {gameOption.option == 'random' && <RandomRoomComponent
                cancelRoom={cancelRoom}
                socket={socket}
                gameOption={gameOption}
                setGameOption={setGameOption}
                onlineGames={onlineGames}
                setOnlineGames={setOnlineGames}
                setRoom={setRoom}
                room={room}
            />}

            {user.token != null && <ChatComponent socket={socket} messages={messages} setMessages={setMessages} onlineUsers={onlineUsers} />}

            {user.token != null && <GameStatisticComponent onlineGames={onlineGames} />}
        </section>
    )
}