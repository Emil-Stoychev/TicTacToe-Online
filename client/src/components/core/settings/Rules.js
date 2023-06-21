import { useNavigate } from 'react-router-dom'

import styles from './Rules.module.css'
import { useEffect } from 'react'

const RulesComponent = () => {
    const navigate = useNavigate()

    useEffect(() => {
        window.onload = window.scrollTo(0, 0)
      }, [])

    return (
        <section className={styles?.['settings-cont']}>
            <button onClick={() => navigate('/')} className={styles.backBtn}>Back</button>

            <div className={styles.settingsBlock}>
                <h2 className={styles.mainTitle}>Rules for Tic Tac Toe</h2>

                <div className={styles.firstDiv}>
                    <ol>
                        <li>The game is played on a grid that's 3 squares by 3 squares.</li>
                        <li>You are <span className={styles.playerX}>X</span>, your friend is <span className={styles.playerO}>O</span>. Players take turns putting their marks in empty squares.</li>
                        <li>The first player to get 3 of her marks in a row (up, down, across, or diagonally) is the winner.</li>
                        <li>When all 9 squares are full, the game is over. If no player has 3 marks in a row, the game ends in a tie.</li>
                    </ol>
                </div>

                <div className={styles.secondDiv}>
                    <h3>How can I win at Tic Tac Toe?</h3>

                    <p>
                        To beat the computer (or at least tie), you need to make use of a little bit of strategy. Strategy means figuring out what you need to do to win.
                    </p>

                    <p>
                        Part of your strategy is trying to figure out how to get three <span className={styles.playerX}>X</span> s in a row. The other part is trying to figure out how to stop the computer from getting three <span className={styles.playerO}>O</span> s in a row.
                    </p>

                    <p>
                        After you put an <span className={styles.playerX}>X</span> in a square, you start looking ahead. Where's the best place for your next <span className={styles.playerX}>X</span> ? You look at the empty squares and decide which ones are good choices which ones might let you make three <span className={styles.playerX}>X</span> s in a row.
                    </p>

                    <p>
                        You also have to watch where the computer puts its <span className={styles.playerO}>O</span>. That could change what you do next. If the computer gets two <span className={styles.playerO}>O</span> s in a row, you have to put your next <span className={styles.playerX}>X</span> in the last empty square in that row, or the computer will win. You are forced to play in a particular square or lose the game.
                    </p>

                    <p>
                        If you always pay attention and look ahead, you'll never lose a game of Tic-Tac-Toe. You may not win, but at least you'll tie.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default RulesComponent