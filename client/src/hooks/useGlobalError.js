import { useEffect, useState } from "react"
import Snackbar from 'awesome-snackbar'
import { useNavigate } from "react-router-dom"

const useGlobalErrorsHook = () => {
    const [errors, setErrors] = useState({
        message: '',
        type: ''
    })
    const navigate = useNavigate()

    useEffect(() => {
        if (errors.message == 'Unauthorized!') {
            localStorage.removeItem('sessionStorage')

            new Snackbar('Please login!')

            setTimeout(() => {
                setErrors({ message: '', type: '' })
            }, 3000);

            navigate('/login')
        } else {
            if (errors?.type == 'loading') {
                if (errors?.message != '') {
                    new Snackbar(errors.message, { iconSrc: './loading-gif.gif', timeout: 1500 })
                }
            } else if (errors?.type == 'remove image') {
                new Snackbar(`Image has been removed!`, {
                    position: 'bottom-center',
                    timeout: 1500,
                    style: {
                        container: [
                            ['background-color', 'red'],
                            ['border-radius', '5px']
                        ]
                    }
                })

            } else if (errors?.type == 'logged') {
                new Snackbar(`Welcome, `, {
                    position: 'bottom-center',
                    theme: 'dark',
                    position: 'top-center',
                    actionText: `${errors.message}! 😇`,
                })

            } else {
                if (errors?.message != '') {
                    new Snackbar(errors.message)

                    setTimeout(() => {
                        setErrors({ message: '', type: '' })
                    }, 3000);
                }
            }
        }
    }, [errors.message, errors.type])

    return [errors, setErrors]
}

export default useGlobalErrorsHook

