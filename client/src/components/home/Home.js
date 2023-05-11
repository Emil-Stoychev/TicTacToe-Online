import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import * as gameService from '../../services/gameService'

import { CreateRoomComponent } from './CreateRoomComponent'
import { JoinRoomComponent } from './JoinRoomComponent'
import { RandomRoomComponent } from './RandomRoomComponent'


import { io } from 'socket.io-client'
import { AuthContext } from '../../context/UserContext'


export const HomeComponent = ({ socket, setOnlineUsers }) => {
    let { user, setUser } = useContext(AuthContext)

    const [gameOption, setGameOption] = useState({
        option: '',
        gameId: '',
    })
    const navigate = useNavigate()

    const changeUsernameHandler = (e) => {
        setUser(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
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

                        setGameOption({ option: res?.gameOption || '', gameId: res?.gameId || '' })
                    } else {
                        localStorage.removeItem('sessionStorage')
                        setUser({
                            username: '',
                            uuid: '',
                            _id: '',
                            gameId: '',
                            token: null
                        })
                        setGameOption({ option: '', gameId: '' })
                        console.log(res);
                    }
                })
        }
    }, [])

    const goToTop = () => {
        window.onload = window.scrollTo(0, 0)
    }

    const login = (e) => {
        e.preventDefault()

        if (user.username.length >= 3) {
            let generatedId = uuidv4()

            gameService.initUser(user.username, generatedId, 'create')
                .then(res => {
                    if (!res.message) {
                        setUser({
                            username: res?.username,
                            uuid: res?.uuid,
                            _id: res?._id,
                            gameId: '',
                            token: res?.token
                        })

                        localStorage.setItem('sessionStorage', res?.token)

                        setGameOption({ option: '', gameId: '' })
                    } else {
                        setGameOption({ option: '', gameId: '' })
                        localStorage.removeItem('sessionStorage')
                        setUser({
                            username: '',
                            uuid: '',
                            _id: '',
                            gameId: '',
                            token: null
                        })
                        console.log(res);
                    }
                })
        } else {
            console.log('Username must be at least 3 characters!');
        }
    }

    const leave = (e) => {
        e.preventDefault()

        gameService.leaveUser(user)
            .then(res => {
                setGameOption({ option: '', gameId: '' })
                localStorage.removeItem('sessionStorage')
                setUser({
                    username: '',
                    uuid: '',
                    _id: '',
                    gameId: '',
                    token: null
                })
            })
    }

    const enterRoom = (e, option) => {
        e.preventDefault()

        if (user.username.length >= 3) {
            let generatedId = uuidv4()

            gameService.enterRoom(user.username, generatedId, option)
                .then(res => {
                    if (!res.message) {
                        setUser({
                            username: res?.username,
                            uuid: res?.uuid,
                            _id: res?._id,
                            gameId: res?.gameId,
                            token: res?.token
                        })

                        localStorage.setItem('sessionStorage', res?.token)

                        setGameOption({ option: option, gameId: res.gameId })
                    } else {
                        setGameOption({ option: '', gameId: '' })
                        localStorage.removeItem('sessionStorage')
                        setUser({
                            username: '',
                            uuid: '',
                            _id: '',
                            gameId: '',
                            token: null
                        })
                        console.log(res);
                    }
                })
        } else {
            console.log('Username must be at least 3 characters!');
        }
    }

    const cancelRoom = (e) => {
        setGameOption({
            option: '',
            gameId: '',
        })

        setUser(state => ({
            ...state,
            gameId: '',
        }))

        gameService.leaveRoom(localStorage.getItem('sessionStorage'))
    }

    return (
        <>
            <h2>Tic Tac Toe Online</h2>

            <form className="loginForm">
                <label htmlFor="username">Name</label>
                <input disabled={user.token != null} id="username" minLength={3} name="username" type="text" placeholder="John" value={user.username || ''} onChange={(e) => changeUsernameHandler(e)} />
                {user.token != null && <button onClick={(e) => leave(e)}>Leave</button>}

                {user.token == null
                    ? <button onClick={(e) => login(e)}>Play</button>
                    :
                    user.gameId == '' &&
                    <div className="createAndJoinRoomBtns">
                        <button onClick={(e) => enterRoom(e, 'create')}>Create room</button>
                        <button onClick={(e) => enterRoom(e, 'join')}>Join room</button>
                        <button onClick={(e) => enterRoom(e, 'random')}>Random room</button>
                    </div>
                }
            </form>

            {gameOption.option == 'create' && <CreateRoomComponent cancelRoom={cancelRoom} socket={socket} />}

            {gameOption.option == 'join' && <JoinRoomComponent cancelRoom={cancelRoom} socket={socket} />}

            {gameOption.option == 'random' && <RandomRoomComponent cancelRoom={cancelRoom} socket={socket} />}

            {gameOption.option == '' &&
                <>
                    <button onClick={() => navigate('/settings')}>Settings</button>
                    <button onClick={() => navigate('/about')}>About</button>
                </>
            }
        </>
    )
}