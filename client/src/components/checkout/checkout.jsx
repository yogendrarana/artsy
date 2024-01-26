import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';


// import css
import './checkout.css'


// import components
import Seo from '../seo/seo';
import Finish from './finish/finish';
import Payment from './payment/payment'
import Shipping from './shipping/shipping';


// import image
import bannerImg from '../../assets/images/banner.jpg'


const Checkout = () => {
    const finishRef = useRef(null);
    const paymentRef = useRef(null);
    const shippingRef = useRef(null);

    // local state
    const [activeStep, setActiveStep] = useState(0);
    const { cartItems } = useSelector(state => state.cart);


    //grand-total
    const orderSubtotal = cartItems.reduce((accumulator, item) => accumulator + item.price, 0);
    const shippingCharge = orderSubtotal > 1000 ? 0 : 100;
    const tax = Math.round(orderSubtotal * 0.18);
    const orderTotal = orderSubtotal + shippingCharge + tax;
    const orderData = { orderSubtotal, shippingCharge, tax, orderTotal }


    function handleStepChange(step) {
        setActiveStep(step);
        if (step === 1 && paymentRef.current) {
            paymentRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (step === 0 && shippingRef.current) {
            shippingRef.current.scrollIntoView({ behavior: 'smooth' });
        } else if (step === 2 && finishRef && finishRef.current) {
            finishRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <>
            <Seo title='Checkout Page' description="Page where you can make payment." />
            <div className='checkoutContainer'>
                <div className="checkoutBanner" style={{
                    backgroundImage: `url(${bannerImg})`,
                    backgroundPosition: 'center', backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <h2>Checkout</h2>
                    <div>
                        <Link to='/'>Home</Link>
                        <span>.</span>
                        <span>Checkout</span>
                    </div>
                </div>

                <div className="forms">
                    <div className={activeStep === 0 ? "step" : "step disabled"} ref={shippingRef}>
                        <Shipping activeStep={activeStep} handleStepChange={handleStepChange} orderData={orderData} />
                    </div>

                    <div className={activeStep === 1 ? "step" : "step disabled"} ref={paymentRef}>
                        <Payment activeStep={activeStep} handleStepChange={handleStepChange} orderTotal={orderTotal} />
                    </div>

                    <div className={activeStep === 2 ? "step" : "step disabled"} ref={finishRef}>
                        {/* {activeStep === 2 && */}

                        <Finish activeStep={activeStep} handleStepChange={handleStepChange} />
                        {/* } */}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Checkout;