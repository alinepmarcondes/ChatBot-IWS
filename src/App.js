import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Login/Login';
import Chat from './components/Chat/Chat';
import Historic from './components/Historic/Historic';
import ProfilePage from './components/ProfilePage/ProfilePage';
import Manual from './components/Manual/Manual';
import NewUser from './components/NewUser/NewUser';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile-page" element={<ProfilePage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/historic" element={<Historic />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/newuser" element={<NewUser />} />
      </Routes>
    </Router>
  );
}

export default App;
