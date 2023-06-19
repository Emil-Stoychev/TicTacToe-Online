import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import styles from './About.module.css'


import * as gameService from '../../../services/gameService'
import useGlobalErrorsHook from '../../../hooks/useGlobalError';
import { AuthContext } from '../../../context/UserContext';

const AboutComponent = () => {
    const navigate = useNavigate()
    const [countCont, setCountCont] = useState([0, 0, 0])
    const [isRate, setIsRate] = useState(false)
    let { user, setUser } = useContext(AuthContext)
    let [errors, setErrors] = useGlobalErrorsHook()

    let valueDisplays = document.querySelectorAll("#num");
    let interval = 2000;

    useEffect(() => {
        gameService.getGameStatistic()
            .then(res => {
                setCountCont([res.happyUsers, res.playedUsers, res.fiveStars])
                if (res.peoples.includes(user?._id)) {
                    setIsRate(true)
                }
            })
    }, [])

    useEffect(() => {
        valueDisplays.forEach((x) => {
            let startValue = 0;
            let endValue = parseInt(x.getAttribute("data-val"));
            let duration = Math.floor(interval / endValue);
            let counter = setInterval(function () {
                startValue += 1;
                x.textContent = startValue;
                if (startValue == endValue) {
                    clearInterval(counter);
                }
            }, duration);
        });
    }, [countCont])

    const rateHandler = (e) => {
        if (e.target.value != 0 && e.target.value != undefined && e.target.value != null) {
            gameService.rateUs(localStorage.getItem('sessionStorage'), e.target.value)
                .then(res => {
                    if (!res.message) {
                        setErrors({ message: 'Thank you for your rating!', type: '' })

                        if (e.target.value == 5) {
                            setCountCont(state => [
                                state[0] + 1,
                                state[1] + 1,
                                state[2] + 1,
                            ])
                        } else if (e.target.value >= 3) {
                            setCountCont(state => [
                                state[0] + 1,
                                state[1] + 1,
                                state[2],
                            ])
                        } else {
                            setCountCont(state => [
                                state[0],
                                state[1] + 1,
                                state[2],
                            ])
                        }
                    } else {
                        setErrors({ message: res.message, type: '' })
                    }
                })
        }
    }

    return (
        <div className={styles?.['about-cont']}>
            <button onClick={() => navigate('/')} className={styles.backBtn}>Back</button>

            <h1>Tic Tac Toe in numbers</h1>

            {localStorage.getItem('sessionStorage') != undefined && !isRate &&
                <>
                    <h2>Select your rate</h2>
                    <div className={styles.rate} >
                        <input type="radio" id="star5" onClick={(e) => rateHandler(e)} name="rate" value="5" />
                        <label htmlFor="star5" title="text">5 stars</label>
                        <input type="radio" id="star4" onClick={(e) => rateHandler(e)} name="rate" value="4" />
                        <label htmlFor="star4" title="text">4 stars</label>
                        <input type="radio" id="star3" onClick={(e) => rateHandler(e)} name="rate" value="3" />
                        <label htmlFor="star3" title="text">3 stars</label>
                        <input type="radio" id="star2" onClick={(e) => rateHandler(e)} name="rate" value="2" />
                        <label htmlFor="star2" title="text">2 stars</label>
                        <input type="radio" id="star1" onClick={(e) => rateHandler(e)} name="rate" value="1" />
                        <label htmlFor="star1" title="text">1 star</label>
                    </div>
                    <hr />
                </>
            }


            <div className={styles?.['numberCounting-div']}>
                <div className={styles.numberCounting}>
                    <i className="fas fa-smile-beam"></i>
                    <span id='num' className={styles.num} data-val={countCont[0]}>0</span>
                    <span className={styles.text}>Happy Users</span>
                </div>
                <div className={styles.numberCounting}>
                    <i className="fas fa-list"></i>
                    <span id='num' className={styles.num} data-val={countCont[1]}>0</span>
                    <span className={styles.text}>Played users</span>
                </div>
                <div className={styles.numberCounting}>
                    <i className="fas fa-star"></i>
                    <span id='num' className={styles.num} data-val={countCont[2]}>0</span>
                    <span className={styles.text}>Five Stars</span>
                </div>
            </div>

            <h1>Our Contacts</h1>

            <div className={styles?.['about-contacts']}>
                <div>
                    <i onClick={() => window.open('https://www.facebook.com/profile.php?id=100010478416709', '_blank')} className="fa-brands fa-facebook"></i>
                </div>

                <div>
                    <i onClick={() => window.open('https://www.instagram.com/emil.stoichev/', '_blank')} className="fa-brands fa-square-instagram"></i>
                </div>

                <div>
                    <i onClick={() => window.open('https://github.com/Emil-Stoychev', '_blank')} className="fa-brands fa-github"></i>
                </div>

                <div>
                    <i onClick={() => window.open('https://www.linkedin.com/', '_blank')} className="fa-brands fa-linkedin"></i>
                </div>
            </div>

        </div >
    )
}

export default AboutComponent