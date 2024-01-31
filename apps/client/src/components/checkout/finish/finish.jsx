import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

//importing css
import './finish.css'

//importing components
import Seo from '../../seo/seo'
import { Divider } from '@mui/material'


const Finish = () => {
    const navigate = useNavigate();
    const { myData } = useSelector(state => state.user);

    const handleFinish = () => {
        toast.success('Order placed successfully.')
        navigate('/');
    }

    return (
        <>
            <Seo title='Checkout - finish' description='Checkout page for finishing order.' />

            <div className="finishContainer">
                <div className="finish">
                    <i className="fa fa-check"></i>
                    <p>Hey {myData?.name}, your order has been successfully placed.</p>
                    <p>We will send you shipping confirmation email as soon as your order ships.</p>
                </div>

                <Divider className='divider'>
                    <button onClick={handleFinish}>Finish</button>
                </Divider>
            </div>

        </>
    );
}

export default Finish;