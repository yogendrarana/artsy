import moment from 'moment';
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';


// import css
import './userList.css'


// import redux actions
import { deleteUser, getUsers, clearError, clearMessage } from '../../../redux/slices/adminSlice.js';


const UserList = () => {
    const dispatch = useDispatch();

    // local state
    const [keyword, setKeyword] = useState('');
    const [users, setUsers] = useState();
    
    // redux state
    const { allUsers, message, error } = useSelector(state => state.admin);

    const handleDeleteUser = (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete the user? This action cannot be undone.");
        if (confirmDelete) {
            dispatch(deleteUser(userId));
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        }
    }

    useEffect(() => {
        dispatch(getUsers({ keyword }))
    }, [dispatch, keyword]);


    useEffect(() => {
        if (allUsers) {
            setUsers(allUsers);
        }
    }, [allUsers])


    useEffect(() => {
        if (message) {
            toast.success(message);
            dispatch(clearMessage());
        }

        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [message, error, dispatch])



    return (
        <div className='userList'>
            <header>
                <div className='search'>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type='text' placeholder='Search...' value={keyword} onChange={e => setKeyword(e.target.value)} />
                </div>
            </header>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users[0] && users.map((user, index) => {
                            return (
                                <tr key={index}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{moment(user.joinedAt).format('YYYY-MM-DD')}</td>
                                    <td><i className="fa-solid fa-trash-can" onClick={() => handleDeleteUser(user._id)}></i></td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>

            {(!users || !users[0]) && <div className='noUsers'>No users!</div>}
        </div>
    )
}

export default UserList