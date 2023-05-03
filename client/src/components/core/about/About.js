import { useNavigate } from 'react-router-dom'

const AboutComponent = () => {
    const navigate = useNavigate()

    return (
        <>
            <button onClick={() => navigate('/')}>Back</button>

            <h2>About component</h2>
        </>
    )
}

export default AboutComponent