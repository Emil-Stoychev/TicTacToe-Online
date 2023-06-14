import { useContext, useEffect, useRef, useState } from 'react'
import './style.css'

import * as gameService from '../../services/gameService'
import { AuthContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

const GameComponent = ({ socket }) => {
    const [currPlayer, setCurrentPlayer] = useState({
        name: '',
        spanEl: 'X'
    })
    const [members, setMembers] = useState({
        firstP: {},
        secondP: {}
    })
    const { user, setUser } = useContext(AuthContext)

    const [currGame, setCurrGame] = useState({})
    const [board, setBoard] = useState(['', '', '', '', '', '', '', '', ''])
    const navigate = useNavigate()


    useEffect(() => {
        let gameId = window.location.pathname.split('/game/')[1]

        if (gameId == user?.gameId) {
            gameService.getGame(gameId, localStorage.getItem('sessionStorage'))
                .then(res => {
                    if (!res.message) {
                        setBoard(res.board)
                        setCurrGame(res)

                        setMembers({
                            firstP: res?.members[0],
                            secondP: res?.members[1],
                        })

                        setCurrentPlayer({
                            name: res?.members[res?.playerTurn].username,
                            spanEl: res?.playerTurn == 0 ? 'X' : 'O'
                        })
                    } else {
                        navigate('/')
                    }
                })
        } else {
            navigate('/')
        }
    }, [])

    const leaveRoom = (e) => {
        gameService.leaveRoom(localStorage.getItem('sessionStorage'))
            .then(res => {
                console.log(res);
                if (!res.message) {
                    setUser(state => ({
                        ...state,
                        [state.gameOption]: '',
                        [state.gameId]: undefined
                    }))

                    socket.current?.emit('leave-game', {
                        gameId: currGame._id,
                        receiverId: members?.firstP?._id != user._id ? members.firstP._id : members.secondP._id,
                    })
                } else {
                    console.log(res);
                }

                navigate('/')
            })
    }

    const tilesContainer = useRef(null)
    const wonGameText = useRef(null)
    let roundWin

    let currentPlayer = currPlayer.spanEl;
    let isFilled

    /*
        Board indexes
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    */

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    console.log(currPlayer);
    let e
    let s
    let r

    function resultValidate(currentPlayer) {
        roundWin = false
        // wonGameText.setAttribute('class', 'display hide')
        for (let i = 0; i <= 7; i++) {
            let winCondition = winningConditions[i]
            let a = board[winCondition[0]]
            let b = board[winCondition[1]]
            let c = board[winCondition[2]]

            if (a == '' || b == '' || c == '') {
                continue
            }

            if (a == b && b == c) {
                roundWin = true
                e = winCondition[0]
                s = winCondition[1]
                r = winCondition[2]
                break
            }
        }

        if (roundWin) {
            // let first = Array.from(board).find((x, i) => i == e)
            // let second = Array.from(board).find((x, i) => i == s)
            // let third = Array.from(board).find((x, i) => i == r)
            winGame(currPlayer.name)
            // roundWinActions(first, second, third)
        }
    }

    socket.current?.on('game-update', (data) => {
        if (data != null && data != undefined) {
            setCurrentPlayer({ name: data?.currPlayer, spanEl: data?.currSpanEl })
            setBoard(data?.board)
            setCurrGame(state => ({
                ...state,
                playerX: data?.playerX,
                playerO: data?.playerO,
            }))
        }
    })

    socket.current?.on('game-update-afterUserLeaved', (data) => {
        console.log('LEAVE ROOM AUTO AFTER THIS MESSAGE');
        console.log(data);
        if (data != null && data != undefined) {
            navigate('/')
        }
    })

    async function setInBoardIndex(tile, index) {
        if (tile === 'X' || tile === 'O' || tile === ' ') {
            return
        }

        if (currPlayer.name != user?.username) {
            return
        }

        await gameService.setInBoard(currentPlayer, index, currPlayer.name, currGame?._id)
            .then(res => {
                setCurrGame(res)
                setBoard(res.board)

                socket.current?.emit('update-board', {
                    gameId: currGame._id,
                    currPlayer: members?.firstP?.username != currPlayer.name ? members.firstP.username : members.secondP.username,
                    currSpanEl: res?.playerTurn == 0 ? 'X' : 'O',
                    board: res.board,
                    receiverId: members?.firstP?.username != currPlayer.name ? members.firstP._id : members.secondP._id,
                    playerX: res.playerX,
                    playerO: res.playerO,
                })
            })

        setCurrentPlayer({
            name: members?.firstP?.username != currPlayer.name ? members.firstP.username : members.secondP.username,
            spanEl: currPlayer.spanEl == 'X' ? 'O' : 'X'
        })

        resultValidate(currentPlayer)

        // curPlayerSpanEl.setAttribute('class', `player${currentPlayer}`)
        isFilled = Array.from(board).some(x => x == '')

        if (!isFilled) {
            if (!roundWin) {
                wonGameText.current = `Try again!`
                // wonGameText.setAttribute('class', 'display')
            }
        }
    }


    function winGame() {
        wonGameText.current = `Player ${currPlayer.name} win the Game!`
        // wonGameText.setAttribute('class', 'display')
        setBoard(['', '', '', '', '', '', '', '', ''])
    }
    let timer

    // function resetGame() {
    //     setBoard(['', '', '', '', '', '', '', '', ''])
    //     wonGameText.setAttribute('class', 'display hide')
    //     currentPlayer = 'X'

    //     setCurrentPlayer(state => ({
    //         ...state,
    //         spanEl: currentPlayer
    //     }))
    //     // curPlayerSpanEl.setAttribute('class', `player${currentPlayer}`)
    //     clearInterval(timer)
    // }

    // function roundWinActions(...params) {
    //     timer = setInterval(() => {
    //         let randomNum = Math.floor(Math.random() * 3) + 1
    //         params.forEach(x => x.setAttribute('class', `tile win${randomNum}`))
    //     }, 400);
    // }

    console.log(board);

    return (
        <>
            <section className="title">
                <h1>Tic Tac Toe</h1>
                <span>{currGame?.playerX || 0}:{currGame?.playerO || 0}</span>
            </section>
            <section className="display">Player <span className="playerX">{currPlayer.name}</span>'s turn</section >
            <section className="container" ref={tilesContainer}>
                {board.map((x, i) => <div key={i} onClick={() => setInBoardIndex(x, i)} className="tile">{x}</div>)}
            </section>
            <section id="wonGameText" ref={wonGameText} className="display hide"></section>

            <button onClick={(e) => leaveRoom(e)}>Leave</button>
        </>
    )
}

export default GameComponent