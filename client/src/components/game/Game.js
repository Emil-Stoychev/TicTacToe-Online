import { useRef, useState } from 'react'
import './style.css'

const GameComponent = () => {
    const [currPlayer, setCurrentPlayer] = useState({
        name: '',
        spanEl: 'X'
    })
    const [board, setBoard] = useState(['', '', '', '', '', '', '', '', ''])

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

    function setInBoardIndex(tile, index) {

        console.log(tile);
        console.log(index);

        if (tile === 'X' || tile === 'O' || tile === ' ') {
            return
        }

        setBoard(state => state.map((x, i) => {
            if (i == index) {
                x = i % 2 == 1 ? 'X' : 'O'
            }

            return x
        })
        )

        resultValidate(currentPlayer)

        setCurrentPlayer(state => ({
            ...state,
            spanEl: currentPlayer
        }))
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