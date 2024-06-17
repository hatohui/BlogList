import { useState } from "react"
import loginService from '../services/login'
import blogService from '../services/blogs'
import Notification from '../components/Notification'

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)

    //handle the login
    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password
            })
            //save to local storage
            window.localStorage.setItem(
                'loggedInUser', JSON.stringify(user)
            )
            
            //set the current ones
            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setMessage(exception.response.data.error)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    //return the component
    return (
        <div>
            <h2>Login to application</h2>
            <form onSubmit={handleLogin}>
                <Notification message={message}/>
                <p>Username <input type='text' value={username} onChange={({target}) => setUsername(target.value)}></input></p>
                <p>Password <input type='password' value={password} onChange={({target}) => setPassword(target.value)}></input></p>
                <button type='submit'> Login</button>
            </form>
        </div>
    )
}

export default Login