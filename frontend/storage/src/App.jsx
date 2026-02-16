import React, { useState } from 'react'
import DirectoryView from '../DirectoryView'
import { Route, Routes } from 'react-router-dom'
import Maintainance from '../Components/Maintainance';
import Register from '../Components/Register';
import Login from '../Components/Login';

const App = () => {

  
  const serverupdate=true;
  return (
 <Routes>

    <Route path="/*" element={<DirectoryView />} />
    <Route path="/register" element={<Register />} />
    <Route path="/login" element={<Login />} />

    
    {/* <Route path="/*" element={<Maintainance />} /> */}

</Routes>


  );
}

export default App
