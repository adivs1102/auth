import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate=useNavigate()
  axios.defaults.withCredentials = true
  const handleLogout = () => {
    axios.get('http://13.200.26.173:3000/auth/logout')
    .then(res => {
      if(res.data.status){
        navigate('/login')
      }
    }).catch(err => {
      console.log(err)
    })
  }
  const handleLogin = () => {
    navigate('/login')
  }
  const handleSignup = () => {
    navigate('/signup')
  }
  return (
    <div className='sign-up-container'>
    <div className='sign-up-form'>
      Home
      <button><Link to="/dashboard">Dashboard</Link></button>
      <br />
      <br />
      <button onClick={handleLogout}>Logout</button>
      <br />
      <br />
      <button onClick={handleLogin}>Login</button>
      <br />
      <br />
      <button onClick={handleSignup}>Signup</button>
      
    </div>
    </div>
  )
}

export default Home