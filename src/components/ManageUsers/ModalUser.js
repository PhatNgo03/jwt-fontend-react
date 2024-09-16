import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { fetchGroup, createNewUser, updateCurrentUser } from '../../service/userService';
import { toast } from 'react-toastify';
import _ from "lodash";
const ModalUser = (props) => {
    const { action, dataModalUser } = props;
    const [userGroups, setUserGroups] = useState([]);

    const defaultUserData = {
        email: '',
        phone: '',
        username: '',
        password: '',
        address: '',
        sex: '',
        group: '',
    }
    const validInputsDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        address: true,
        sex: true,
        group: true,
    }
    const [validInputs, setValidInputs] = useState(validInputsDefault);
    const [userData, setUserData] = useState(defaultUserData);
    useEffect(() => {
        getGroups();

    }, [])

    useEffect(() => {
        if (action === 'UPDATE') {
            setUserData({ ...dataModalUser, group: dataModalUser.Group ? dataModalUser.Group.id : '' });
        }
    }, [dataModalUser])

    useEffect(() => {
        if (action === "CREATE") {
            if (userGroups && userGroups.length > 0) {
                setUserData({ ...userData, group: userGroups[0].id })
            }
        }
    }, [action])
    const handleOnchangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    }

    // const checkValidateInputs = () => {
    //     //create user 
    //     if (action === 'UPDATE') return true;
    //     setValidInputs(validInputsDefault);
    //     let arr = ['email', 'phone', 'password', 'group'];
    //     let check = true;
    //     for (let i = 0; i < arr.length; i++) {
    //         if (!userData[arr[i]]) {
    //             let _validInputs = _.cloneDeep(validInputsDefault);
    //             _validInputs[arr[i]] = false;
    //             setValidInputs(_validInputs);

    //             toast.error(`Empty input ${arr[i]}`);
    //             check = false;
    //             break;
    //         }
    //     }
    //     return check;
    // }

    const checkValidateInputs = () => {

        if (action === 'UPDATE') return true;
        setValidInputs(validInputsDefault);
        // Validate email
        if (!userData.email) {
            setValidInputs(prev => ({ ...prev, email: false }));
            toast.error('Empty input email');
            return false; // Stop further validation
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            setValidInputs(prev => ({ ...prev, email: false }));
            toast.error('Invalid email format');
            return false; // Stop further validation
        }

        // Validate phone number
        if (!userData.phone) {
            setValidInputs(prev => ({ ...prev, phone: false }));
            toast.error('Empty input phone');
            return false; // Stop further validation
        }
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(userData.phone)) {
            setValidInputs(prev => ({ ...prev, phone: false }));
            toast.error('Phone number must be 10 digits');
            return false; // Stop further validation
        }

        // Validate password
        if (!userData.password) {
            setValidInputs(prev => ({ ...prev, password: false }));
            toast.error('Empty input password');
            return false; // Stop further validation
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        if (!passwordRegex.test(userData.password)) {
            setValidInputs(prev => ({ ...prev, password: false }));
            toast.error('Password must be at least 6 characters, include uppercase and lowercase letters');
            return false; // Stop further validation
        }

        // Validate group
        if (!userData.group) {
            setValidInputs(prev => ({ ...prev, group: false }));
            toast.error('Empty input group');
            return false; // Stop further validation
        }

        return true; // Validation passed
    }


    // const getGroups = async () => {
    //     let res = await fetchGroup();
    //     if (res && res.EC === 0) {
    //         setUserGroups(res.DT);
    //         if (res.DT && res.DT.length > 0) {
    //             let groups = res.DT;
    //             setUserData({ ...userData, group: groups[0].id })
    //         }
    //     } else {
    //         toast.error(res.EM);
    //     }
    // }
    const getGroups = async () => {
        try {
            let res = await fetchGroup();
            if (res && res.EC === 0) {
                setUserGroups(res.DT);
                if (res.DT && res.DT.length > 0) {
                    let groups = res.DT;
                    setUserData({ ...userData, group: groups[0].id });
                }
            } else {
                toast.error(res?.EM);
            }
        } catch (error) {
            toast.error('An error occurred while fetching groups');
            console.error('Error fetching groups:', error);
        }
    };



    const handleConfirmUser = async () => {
        let check = checkValidateInputs();
        if (check === true) {

            let res = action === 'CREATE' ?
                await createNewUser({ ...userData, groupId: userData['group'] })
                : await updateCurrentUser({ ...userData, groupId: userData['group'] })
            if (res && res.EC === 0) {
                toast.success(res.EM || "User created successfully!");
                props.onHide();
                setUserData({
                    ...defaultUserData,
                    group: userGroups && userGroups.length > 0 ? userGroups[0].id : ''
                })
            } else if (res && res.EC !== 0) {
                toast.error(res.EM || "Failed to create user!");
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[res.DT] = false;
                setValidInputs(_validInputs);
            }
        }
    }
    const handleCloseModalUser = () => {
        props.onHide();
        setUserData(defaultUserData);
        setValidInputs(validInputsDefault);
    }
    return (
        <>
            <Modal size="lg" show={props.show} className='modal-user' onHide={() => handleCloseModalUser()}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>{props.action === 'CREATE' ? 'Create new user' : 'Edit a user '}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group my-1'>
                            <label>Email address (<span className='red'>*</span>) :</label>
                            <input
                                disabled={action === 'CREATE' ? false : true} className={validInputs.email ? 'form-control' : 'form-control is-invalid'}
                                type="email" value={userData.email}
                                onChange={(event) => handleOnchangeInput(event.target.value, "email")} />
                        </div>
                        <div className='col-12 col-sm-6 form-group my-1'>
                            <label>Phone Number (<span className='red'>*</span>) :</label>
                            <input
                                disabled={action === 'CREATE' ? false : true} className={validInputs.phone ? 'form-control' : 'form-control is-invalid'}
                                type="text" value={userData.phone}
                                onChange={(event) => handleOnchangeInput(event.target.value, "phone")} />
                        </div>
                        <div className='col-12 col-sm-6 form-group my-1'>
                            <label>User name : (<span className='red'>*</span>) :</label>
                            <input className='form-control' type="text" value={userData.username}
                                onChange={(event) => handleOnchangeInput(event.target.value, "username")} />
                        </div>


                        <div className='col-12 col-sm-6 form-group my-1'>
                            {
                                action === 'CREATE'
                                &&
                                <>
                                    <label>Password (<span className='red'>*</span>) :</label>
                                    <input
                                        className={validInputs.password ? 'form-control' : 'form-control is-invalid'}
                                        type="password" value={userData.password}
                                        onChange={(event) => handleOnchangeInput(event.target.value, "password")} />
                                </>
                            }
                        </div>


                        <div className='col-12 col-sm-12 form-group my-1'>
                            <label>Address :</label>
                            <input className='form-control' type="text" value={userData.address}
                                onChange={(event) => handleOnchangeInput(event.target.value, "address")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group my-1'>
                            <label>Gender :</label>
                            <select
                                className='form-select'
                                onChange={(event) => handleOnchangeInput(event.target.value, "sex")}
                                value={userData.sex}
                            >
                                <option defaultValue="Male" value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group my-1'>
                            <label>Group (<span className='red'>*</span>) :</label>
                            <select
                                className={validInputs.group ? 'form-select' : 'form-select is-invalid'}
                                onChange={(event) => handleOnchangeInput(event.target.value, "group")}
                                value={userData.group}
                            >
                                {userGroups.length > 0 &&
                                    userGroups.map((item, index) => {
                                        return (
                                            <option key={`group${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })}

                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalUser()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleConfirmUser()}>
                        {action === 'CREATE' ? 'Save' : 'Update'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalUser;