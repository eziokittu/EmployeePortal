import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, RouterProvider, createBrowserRouter, Routes, Route } from 'react-router-dom'
// import App from './App.jsx'
import './index.css'
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from './components/Login/Login.jsx';
import Signup from './components/Signin/Signup.jsx';
import Layout from './Layout.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Employee from './components/Dashboard/Employee.jsx';
import EmployeeDetails from './components/Dashboard/EmployeeDetails.jsx';
import Projects from './components/Dashboard/Projects.jsx';
import MyProjects from './components/Dashboard/MyProjects.jsx';
import ProjectDetails from './components/Dashboard/ProjectDetails.jsx';
import Termination from './components/Dashboard/Termination.jsx';
import Internship from './components/Dashboard/Internship.jsx';
import Jobs from './components/Dashboard/Jobs.jsx';
import CreateOffer from './components/Dashboard/CreateOffer.jsx';
import EditJob from './components/Dashboard/EditJob.jsx';
import ContactForm from './components/Dashboard/ContactForm.jsx';
import Certificates from './components/Dashboard/Certificates.jsx';
import Others from './components/Dashboard/Others.jsx';
import Activity from './components/Dashboard/Activity.jsx';
// import Settings from './components/Dashboard/Settings.jsx';
import AccountSetting from './components/Dashboard/AccountSetting.jsx';
import EditProfile from './components/Dashboard/EditProfile.jsx';
import ChangePassword from './components/Dashboard/ChangePassword.jsx';
import DeleteAccount from './components/Dashboard/DeleteAccount.jsx';
import Applynow from './components/Dashboard/Applynow.jsx';
import Applications from './components/Dashboard/Applications.jsx';
import Error from './components/Error/Error.jsx';

import { AuthContext } from './components/Backend/context/auth-context.js'
import { useAuth } from './components/Backend/hooks/auth-hook.js'

function App() {
  const { 
    token, 
    login, 
    logout, 
    userId, 
    isEmployee, 
    isAdmin, 
    userName,
    firstname,
    lastname,
    email,
    phone,
    bio,
    role,
    image,
    updateUser
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userName: userName,
        isEmployee: isEmployee,
        isAdmin: isAdmin,

        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        bio: bio,
        role: role,
        image: image,

        login: login,
        logout: logout,
        updateUser: updateUser
      }}
    >
      <BrowserRouter>
        <Header />
        <div>
        {/* If Authorized user */}
        {token ? (
          <>
          <Sidebar />
          {/* Default USER */}
          {!isEmployee && !isAdmin && (
            <Routes>
              <Route path="*" element={<Error isFullPage={false} />} />
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/apply/:oid" element={<Applynow />} />
              <Route exact path="/internships" element={<Internship />} />
              <Route exact path="/jobs" element={<Jobs />} />
              <Route exact path="/contact" element={<ContactForm />} />
              <Route exact path="/edit-profile" element={<EditProfile />} />
              <Route exact path="/account-settings" element={<AccountSetting />} />
              <Route exact path="/change-password" element={<ChangePassword />} />
              <Route exact path="/delete-account" element={<DeleteAccount />} />
              <Route exact path="/certificates" element={<Certificates />} />
            </Routes>
          )}
          {/* Employee as USER */}
          {isEmployee && !isAdmin && (
            <Routes>
              <Route path="*" element={<Error isFullPage={false} />} />
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/projects" element={<MyProjects />} />
              <Route exact path="/project-details/:pid" element={<ProjectDetails />} />
              <Route exact path="/termination" element={<Termination />} />
              <Route exact path="/internships" element={<Internship />} />
              <Route exact path="/employee-details" element={<EmployeeDetails />} />
              <Route exact path="/jobs" element={<Jobs />} />
              <Route exact path="/apply/:oid" element={<Applynow />} />
              <Route exact path="/contact" element={<ContactForm />} />
              <Route exact path="/certificates" element={<Certificates />} />
              <Route exact path="/edit-profile" element={<EditProfile />} />
              <Route exact path="/account-settings" element={<AccountSetting />} />
              <Route exact path="/change-password" element={<ChangePassword />} />
              <Route exact path="/delete-account" element={<DeleteAccount />} />
            </Routes>
          )}
          {/* ADMIN as USER */}
          {isAdmin && (
            <Routes>
              <Route path="*" element={<Error isFullPage={false} />} />
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/dashboard" element={<Dashboard />} />
              <Route exact path="/employee" element={<Employee />} />
              <Route exact path="/projects" element={<Projects />} />
              <Route exact path="/:uid/projects" element={<MyProjects />} />
              <Route exact path="/project-details/:pid" element={<ProjectDetails />} />
              <Route exact path="/termination" element={<Termination />} />
              <Route exact path="/internships" element={<Internship />} />
              <Route exact path="/jobs" element={<Jobs />} />
              <Route exact path="/create-offer" element={<CreateOffer />} />
              <Route exact path="/editoffer/:oid" element={<EditJob />} />
              <Route exact path="/applications/:oid" element={<Applications />} />
              <Route exact path="/certificates" element={<Certificates />} />
              <Route exact path="/others" element={<Others />} />
            </Routes>
          )}
            
          </>
        ) : (
          // If not authorized user
          <Routes>
            <Route path="*" element={<Error isFullPage={true} />} />
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