import { useState, useEffect, useRef } from "react"

import * as gameService from '../../../services/gameService'

export const ChatComponent = ({ socket, messages, setMessages }) => {
    let [currMessage, setCurrMessage] = useState('')
    const [receivedMessage, setReceivedMessage] = useState(null)
    const [newMessage, setNewMessage] = useState(null)
    const sendMessageBtn = useRef(null)

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

    const onEnterClick = (e) => {
        if (e.key == 'Enter') {
            sendMessage(e)
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
        </>
    )
}