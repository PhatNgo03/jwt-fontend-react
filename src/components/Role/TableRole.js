import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { fetchAllRole, deleteRole } from '../../service/roleService'
import { toast } from "react-toastify";
const TableRole = forwardRef((props, ref) => {

    const [listRoles, setListRoles] = useState([]);
    useEffect(() => {
        getAllRoles();
    }, [])

    useImperativeHandle(ref, () => ({

        async fetchListRolesAgain() {
            await getAllRoles();
        }
    }));

    const getAllRoles = async () => {
        let data = await fetchAllRole();
        if (data && +data.EC === 0) {
            setListRoles(data.DT);
        }
    }
    const handleDeleteRole = async (role) => {
        let data = await deleteRole(role);
        if (data && +data.EC === 0) {
            toast.success(data.EM);
            await getAllRoles();
        }
    }

    return (<>
        <table className="table table-bordered table-hover">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">URL</th>
                    <th scope="col">Description</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {listRoles && listRoles.length > 0 ?
                    <>
                        {listRoles.map((item, index) => {
                            return (
                                <tr key={`row-${index}`}>
                                    <td>{item.id}</td>
                                    <td>{item.url}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        {/* <span className="btn btn-warning mx-3 edit" title="Edit"
                                            onClick={() => handleEditUser(item)}
                                        ><i className="fa fa-pencil"> Edit </i>
                                        </span> */}
                                        <button className="btn btn-danger delete" title="Delete"
                                            onClick={() => handleDeleteRole(item)}
                                        ><i class="fa fa-trash-o" ></i>  Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </>
                    :
                    <><tr><td colSpan={4} align="center">Not found Roles</td></tr></>
                }
            </tbody>
        </table>
    </>)
})

export default TableRole;