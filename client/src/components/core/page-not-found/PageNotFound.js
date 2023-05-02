import { useNavigate } from 'react-router-dom'
import './pageNotFound.css'

export const PageNotFound = () => {
    const navigate = useNavigate()

    return (
        <section className='container'>
            <div className="page-not-found">
                <div className="cnt-scene">

                    <div className="scene">
                        <p className="p404" data-depth="0.50">404</p>
                        <p className="p404" data-depth="0.10">404</p>
                    </div>

                    <div className="text">
                        <p>Uh oh! Looks like you got lost. <br />Go back to the homepage if you dare!</p>
                        <button onClick={() => navigate('/')}>i dare!</button>
                    </div>

                </div>
            </div>
        </section>
    )
}