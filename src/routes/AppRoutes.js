import {
    Switch,
    Route,
    Link,
} from "react-router-dom";
import Login from '../components/Login/Login';
import Users from '../components/ManageUsers/Users';
import Register from '../components/Register/Register';
import PrivateRoutes from "./PrivateRoures";


const AppRoutes = (props) => {

    const Project = () => {
        return (
            <span>projects</span>
        )
    }
    return (
        <>
            <Switch>
                {/* <Route path="/project">
                    project
                </Route>
                */}

                <PrivateRoutes path="/users" component={Users} />
                <PrivateRoutes path="/projects" component={Project} />

                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/register">
                    <Register />
                </Route>
                <Route path="/" exact>
                    Home
                </Route>
                <Route path="*">404 not found</Route>
            </Switch>
        </>
    )
}
export default AppRoutes;