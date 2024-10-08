import { useEffect, useState, useContext } from 'react';
import './Login.scss'
import { useHistory, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { loginUser } from '../../service/userService';
import { UserContext } from '../../context/UserContext';


const Login = (props) => {
    const { user, loginContext } = useContext(UserContext);
    let history = useHistory();

    const [valueLogin, setValueLogin] = useState("");
    const [password, setValuePassword] = useState("");

    //check validation
    const defaultobjValidInput = {
        isValidValueLogin: true,
        isValidValuePassword: true,
    }

    const [objValidInputLogin, setobjValidInputLogin] = useState(defaultobjValidInput);
    const handleCreateNewAccount = () => {
        history.push("/register");
    }
    const handleLogin = async () => {
        setobjValidInputLogin(defaultobjValidInput);

        if (!valueLogin) {
            setobjValidInputLogin({ ...defaultobjValidInput, isValidValueLogin: false });
            toast.error("Please enter your email address or phone number");
            return;
        }
        if (!password) {
            setobjValidInputLogin({ ...defaultobjValidInput, isValidValuePassword: false });
            toast.error("Please enter your password");
            return;
        }
        let response = await loginUser(valueLogin, password);
        if (response && +response.EC === 0) {
            //success
            let groupWithRoles = response.DT.data;
            let email = response.DT.email;
            let username = response.DT.username;
            let token = response.DT.access_token;
            let data = {
                isAuthenticated: true,
                token: token,
                account: { groupWithRoles, email, username }
            }
            localStorage.setItem('jwt', token)
            loginContext(data);
            history.push('/users');
            // window.location.reload();
        }
        if (response && +response.EC !== 0) {
            //erorr
            toast.error(response.EM);
        }
    }

    const handlePressEnter = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            handleLogin();
        }
    }
    useEffect(() => {
        if (user && user.isAuthenticated) {
            history.push('/');
        }
    }, [])


    return (
        <div className="login-container ">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className='brand'>
                            <Link to='/'><span title='Return to HomePage'>Hoang Phat</span></Link>
                        </div>
                        <div className='detail'>
                            HoangPhat helps you connect and share with people in your live
                        </div>
                    </div>
                    <div className="content-right col-sm-5 col-12  d-flex flex-column gap-3 py-3 ">
                        <div className='brand d-sm-none'>
                            Hoang Phat
                        </div>
                        <input
                            type="text"
                            className={objValidInputLogin.isValidValueLogin ? 'form-control' : 'is-invalid form-control'}
                            placeholder='Email address or phone number'
                            value={valueLogin}
                            onChange={(event) => { setValueLogin(event.target.value) }}
                        />
                        <input
                            type="password"
                            className={objValidInputLogin.isValidValuePassword ? 'form-control' : 'is-invalid form-control'}
                            placeholder='Password'
                            value={password}
                            onChange={(event) => { setValuePassword(event.target.value) }}
                            onKeyUp={(event) => handlePressEnter(event)}
                        />
                        <button className='btn btn-primary' onClick={() => handleLogin()}>Login</button>
                        <span
                            className='text-center'>
                            <a className='forgot-password' href='#' >
                                Forgot your password?
                            </a>
                        </span>
                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleCreateNewAccount()}>
                                Create new Account
                            </button>
                            <div className='mt-3 return'>
                                <Link to='/'>
                                    <i className='fa fa-arrow-circle-left'></i>
                                    <span title='Return to HomePage'>Return to HomePage</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;