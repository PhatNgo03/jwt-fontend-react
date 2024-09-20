import React, { useEffect, useState, useContext } from 'react';
import './Nav.scss';
import { Link, NavLink, useLocation, useHistory } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { logoutUser } from '../../service/userService';
import { toast } from 'react-toastify';
const NavHeader = (props) => {
    const { user, logoutContext } = useContext(UserContext);
    const location = useLocation();
    const history = useHistory();

    const handleLogout = async () => {
        let data = await logoutUser(); //clear cookie
        localStorage.removeItem('jwt'); //clear local storage
        logoutContext(); // clear user in context

        if (data && +data.EC === 0) {
            toast.success("Logout success");
            history.push('/login');
        } else {
            toast.error("Logout fail");
        }
    }

    if (user && user.isAuthenticated === true || location.pathname === '/') {
        return (
            <>
                {/* //     <div className="topnav">
            //         <NavLink to="/" exact>Home</NavLink>
            //         <NavLink to="/users">Users</NavLink>
            //         <NavLink to="/project">Projects</NavLink>
            //         <NavLink to="/about">About</NavLink>
            //     </div> */}
                <div className='nav-header'>

                    <Navbar bg='header' expand='lg' className="bg-body-tertiary">
                        <Container>
                            <Navbar.Brand href="#home">
                                <img
                                    src="/logo192.png"
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top logo-img"
                                // alt="React Bootstrap logo"
                                />
                                <span className='brand-name' >React </span>
                            </Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="me-auto">
                                    <NavLink to="/" exact className="nav-link">Home</NavLink>
                                    <NavLink to="/users" className="nav-link">Users</NavLink>
                                    <NavLink to="/roles" className="nav-link">Roles</NavLink>
                                    <NavLink to="/project" className="nav-link">Projects</NavLink>
                                    <NavLink to="/about" className="nav-link">About</NavLink>

                                </Nav>
                                <Nav>
                                    {
                                        user && user.isAuthenticated === true
                                            ?
                                            <>

                                                <Nav.Link className='nav-link' href="#deets">Wellcome {user.account.username}</Nav.Link>
                                                <NavDropdown title="Settings" id="basic-nav-dropdown">
                                                    <NavDropdown.Item >Change Password</NavDropdown.Item>
                                                    <NavDropdown.Divider />
                                                    <NavDropdown.Item onClick={() => handleLogout()}>
                                                        Logout
                                                    </NavDropdown.Item>

                                                </NavDropdown>
                                            </>
                                            :
                                            <Link className='nav-link' to='/login'>
                                                Login </Link>
                                    }


                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>

                </div>

            </>
        );
    } else {
        return <>
        </>
    }


}

export default NavHeader;
