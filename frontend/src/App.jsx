import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Landing from './components/Landing.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import UserAdmin from './components/UserAdmin.jsx'
import Feedback from './components/Feedback.jsx'
import AboutUs from './components/AboutUs.jsx'
import MyEvents from './components/MyEvents.jsx'
import AddEvent from './components/AddEvent.jsx'
import FindEvents from './components/FindEvents.jsx'
import Profile from './components/Profile.jsx'
import ChangePassword from './components/ChangePassword.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/useradmin" element={<UserAdmin />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/addevent" element={<AddEvent />} />
        <Route path="/findevents" element={<FindEvents />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/changepassword" element={<ChangePassword />} />
      </Routes>
    </Router>
  )
}

export default App 