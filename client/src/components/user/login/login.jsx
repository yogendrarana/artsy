import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

// import redux actions
import { clearError, clearMessage, loginUser } from '../../../redux/slices/authSlice.js'

// import css
import './login.css'

// import component
import Seo from '../../seo/seo.jsx'
import Bubbles from '../../utility/bubbles/bubbles'

const Login = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    const { message, error, isAuthenticated, isLoading } = useSelector(state => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) return toast.warn("Fields cannot be empty!");
        dispatch(loginUser({ email, password, remember }));
    }

    useEffect(() => {
        if (isAuthenticated && message) {
            toast.success(message);
            dispatch(clearMessage());

            // Redirect the user to the checkout page if the 'redirect' query parameter is set.
            const params = new URLSearchParams(location.search);
            const redirect = params.get('redirect');
            if (redirect === 'checkout') {
                navigate('/checkout');
            } else {
                navigate('/');
            }
        }

        if (!isAuthenticated && error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [dispatch, message, error, navigate, isAuthenticated, location.search])

    return (
        <>
            <Seo title='Login Page' description='Page for logging in already registered users.' />

            <div className='loginContainer'>
                <form className="loginForm">
                    <label>
                        <h2>Log In</h2>
                    </label>

                    <label>
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="new-password" required />
                    </label>

                    <label>
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required />
                    </label>

                    <label className='moreOptions'>
                        <div>
                            <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
                            <span>Keep logged in for 30 days.</span>
                        </div>

                        <div className="forgotPassword">
                            <Link to='/password/forget'>Forgot Password?</Link>
                        </div>
                    </label>

                    <button type="submit" onClick={handleSubmit}>{isLoading ? <Bubbles /> : "Submit"}</button>
                </form>
            </div>
        </>
    );
}

export default Login