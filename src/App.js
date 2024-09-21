import './App.scss';
import NavHeader from './components/Navigation/NavHeader';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';

import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState, useContext } from 'react';
import AppRoutes from './routes/AppRoutes';
import { Puff } from 'react-loader-spinner'
import { UserContext } from "./context/UserContext";
import { Scrollbars } from 'react-custom-scrollbars-2';
const App = () => {
  const { user } = useContext(UserContext);
  const [scrollHeight, setScrollHight] = useState(0);

  useEffect(() => {
    let windowHeight = window.innerHeight;
    setScrollHight(windowHeight);
  }, [user])

  return (

    <Scrollbars autoHeightMin="100vh" autoHeight>
      <Router>
        {user && user.isLoading ?
          <div className='loading-container'>
            <Puff
              visible={true}
              height="80"
              width="80"
              color="#1877f2"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
            <div>Loading data... </div>
          </div>

          :
          <>
            <div className='app-header'>
              <NavHeader />
            </div>
            <div className='app-container'>
              <AppRoutes />
            </div>
          </>
        }

      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      ></ToastContainer>
    </Scrollbars>
  );
}

export default App;
