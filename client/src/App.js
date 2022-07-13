//Import React and pages components - Home, Project, Login etc, also import react-router-dom and use it to render the components
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CreateProject from './pages/CreateProject';
import Project from './pages/Project'

import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import E404 from './pages/E404';
import ForgotPassword from './pages/ForgotPassword';
import EditProject from './pages/EditProject';
import ProtectedRoute from './services/ProtectedRoute';
import EditProfile from './pages/EditProfile';
import ResetPassword from './pages/ResetPassword';
import Test from './pages/Test';
import ContinueSignup from './pages/ContinueSignup';
import Search from './pages/Search';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={ <Signup />} />
        <Route path="/login" element={ <Login />} />
        <Route path='/search' element={ <Search />} />
        <Route path="/projects/submit" element={ <CreateProject />} />
        <Route path="/projects/:id" element={ <Project />} />
        <Route path="/editProject/:id" element={<EditProject />} />
        <Route path="/forgotPassword" element={ <ForgotPassword />} />
        {/* <Route path="/editProfile/:id" element={ getCurrentUser() ? <EditProfile /> : <Navigate to="/login" /> } /> */}
        <Route path="/editProfile/:id" element={ <ProtectedRoute Component={EditProfile} />} />
        <Route path="/resetPassword/:id" element={<ResetPassword />} />
        <Route path="/continueSignup/:id" element={ <ContinueSignup />} />

        <Route path="/test" element={<Test />} />
        <Route path="*" element={ <E404 />} status={404}/>
     </Routes>
    </Router>
    
  );
}

export default App;

// <Route path="*" render={() => <div className="text-center p-5"><h1>OOPs you're lost</h1></div>} /> */}
// The code above is a: Catch all element, if the entered element/url doesn't exist 