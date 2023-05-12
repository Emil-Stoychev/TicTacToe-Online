import { useContext, useEffect, useRef, useState } from 'react'
import './style.css'

import * as gameService from '../../services/gameService'
import { AuthContext } from '../../context/UserContext'
import { useLocation, useNavigate } from 'react-router-dom'

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
                            name: res?.members[0].username,
                            spanEl: 'X'
                        })
                    } else {
                        navigate('/')
                    }
                })
        } else {
            navigate('/')
        }
    }, [])

    const tilesContainer = useRef(null)
    const wonGameText = useRef(null)
    let roundWin

    let currentPlayer = 'X';
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

    function resultValidate(currentPlayer) {
        let e
        let s
        let r

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
            let first = Array.from(board).find((x, i) => i == e)
            let second = Array.from(board).find((x, i) => i == s)
            let third = Array.from(board).find((x, i) => i == r)
            winGame(currPlayer.name)
            // roundWinActions(first, second, third)
        }
    }

    // socket.current?.on('receive-message', (data) => {
    //     setReceivedMessage(data)
    // })

    async function setInBoardIndex(tile, index) {

        console.log(tile);
        console.log(index);

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
            })

        setCurrentPlayer(state => ({
            ...state,
            spanEl: currPlayer == 'X' ? 'O' : 'X'
        }))

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
            <section className="display">
                Player <span className="playerX">{currPlayer.spanEl}</span>'s turn
            </section>
            <section className="container" ref={tilesContainer}>
                {board.map((x, i) => <div key={i} onClick={() => setInBoardIndex(x, i)} className="tile">{x}</div>)}
            </section>
            <section id="wonGameText" ref={wonGameText} className="display hide"></section>
        </>
    )
}

export default GameComponent