import { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import * as gameService from '../../services/gameService'

import { CreateRoomComponent } from './CreateRoomComponent'
import { JoinRoomComponent } from './JoinRoomComponent'
import { RandomRoomComponent } from './RandomRoomComponent'


import { io } from 'socket.io-client'
import { AuthContext } from '../../context/UserContext'


export const HomeComponent = ({ socket, setOnlineUsers, onlineUsers, onlineGames, setOnlineGames }) => {
    let { user, setUser } = useContext(AuthContext)
    const [messages, setMessages] = useState([])
    const [receivedMessage, setReceivedMessage] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    let [currMessage, setCurrMessage] = useState('')

    const [gameOption, setGameOption] = useState({
        option: '',
        gameId: '',
    })
    const navigate = useNavigate()
    const sendMessageBtn = useRef(null)

    const onEnterClick = (e) => {
        if (e.key == 'Enter') {
            sendMessage(e)
        }
    }

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

        gameService.getMessages(0)
            .then(res => {
                setMessages(res)
            })
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
                setOnlineUsers(state => state.filter(x => x.user._id != user._id))
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

        let data = {
            option,
        }

        if (option == 'join') {
            setGameOption({ option: 'join', gameId: '' })

            return
        }

        gameService.enterRoom(localStorage.getItem('sessionStorage'), data)
            .then(res => {
                if (!res.message) {
                    setUser(state => ({
                        ...state,
                        gameId: res?._id,
                    }))

                    setGameOption({ option: option, gameId: res._id })
                } else {
                    setUser(state => ({
                        ...state,
                        gameId: '',
                    }))
                    setGameOption({ option: '', gameId: '' })
                    console.log(res);
                }
            })
    }

    const cancelRoom = (e, gameId) => {
        socket.current?.emit('remove-game', { gameId: gameId, userId: user._id })

        // setOnlineGames(state => state.filter(x => x?.room?.roomId != gameOption.gameId))

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

    const sendMessage = (e) => {
        if (currMessage != '' && currMessage.length != 0 && currMessage.trim() != '') {
            gameService.sendMessage(localStorage.getItem('sessionStorage'), currMessage)
                .then(res => {
                    if (!res.message) {
                        setMessages(state => [...state, res])
                        res.socketId = socket.current.id

                        setNewMessage(res)

                        setCurrMessage('')
                    } else {
                        console.log(res);
                    }
                })
        } else {
            console.log('Type smth');
        }
    }

    // SEND AND RECEIVE MESSAGES
    useEffect(() => {
        if (newMessage != null) {
            socket.current?.emit('send-message', newMessage)

            setNewMessage(null)
        }
    }, [sendMessage])


    socket.current?.on('receive-message', (data) => {
        setReceivedMessage(data)
    })

    useEffect(() => {
        if (receivedMessage != null) {
            setMessages(state => [...state, receivedMessage])
        }
    }, [receivedMessage])

    return (
        <>
            <h2>Tic Tac Toe Online</h2>

            {user.token != null && <h2>Online players: {onlineUsers.length}</h2>}

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

            {gameOption.option == 'create' && <CreateRoomComponent cancelRoom={cancelRoom} socket={socket} gameOption={gameOption} setGameOption={setGameOption} onlineGames={onlineGames} setOnlineGames={setOnlineGames} />}

            {gameOption.option == 'join' && <JoinRoomComponent cancelRoom={cancelRoom} socket={socket} gameOption={gameOption} setGameOption={setGameOption} onlineGames={onlineGames} setOnlineGames={setOnlineGames} />}

            {gameOption.option == 'random' && <RandomRoomComponent cancelRoom={cancelRoom} socket={socket} gameOption={gameOption} setGameOption={setGameOption} onlineGames={onlineGames} setOnlineGames={setOnlineGames} />}

            {gameOption.option == '' &&
                <>
                    <button onClick={() => navigate('/settings')}>Settings</button>
                    <button onClick={() => navigate('/about')}>About</button>
                </>
            }

            {user.token != null &&
                <div className='chat-section'>
                    <div className='body'>
                        {messages.length == 0
                            ? <h2>No messages yet!</h2>
                            : messages.map(x => <h5 key={x._id}>{x.senderName}: {x.text}</h5>)}
                    </div>
                    <div className='chat-send'>
                        <input type='text' onKeyDown={onEnterClick} value={currMessage} onChange={(e) => setCurrMessage(e.target.value)} placeholder='Type your message here...' />
                        <button ref={sendMessageBtn} onClick={sendMessage}>✓</button>
                    </div>
                </div >
            }
        </>
    )
}