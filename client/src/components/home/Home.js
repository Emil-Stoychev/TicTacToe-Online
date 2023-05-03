import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import * as gameService from '../../services/gameService'

import { CreateRoomComponent } from './CreateRoomComponent'
import { JoinRoomComponent } from './JoinRoomComponent'
import { RandomRoomComponent } from './RandomRoomComponent'


import { io } from 'socket.io-client'

export const HomeComponent = ({ socket, setOnlineUsers }) => {
    const [guest, setGuest] = useState({
        username: '',
        uuid: '',
        _id: '',
        gameId: '',
        token: null
    })
    const [gameOption, setGameOption] = useState({
        option: '',
        gameId: '',
    })
    const navigate = useNavigate()

    const changeUsernameHandler = (e) => {
        setGuest(state => ({
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
                        setGuest({
                            username: res?.username,
                            uuid: res?.uuid,
                            _id: res?._id,
                            gameId: res?.gameId || '',
                            token: localStorage.getItem('sessionStorage')
                        })

                        setGameOption({ option: res?.gameOption || '', gameId: res?.gameId || '' })
                    } else {
                        localStorage.removeItem('sessionStorage')
                        setGameOption({ option: '', gameId: '' })
                        console.log(res);
                    }
                })
        }
    }, [])

    const goToTop = () => {
        window.onload = window.scrollTo(0, 0)
    }

    // useEffect(() => {
    //     console.log('change...');
    //     socket.current = io(`http://${window.location.hostname}:3000`)
    //     socket.current?.emit("newUser", guest?_.id)
    //     socket.current?.on('get-users', (users) => {
    //         setOnlineUsers(users)
    //     })
    // }, [socket, guest])

    useEffect(() => {
        console.log(guest);
        if (guest?.token != null) {
            socket.current = io(`http://${window.location.hostname}:3000`)
            socket.current?.emit("newUser", guest?._id)
            socket.current?.on('get-users', (users) => {
                setOnlineUsers(users)
            })
        }
    }, [guest])

    const createRoom = (e) => {
        e.preventDefault()

        if (guest.username.length >= 3) {
            let generatedId = uuidv4()

            gameService.initUser(guest.username, generatedId, 'create')
                .then(res => {
                    if (!res.message) {
                        setGuest({
                            username: res?.username,
                            uuid: res?.uuid,
                            _id: res?._id,
                            gameId: '',
                            token: res?.token
                        })

                        localStorage.setItem('sessionStorage', res?.token)

                        setGameOption({ option: 'create', gameId: '' })
                    } else {
                        setGameOption({ option: '', gameId: '' })
                        localStorage.removeItem('sessionStorage')
                        console.log(res);
                    }
                })
        } else {
            console.log('Username must be at least 3 characters!');
        }
    }

    const joinRoom = (e) => {
        e.preventDefault()

        if (guest.username.length >= 3) {
            let generatedId = uuidv4()

            gameService.initUser(guest.username, generatedId, 'join')
                .then(res => {
                    try {
                        setGuest({
                            username: res?.username,
                            uuid: res?.uuid,
                            _id: res?._id,
                            gameId: '',
                            token: res?.token
                        })

                        localStorage.setItem('sessionStorage', res?.token)

                        setGameOption({ option: 'join', gameId: '' })
                    } catch (error) {
                        setGameOption({ option: '', gameId: '' })
                        localStorage.removeItem('sessionStorage')
                        console.log(error);
                    }
                })
        } else {
            console.log('Username must be at least 3 characters!');
        }
    }

    const randomRoom = (e) => {
        e.preventDefault()

        if (guest.username.length >= 3) {
            let generatedId = uuidv4()

            gameService.initUser(guest.username, generatedId, 'random')
                .then(res => {
                    try {
                        setGuest({
                            username: res?.username,
                            uuid: res?.uuid,
                            _id: res?._id,
                            gameId: '',
                            token: res?.token
                        })

                        localStorage.setItem('sessionStorage', res?.token)

                        setGameOption({ option: 'random', gameId: '' })
                    } catch (error) {
                        setGameOption({ option: '', gameId: '' })
                        localStorage.removeItem('sessionStorage')
                        console.log(error);
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

        setGuest(state => ({
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
                <input disabled={gameOption.option != ''} id="username" minLength={3} name="username" type="text" placeholder="John" value={guest.username || ''} onChange={(e) => changeUsernameHandler(e)} />

                {gameOption.option == '' &&
                    <div className="createAndJoinRoomBtns">
                        <button onClick={(e) => createRoom(e)}>Create room</button>
                        <button onClick={(e) => joinRoom(e)}>Join room</button>
                        <button onClick={(e) => randomRoom(e)}>Random room</button>
                    </div>
                }
            </form>

            {gameOption.option == 'create' && <CreateRoomComponent cancelRoom={cancelRoom} />}

            {gameOption.option == 'join' && <JoinRoomComponent guest={guest} cancelRoom={cancelRoom} />}

            {gameOption.option == 'random' && <RandomRoomComponent cancelRoom={cancelRoom} />}

            {gameOption.option == '' &&
                <>
                    <button onClick={() => navigate('/settings')}>Settings</button>
                    <button onClick={() => navigate('/about')}>About</button>
                </>
            }
        </>
    )
}