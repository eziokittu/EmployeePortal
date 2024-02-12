import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, RouterProvider, createBrowserRouter, Routes, Route } from 'react-router-dom'
// import App from './App.jsx'
import './index.css'
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import Login from './components/Login/Login.jsx'
import Signup from './components/Signin/Signup.jsx'
import Layout from './Layout.jsx'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import Employee from './components/Dashboard/Employee.jsx'
import Projects from './components/Dashboard/Projects.jsx'
import Termination from './components/Dashboard/Termination.jsx'
import Internship from './components/Dashboard/Internship.jsx'
import Jobs from './components/Dashboard/Jobs.jsx'
import Chat from './components/Dashboard/Chat.jsx'
import Activity from './components/Dashboard/Activity.jsx'
import Settings from './components/Dashboard/Settings.jsx'

import { AuthContext } from './components/Backend/context/auth-context.js'
import { useAuth } from './components/Backend/hooks/auth-hook.js'

function App() {
  const { token, login, logout, userId, isEmployee, isAdmin, userName } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userName: userName,
        isEmployee: isEmployee,
        isAdmin: isAdmin,
        login: login,
        logout: logout
      }}
    >
      <BrowserRouter>
        <Header />
        <div>
        {token ? (
          <>
          <Sidebar />
          {!isEmployee && !isAdmin && (
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/internships" element={<Internship />} />
              <Route exact path="/jobs" element={<Jobs />} />
              <Route exact path="/chat" element={<Chat />} />
              <Route exact path="/settings" element={<Settings />} />
            </Routes>
          )}
          {isEmployee && !isAdmin && (
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/employee" element={<Employee />} />
              <Route exact path="/projects" element={<Projects />} />
              <Route exact path="/termination" element={<Termination />} />
              <Route exact path="/internships" element={<Internship />} />
              <Route exact path="/jobs" element={<Jobs />} />
              <Route exact path="/chat" element={<Chat />} />
              <Route exact path="/activity" element={<Activity />} />
              <Route exact path="/settings" element={<Settings />} />
            </Routes>
          )}
          {isAdmin && (
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/employee" element={<Employee />} />
              <Route exact path="/projects" element={<Projects />} />
              <Route exact path="/termination" element={<Termination />} />
              <Route exact path="/internships" element={<Internship />} />
              <Route exact path="/jobs" element={<Jobs />} />
              <Route exact path="/chat" element={<Chat />} />
              <Route exact path="/activity" element={<Activity />} />
              <Route exact path="/settings" element={<Settings />} />
            </Routes>
          )}
            
          </>
        ) : (
          // Default routes
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="signup" element={<Signup />} />
          </Routes>
        )}</div> 
        
        <Footer />
      </BrowserRouter>

    </AuthContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode >
    <App />
  </React.StrictMode >
)