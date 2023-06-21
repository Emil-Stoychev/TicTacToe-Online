import { useState, useEffect, useRef, useContext } from "react"
import InputEmoji from 'react-input-emoji'

import { format } from "timeago.js";
import styles from './Chat.module.css'

import * as gameService from '../../../services/gameService'
import { AuthContext } from "../../../context/UserContext"
import useGlobalErrorsHook from "../../../hooks/useGlobalError"

export const ChatComponent = ({ socket, messages, setMessages, onlineUsers }) => {
    let { user, setUser } = useContext(AuthContext)
    let [errors, setErrors] = useGlobalErrorsHook()

    let [currMessage, setCurrMessage] = useState('')
    const [receivedMessage, setReceivedMessage] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const sendMessageBtn = useRef(null)
    const scrollBody = useRef()

    useEffect(() => {
        goToLastMsg()
    }, [])

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
                        setErrors({ message: res, type: '' })
                    }
                })
        }
    }

    const onEnterClick = (e) => {
        if (e.key == 'Enter') {
            sendMessage(e)
        }
    }

    // SEND AND RECEIVE MESSAGES
    useEffect(() => {
        if (newMessage != null) {
            socket.current?.emit('send-message', newMessage)

            setTimeout(() => {
                goToLastMsg()
            }, 1);

            setNewMessage(null)
        }
    }, [sendMessage])


    socket.current?.on('receive-message', (data) => {
        setReceivedMessage(data)
    })

    useEffect(() => {
        if (receivedMessage != null) {
            setMessages(state => [...state, receivedMessage])

            setTimeout(() => {
                goToLastMsg()
            }, 1);
        }
    }, [receivedMessage])

    const goToLastMsg = () => {
        scrollBody.current?.scrollTo(0, scrollBody?.current?.scrollHeight);
    }

    return (
        <>
            <div className={styles?.['chat-section']}>
                <div className={styles.onlineChatHeader}>
                    <h2>Online chat for all users: {user.token != null && <span className={styles.onlineUsers}>{onlineUsers.length}</span>}</h2>
                </div>
                <div className={styles?.['chat-body']} ref={scrollBody}>
                    {messages.length == 0
                        ? <h2>No messages yet!</h2>
                        : messages.map(x =>
                            <div key={x._id}>
                                <div className={styles.message}><b className={styles.senderName}>{x.senderName}</b> <span className={styles.nameAndMsgTrait}>|</span> {x.text}</div>
                                <span className={styles.createdAt}>{format(x?.createdAt)}</span>
                            </div>
                        )}
                </div>
                {/* <div className={styles?.['chat-send']}>
                    <input type='text' onKeyDown={onEnterClick} value={currMessage} onChange={(e) => setCurrMessage(e.target.value)} placeholder='Type your message here...' />
                    <button ref={sendMessageBtn} onClick={sendMessage}>✓</button>
                </div> */}


                <div className={styles?.["chat-sender"]}>
                    <InputEmoji
                        value={currMessage}
                        onChange={(e) => setCurrMessage(e)}
                        onKeyDown={onEnterClick}
                    />
                    <div ref={sendMessageBtn} className={styles?.["send-button-chat"]} onClick={sendMessage}>✓</div>
                </div>{" "}
            </div >
        </>
    )
}