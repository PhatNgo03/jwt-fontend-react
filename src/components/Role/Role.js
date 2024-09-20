import './Role.scss'
import { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { createRoles } from '../../service/roleService';
import TableRole from './TableRole';

const Role = (props) => {

    const dataChildDefault = { url: '', description: '', isValidUrl: true };

    const childRef = useRef();
    const [listChilds, setListChilds] = useState({
        child1: dataChildDefault
    });

    useEffect(() => {
        Object.entries(listChilds).map(([key, value]) => (
            console.log(key, value)
        ));
    }, [])

    const handleOnchangeInput = (name, value, key) => {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[key][name] = value;
        setListChilds(_listChilds);

        if (value && name === 'url') {
            _listChilds[key]['isValidUrl'] = true;
        }
    }

    const handleAddNewInput = () => {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[`child-${uuidv4()}`] = dataChildDefault
        setListChilds(_listChilds);
    }

    const handleDeleteInput = (key) => {
        let _listChilds = _.cloneDeep(listChilds);
        delete _listChilds[key];
        setListChilds(_listChilds);

    }


    const buildDataToPersit = () => {
        let _listChilds = _.cloneDeep(listChilds);
        let result = [];
        Object.entries(_listChilds).map(([key, child]) => {
            result.push({
                url: child.url,
                description: child.description
            })
        });
        return result;
    }
    const handleSave = async () => {

        let invalidObj = Object.entries(listChilds).find(([key, child], index) => {
            return child && !child.url;
        })
        if (!invalidObj) {
            let data = buildDataToPersit();
            let res = await createRoles(data);
            if (res && res.EC === 0) {
                toast.success(res.EM)
                childRef.current.fetchListRolesAgain()
            }
        }
        else {
            toast.error("Input URL must not be empty...")
            let _listChilds = _.cloneDeep(listChilds);
            const key = invalidObj[0];
            _listChilds[key]['isValidUrl'] = false;
            setListChilds(_listChilds);
        }
    }



    return (
        <div>
            <div className='role-container'>
                <div className='container'>
                    <div className='adding-roles container'>
                        <div className='my-3'>
                            <div className='title-row'><h4>Add new a role..</h4></div>
                        </div>
                        <div className=' role-parent'>
                            {
                                Object.entries(listChilds).map(([key, child], index) => (
                                    <div className='row row-child' key={`child${key}`}>
                                        <div className={`col-5 form-group ${key}`}>
                                            <label>URL: </label>
                                            <input
                                                type='text'
                                                className={child.isValidUrl ? 'form-control' : 'form-control is-invalid'}
                                                value={child.url}
                                                onChange={(event) => handleOnchangeInput('url', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-5 form-group'>
                                            <label>Description: </label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={child.description}
                                                onChange={(event) => handleOnchangeInput('description', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-2 mt-4 actions'>
                                            <i class="fa fa-plus-circle addRole" onClick={() => handleAddNewInput()}></i>
                                            {index >= 1 &&
                                                <i class="fa fa-trash-o deleteRole" onClick={() => handleDeleteInput(key)}></i>}
                                        </div>
                                    </div>
                                ))
                            }

                            <div>
                                <button className='btn btn-warning mt-3' onClick={() => handleSave()}>Save</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className='mt-3'>
                        <h4>List current Roles</h4>
                        <TableRole ref={childRef} />
                    </div>

                </div>
            </div>
        </div>
    );

}

export default Role;