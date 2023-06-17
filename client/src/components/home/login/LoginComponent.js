import styles from './LoginCss.module.css'

import { useContext } from 'react'
import * as gameService from '../../../services/gameService'
import { AuthContext } from '../../../context/UserContext'
import useGlobalErrorsHook from '../../../hooks/useGlobalError'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'


export const LoginComponent = ({ gameOption, setGameOption, setOnlineUsers, setRoom }) => {
    let { user, setUser } = useContext(AuthContext)
    let [errors, setErrors] = useGlobalErrorsHook()
    const navigate = useNavigate()

    const changeUsernameHandler = (e) => {
        setUser(state => ({
            ...state,
            [e.target.name]: e.target.value
        }))
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
                        setErrors({ message: res?.username, type: 'logged' })

                        setGameOption({ option: '', gameId: '' })
                    } else {
                        setGameOption({ option: '', gameId: '' })
                        setErrors({ message: 'Please log in again!', type: 'Unauthorized!' })
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
            setErrors({ message: 'Username must be at least 3 characters!', type: '' })
            console.log('Username must be at least 3 characters!');
        }
    }

    const leave = (e) => {
        e.preventDefault()

        if (gameOption.gameId != '' && gameOption.gameId != undefined && gameOption.gameId != null) {
            return console.log({ message: 'First u must leave room!' });
        }

        gameService.leaveUser(user)
            .then(res => {
                // socket.current?.emit('remove-game', { gameId: res.gameId, userId: res.userId })
                setOnlineUsers(state => state.filter(x => x.user._id != user._id))
                setGameOption({ option: '', gameId: '' })
                setRoom({
                    roomId: '',
                    _id: '',
                    members: []
                })
                localStorage.removeItem('sessionStorage')
                setUser({
                    username: '',
                    uuid: '',
                    _id: '',
                    gameId: '',
                    token: null
                })

                setErrors({ message: 'See you soon!', type: 'out' })
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

    return (
        <section className={styles.mainSection}>
            <form className={styles.loginForm}>
                <label className={styles.labelForUsername} htmlFor="username">Name</label>
                <input disabled={user.token != null} className={styles.usernameInput} id="username" minLength={3} name="username" type="text" placeholder="John" value={user.username || ''} onChange={(e) => changeUsernameHandler(e)} />

                {user.token == null
                    ? <button className={styles.primaryBtn} onClick={(e) => login(e)}>Play</button>
                    :
                    gameOption.option == '' &&
                    <div className="createAndJoinRoomBtns">
                        <button className={styles.primaryBtn} onClick={(e) => enterRoom(e, 'create')}>Create room</button>
                        <button className={styles.primaryBtn} onClick={(e) => enterRoom(e, 'join')}>Join room</button>
                        <button className={styles.primaryBtn} onClick={(e) => enterRoom(e, 'random')}>Random room</button>
                    </div>
                }
            </form>

            {gameOption.option == '' &&
                <div className={styles.SettAndAboutDivBtns}>
                    <button onClick={() => navigate('/settings')}>Settings</button>
                    <button onClick={() => navigate('/about')}>About</button>
                    {user.token != null && <button className={styles.primaryBtn} onClick={(e) => leave(e)}>Leave</button>}
                </div>
            }
        </section>
    )
}