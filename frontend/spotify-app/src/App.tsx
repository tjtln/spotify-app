import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Callback from './pages/Callback';



function App() {

  return (
    <Routes>
        <Route path="/" element={<Dashboard /> } />
        <Route path="/login" element={<Login /> } />
        <Route path="/callback" element={<Callback />} />
    </Routes>
  )
}

export default App
