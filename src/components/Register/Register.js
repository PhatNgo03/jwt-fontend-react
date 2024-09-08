import { useEffect, useState } from 'react';
import './Register.scss'
import { useHistory } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from 'axios';
import { registerNewUser } from '../../service/userService';

const Register = (props) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");

    const defaultValidInput = {
        isValidEmail: true,
        isValidPhone: true,
        isValidPassword: true,
        isValidConfirmPassword: true,
    }
    const [objCheckInput, setobjCheckInput] = useState(defaultValidInput);

    let history = useHistory();
    const handleLogin = () => {
        history.push("/login");
    }

    useEffect(() => {
        // axios.get("http://localhost:8080/api/v1/test-api").then(data => {
        //     console.log(">> Check data axios: ", data);
        // });


    }, []);
    const isValidInputs = () => {
        setobjCheckInput(defaultValidInput);

        if (!email) {
            toast.error("Email is required!");
            console.log(">>> Check org: ", { ...defaultValidInput });
            console.log(">>> ", { ...defaultValidInput, isValidEmail: false })
            setobjCheckInput({ ...defaultValidInput, isValidEmail: false })
            return false;
        }
        let rex = /\S+@\S+\.\S+/;
        if (!rex.test(email)) {
            toast.error("Please enter a valid email address");

            setobjCheckInput({ ...defaultValidInput, isValidEmail: false })
            return false;
        }
        if (!phone) {
            toast.error("Phone is required!");
            setobjCheckInput({ ...defaultValidInput, isValidPhone: false })
            return false;
        }
        if (!username) {
            toast.error("User name is required!");
            return false;
        }
        if (!password) {
            toast.error("Password is required!");
            setobjCheckInput({ ...defaultValidInput, isValidPassword: false })
            return false;
        }
        if (confirmPassword != password) {
            toast.error("Confirm Password invalid");
            setobjCheckInput({ ...defaultValidInput, isValidConfirmPassword: false })
        }

        return true;
    }
    const handleRegister = async () => {
        let check = isValidInputs();
        if (check === true) {
            try {
                let response = await registerNewUser(email, phone, username, password);
                let serverData = response.data;

                if (+serverData.EC === 0) {
                    toast.success(serverData.EM);
                    history.push("/login");
                } else if (+serverData.EC === 1) {
                    // Server-side validation errors
                    if (serverData.EM.includes("email")) {
                        setobjCheckInput({ ...defaultValidInput, isValidEmail: false });
                        toast.error("This email already exists.");
                    }
                    if (serverData.EM.includes("phone")) {
                        setobjCheckInput({ ...defaultValidInput, isValidPhone: false });
                        toast.error("This phone number already exists.");
                    }
                } else {
                    toast.error(serverData.EM);
                }
            }
            catch (error) {
                console.log("Error in registration:", error);
                toast.error("An error occurred during registration. Please try again.");
            }
            // let response = await registerNewUser(email, phone, username, password);
            // let serverData = response.data;
            // if (+serverData.EC === 0) {
            //     toast.success(serverData.EM);
            //     history.push("/login");
            // } else {
            //     toast.error(serverData.EM);
            // }
        }
    }

    return (
        <div className="register-container ">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className='brand '>
                            Hoang Phat
                        </div>
                        <div className='detail'>
                            HoangPhat helps you connect and share with people in your live
                        </div>
                    </div>
                    <div className="content-right col-sm-5 col-12  d-flex flex-column gap-3 py-3 ">
                        <div className='brand d-sm-none'>
                            Hoang Phat
                        </div>
                        <div className='form-group'>
                            <label className='label-email mb-1'>Email:</label>
                            <input type="text" className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'} placeholder='Email address'
                                value={email} onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-phone mb-1'>Phone number:</label>
                            <input type="text" className={objCheckInput.isValidPhone ? 'form-control' : 'form-control is-invalid'} placeholder='Phone number'
                                value={phone} onChange={(event) => setPhone(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-phone mb-1'>User name:</label>
                            <input type="text" className='form-control' placeholder='User name'
                                value={username} onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-password pb-1'>Password:</label>
                            <input type="password" className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Password'
                                value={password} onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label className='label-password pb-1'> Re-enter Password:</label>
                            <input type="password" className={objCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'} placeholder='Re-enter password'
                                value={confirmPassword} onChange={(event) => setconfirmPassword(event.target.value)}
                            />
                        </div>
                        <button className='btn btn-primary' onClick={() => handleRegister()}>Register</button>

                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleLogin()}>
                                Already've an Account. Login
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Register;