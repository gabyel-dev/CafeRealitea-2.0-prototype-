import { useState } from 'react';
import MainLayout from './Main/MainLayout';
import LoginPage from './routes/login/Login';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<MainLayout />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
