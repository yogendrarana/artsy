import toast from 'react-hot-toast'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


// import redux actions
import { registerUser, clearError, clearMessage } from '../../../redux/slices/authSlice.js';


// import components
import Seo from '../../seo/seo';
import Bubbles from '../../utility/bubbles/bubbles';


// import css
import './register.css'


const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // redux state
    const { isLoading } = useSelector(state => state.auth)
    const { message, error, isAuthenticated } = useSelector(state => state.auth)

    // use state
    const [isCreator, setIsCreator] = useState(false);
    const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

    // handle change
    const handleChange = (e) => {
        return setData({ ...data, [e.target.name]: e.target.value })
    };

    // handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.name || !data.email || !data.password || !data.confirmPassword) {
            return toast.error("Fields cannot be empty!");
        }

        if (data.password !== data.confirmPassword) {
            return toast.error("Password do not match!");
        }

        dispatch(registerUser({ ...data, isCreator }));
    };

    useEffect(() => {
        if (isAuthenticated && message) {
            toast.success(message);
            dispatch(clearMessage());
            navigate('/');
        }

        if (!isAuthenticated && error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [dispatch, navigate, message, error, isAuthenticated]);

    return (
        <>
            <Seo title="Register Page" description="Page for data registration." />
            <div className='registerContainer'>
                <form className="registerForm">
                    <label>
                        <h2>Register</h2>
                    </label>

                    <label>
                        <input type="text" name="name" value={data.name} placeholder='Name' autoComplete="new-password" onChange={handleChange} required />
                    </label>

                    <label>
                        <input type="email" name="email" value={data.email} placeholder="Email" autoComplete="new-password" onChange={handleChange} required />
                    </label>

                    <label>
                        <input type="password" name="password" value={data.password} placeholder="Create Password" autoComplete="new-password" onChange={handleChange} required />
                    </label>

                    <label>
                        <input type="password" name="confirmPassword" value={data.confirmPassword} placeholder="Confirm Password" autoComplete="new-password" onChange={handleChange} required />
                    </label>

                    <label>
                        <div className='isCreator'>
                            <input type="checkbox" checked={isCreator} onChange={() => setIsCreator(!isCreator)} />
                            <span>Register as creator?</span>
                        </div>
                    </label>

                    <button type="button" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? <Bubbles /> : "Submit"}
                    </button>
                </form>
            </div>
        </>
    );
}

export default Register;