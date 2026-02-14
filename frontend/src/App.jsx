import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import Home from './components/Home.jsx'
import Landing from './components/Landing.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Feedback from './components/Feedback.jsx'
import AboutUs from './components/AboutUs.jsx'
import MyEvents from './components/MyEvents.jsx'
import AddEvent from './components/AddEvent.jsx'
import FindEvents from './components/FindEvents.jsx'
import Profile from './components/Profile.jsx'
import ChangePassword from './components/ChangePassword.jsx'
import StaffDashboard from './components/StaffDashboard.jsx'
import StaffProfile from './components/StaffProfile.jsx'
import Navbar from './components/Navbar.jsx'
import ManageEvents from './components/ManageEvents.jsx'
import ManageUsers from './components/ManageUsers.jsx'
import Insights from './components/Insights.jsx'
import ViewFeedback from './components/ViewFeedback.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

const App = () => {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            fontSize: '16px',
            padding: '16px 24px',
            maxWidth: '500px',
          },
          success: {
            style: {
              background: '#D1E7DD', // Light pastel green
              color: '#0F5132',      // Dark green text
              border: '1px solid #A3CFBB',
              fontSize: '18px',
              fontWeight: '500',
              padding: '20px 30px',
              minWidth: '400px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            iconTheme: {
              primary: '#0F5132',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#F8D7DA', // Light pastel red
              color: '#842029',      // Dark red text
              border: '1px solid #F1AEB5',
              fontSize: '18px',
              fontWeight: '500',
              padding: '20px 30px',
              minWidth: '400px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            iconTheme: {
              primary: '#842029',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/aboutus" element={<AboutUs />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/myevents" element={<MyEvents />} />
          <Route path="/addevent" element={<AddEvent />} />
          <Route path="/findevents" element={<FindEvents />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/changepassword" element={<ChangePassword />} />
        </Route>

        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/staff-profile" element={<StaffProfile />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/view-feedback" element={<ViewFeedback />} />
          <Route path="/staff/change-password" element={<ChangePassword />} />
        </Route>
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App 