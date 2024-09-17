import React, { useState, useEffect } from "react";
import { getUserAccount } from "../service/userService";


const UserContext = React.createContext(null)
const UserProvider = ({ children }) => {

    const [user, setUser] = useState(
        {
            isAuthenticated: false,
            token: "",
            account: {}
        })
    const loginContext = (userData) => {
        setUser(userData)
    };

    const logout = () => {
        setUser((user) => ({
            name: '',
            auth: false,
        }))
    }
    const fetchUser = async () => {
        let response = await getUserAccount();
        if (response && response.EC === 0) {
            let groupWithRoles = response.DT.data;
            let email = response.DT.email;
            let username = response.DT.username;
            let token = response.DT.access_token;
            let data = {
                isAuthenticated: true,
                token: token,
                account: { groupWithRoles, email, username }
            }
            setUser(data);
        }
    }
    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <UserContext.Provider value={{ user, loginContext, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider };