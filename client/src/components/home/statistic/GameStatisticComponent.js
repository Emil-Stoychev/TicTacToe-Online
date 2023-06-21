import { useEffect, useState } from 'react'
import styles from './GameStatistic.module.css'

export const GameStatisticComponent = ({ onlineGames }) => {
    let [games, setGames] = useState({
        full: 0,
        create: 0,
        random: 0
    })

    useEffect(() => {
        let createNum = 0
        let randomNum = 0
        let fullNum = 0

        onlineGames.forEach(x => {
            
            if (x.room.members.length == 2) {
                fullNum++
            }

            if (x.room.visible == 'Private') {
                createNum++
            } else if (x.room.visible == 'Public') {
                randomNum++
            }
        });

        setGames({ create: createNum, random: randomNum, full: fullNum })

    }, [onlineGames])


    return (
        <section className={styles.mainSection}>
            <h2>Full rooms: {games.full}</h2>
            <span className={styles.nameAndMsgTrait}>|</span>
            <h2>Create mode: {games.create}</h2>
            <span className={styles.nameAndMsgTrait}>|</span>
            <h2>Random mode: {games.random}</h2>
        </section>
    )
}