import './App.scss';
import Nav from './components/Navigation/Nav';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';

import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {

  return (
    <>
      <Router>
        <div className='app-header'>
          <Nav />
        </div>
        <div className='app-container'>
          <AppRoutes />
        </div>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      ></ToastContainer>
    </>
  );
}

export default App;
