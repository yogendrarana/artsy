import axios from 'axios'
import toast from 'react-hot-toast'

// import css
import './subscribe.css'

// import images
import paintPic from '../../../assets/images/pencils.jpg'
import { useState } from 'react'

const subscribeStyle = {
    backgroundImage: `url(${paintPic})`,
    backgroundSize: 'cover',
    backgroundPosition: "center",
    backgroundRepeat: 'no-repeat',
}

const Subscribe = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async () => {
        if (email === '') return toast.error('Email field cannot be empty!');

        try {
            setIsLoading(true);

            const { data, status } = await axios.post(`/api/v1/subscribe`, { email }, {
                headers: { 'Content-Type': 'application/json' }
            });

            setEmail('');
            setIsLoading(false);

            if (status >= 300) return toast.error(data.message);
            return toast.success(data.message);
        } catch (err) {
            setEmail('');
            setIsLoading(false);
            return toast.error(err.response.data.message);
        }
    }

    return (
        <div className='subscribeContainer' style={subscribeStyle} >
            <form>
                <h2>Subscribe Us</h2>
                <p>Register to our newsletter and get <br /> notified about exciting deals!</p>
                <input type="email" placeholder="youremail@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type='button' disabled={isLoading} onClick={handleSubscribe}>
                    {isLoading ? 'Loading...' : 'Subscribe'}
                </button>
            </form>
        </div>
    )
}

export default Subscribe;