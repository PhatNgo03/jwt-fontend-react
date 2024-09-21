import './GroupRole.scss'
import { useState, useEffect } from 'react';
import { fetchGroup } from '../../service/userService';
import { toast } from 'react-toastify';
import { fetchAllRole, fetchRolesByGroup } from '../../service/roleService'
import _ from 'lodash';


const GroupRole = () => {
    const [userGroups, setUserGroups] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [selectGroup, setSelectGroup] = useState("");
    const [assignRolesByGroup, setassignRolesByGroup] = useState([]);
    useEffect(() => {
        getGroups();
        getAllRoles();
    }, [])


    const getGroups = async () => {
        try {
            let res = await fetchGroup();
            if (res && res.EC === 0) {
                setUserGroups(res.DT);

            } else {
                toast.error(res?.EM);
            }
        } catch (error) {
            toast.error('An error occurred while fetching groups');
            console.error('Error fetching groups:', error);
        }
    };

    const getAllRoles = async () => {
        let data = await fetchAllRole();
        if (data && +data.EC === 0) {
            setListRoles(data.DT);
        }
    }

    const handleOnChangeGroup = async (value) => {
        setSelectGroup(value);
        if (value) {
            let data = await fetchRolesByGroup(value);
            if (data && +data.EC === 0) {
                let result = buildDataRoleByGroup(data.DT.Roles, listRoles);
                setassignRolesByGroup(result);
            }
        }
    }

    const buildDataRoleByGroup = (groupRoles, allRoles) => {
        let result = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let object = [];
                object.url = role.url;
                object.id = role.id;
                object.description = role.description;
                object.isAssigned = false;
                if (groupRoles && groupRoles.length > 0) {
                    object.isAssigned = groupRoles.some(item => item.url === object.url)
                }

                result.push(object);
            })
        }
        return result;
    }

    const handleSelectRole = (value) => {
        const _assignRolesByGroup = _.cloneDeep(assignRolesByGroup);
        let foundIndex = _assignRolesByGroup.findIndex(item => +item.id === +value);
        if (foundIndex > -1) {
            _assignRolesByGroup[foundIndex].isAssigned = !_assignRolesByGroup[foundIndex].isAssigned;
        }
        setassignRolesByGroup(_assignRolesByGroup);
    }
    return (
        <div className='group-role-container'>
            <div className='container'>
                <div className='container mt-3'>
                    <h4>Group Role:</h4>
                    <div className='assign-group-role'>
                        <div className='col-12 col-sm-6 form-group my-1'>
                            <label>   Select Group:(<span className='red'>*</span>) :</label>
                            <select
                                className={'form-select'}
                                onChange={(even) => handleOnChangeGroup(even.target.value)}
                            >
                                <option value="">Please select your group</option>
                                {userGroups.length > 0 &&
                                    userGroups.map((item, index) => {
                                        return (
                                            <option key={`group${index}`} value={item.id}>{item.name}</option>
                                        )
                                    })}

                            </select>
                        </div>
                        <div>
                            <hr />
                            {
                                selectGroup &&
                                <div className='roles'>
                                    <h5>Assign Roles:</h5>
                                    {assignRolesByGroup && assignRolesByGroup.length > 0

                                        && assignRolesByGroup.map((item, index) => {
                                            return (
                                                <div className="form-check" key={`list-role-${index}`}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={item.id}
                                                        checked={item.isAssigned}
                                                        id={`list-role-${index}`}
                                                        onChange={(event) => handleSelectRole(event.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`list-role-${index}`}>
                                                        {item.url}
                                                    </label>
                                                </div>
                                            )

                                        })
                                    }
                                </div>
                            }
                            <div className='mt-3'>
                                <button className='btn btn-warning'>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default GroupRole;