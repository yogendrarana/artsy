import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

// import redux actions
import { deleteFromCart } from '../../redux/slices/cartSlice.js'

// import css
import './cart.css'

export default function Cart({ toggleDrawer }) {
    const dispatch = useDispatch();

    // redux states
    const { cartItems } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    const orderSubtotal = cartItems.reduce((accumulator, item) => accumulator + item.price, 0);

    return (
        <>
            <div className="cartContainer">
                <header>
                    <h2>Your Cart</h2>
                    <i className="fa-solid fa-xmark" onClick={toggleDrawer('right', false)}></i>
                </header>

                <ul>
                    {cartItems[0] && cartItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <img src={item?.images[0].url} alt='artPic' />
                                <div>
                                    <p>{item?.name}</p>
                                    <p>Rs {item?.price}</p>
                                </div>
                                <i className="fa-regular fa-trash-can" onClick={() => dispatch(deleteFromCart(item))}></i>
                            </li>
                        )
                    })}

                    {
                        !cartItems[0] && <div className='noCartItem'>No cart items yet!</div>
                    }
                </ul>

                <div className='cartFooter'>
                    <div>
                        <p>Shipping</p>
                        <strong>{orderSubtotal <= 1000 ? `Rs 100` : 'Free Shipping'}</strong>
                    </div>

                    <div>
                        <p>Total</p>
                        <strong>Rs {orderSubtotal}</strong>
                    </div>

                    {cartItems.length === 0 ?
                        <Link to="/" onClick={toggleDrawer('right', false)}>Shop More</Link> :
                        (isAuthenticated ?
                            <Link to="/checkout" onClick={toggleDrawer('right', false)}>Checkout</Link> :
                            <Link to="/login?redirect=checkout" onClick={toggleDrawer('right', false)}>Login First</Link>
                        )
                    }

                    <p className="shipping-cart">Free shipping on all orders over Rs 1000</p>
                </div>
            </div>
        </>
    );
}
