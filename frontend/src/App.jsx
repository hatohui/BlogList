import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Login from './views/Login'
import BlogDisplay from './views/BlogDisplay'

const App = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return <div>
    {user === null && <Login setUser={setUser}/>}
    {user !== null && <BlogDisplay setUser={setUser} user={user}/>}
  </div>
}

export default App