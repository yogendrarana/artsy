import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


// import components
import { Divider } from '@mui/material';


// import stripe
import { useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from '@stripe/react-stripe-js';


// import redux actions
import { clearCart } from '../../../redux/slices/cartSlice';
import { createOrder, clearError, clearMessage } from '../../../redux/slices/userSlice.js';

// import css
import './payment.css'
import api from '../../../api/api';


const Payment = ({ activeStep, handleStepChange, orderTotal }) => {
    const payBtn = useRef(null)
    const stripe = useStripe();
    const dispatch = useDispatch();
    const elements = useElements();

    // local state
    const [name, setName] = useState('');

    // redux state
    const { cartItems } = useSelector(state => state.cart);
    const { myData, message, error } = useSelector(state => state.user);

    const orderDetail = JSON.parse(localStorage.getItem('orderDetail'));
    const shippingDetail = JSON.parse(localStorage.getItem('shippingDetail'));

    const orderData = {
        shippingDetail,
        orderItems: cartItems,
        orderSubtotal: orderDetail?.orderSubtotal,
        taxPrice: orderDetail?.tax,
        shippingPrice: orderDetail?.shippingCharge,
        orderTotal: orderDetail?.orderTotal
    };

    //payment-handler
    const handlePayment = async () => {
        payBtn.current.disabled = true;
        const toastId = toast.loading('Processing payment...');
        try {
            if (!stripe || !elements) {
                payBtn.current.disabled = false;
                return toast.error('Stripe is not loaded properly. Try again later.', { id: toastId });
            };

            // create payment intent
            const { data } = await api.post('/create-payment-intent', { amount: orderTotal, email: myData?.email }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })

            // confirm the payment on the client
            const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(data.client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: shippingDetail.name,
                        phone: `+977 ${shippingDetail.phone}`,
                        email: shippingDetail.email,
                        address: {
                            state: shippingDetail.province,
                            city: shippingDetail.city,
                            line1: shippingDetail.address,
                        }
                    },
                },
            });


            if (stripeError) {
                payBtn.current.disabled = false;
                return toast.error(stripeError.message, { id: toastId });
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                dispatch(clearCart());
                localStorage.removeItem('cartItems');
                localStorage.removeItem('orderDetail');
                localStorage.removeItem('shippingDetail');

                orderData.paymentDetail = {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                };
            }

            dispatch(createOrder(orderData));
            handleStepChange(activeStep + 1);
            payBtn.current.disabled = false;
            return toast.success('Payment successful!', { id: toastId });
        } catch (error) {
            payBtn.current.disabled = false;
            if (error.response.data.message) {
                return toast.error(error.response.data.message, { id: toastId });
            } else {
                return toast.error(error.message, { id: toastId });
            }
        }
    };

    useEffect(() => {
        if (message) {
            toast.success(message);
            clearMessage();
        }

        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, message]);

    return (
        <div className='paymentContainer'>
            <h2>Payment Detail</h2>

            <form>
                <div>
                    <label>Cardholder&apos;s Name</label>
                    <input type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>
                    <label>Card Number</label>
                    <CardNumberElement className='stripeInputField' />
                </div>

                <div>
                    <label>Expiration</label>
                    <CardExpiryElement className='stripeInputField' />
                </div>

                <div>
                    <label>Security Code</label>
                    <CardCvcElement className='stripeInputField' />
                </div>
            </form>

            <Divider className="divider">
                <button onClick={() => handleStepChange(activeStep - 1)}>Back</button>
                <button onClick={handlePayment} ref={payBtn} disabled={!stripe || !name}>Pay</button>
            </Divider>
        </div>
    )
}

export default Payment;