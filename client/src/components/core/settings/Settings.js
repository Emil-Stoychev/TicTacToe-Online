import { useNavigate } from 'react-router-dom'

const SettingsComponent = () => {
    const navigate = useNavigate()

    return (
        <>
            <button onClick={() => navigate('/')}>Back</button>

            <h2>Settings component</h2>
        </>
    )
}

export default SettingsComponent