import moment from 'moment';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';


// import css
import './orders.css'


// import components
import OrderItemsDialog from './orderItems';


// import redux actions
import { getOrdersMade, getOrdersReceived } from '../../../../redux/slices/userSlice.js';


const Orders = () => {
    const dispatch = useDispatch();

    // redux state
    const { myData } = useSelector(state => state.auth);
    const { ordersMade, ordersReceived } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getOrdersMade())
        dispatch(getOrdersReceived())
    }, [dispatch]);

    return (
        <div className='ordersContainer'>
            <div className='ordersMade'>
                <h2>Orders Made</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Status</th>
                            <th>Payment Status</th>
                            <th>Order Total</th>
                            <th>Ordered On</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ordersMade[0] && ordersMade.map((order, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{order._id}</td>
                                        <td>{order.orderStatus}</td>
                                        <td>{order.paymentDetail.status}</td>
                                        <td>{order.orderTotal}</td>
                                        <td>{moment(order.orderCreatedOn).format('YYYY-MM-DD')}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {!ordersMade[0] && <div className='noOrders'>No orders made!</div>}
            </div>

            {
                (myData && (myData.role === "creator" || myData.role === "admin")) && (
                    <div className='ordersReceived'>
                        <h2>Orders Received</h2>

                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Order Status</th>
                                    <th>Payment Status</th>
                                    <th>Order Total</th>
                                    <th>Ordered On</th>
                                    <th>Ordered Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ordersReceived[0] && ordersReceived.map((order, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{order?.order?._id}</td>
                                                <td>{order?.order?.orderStatus}</td>
                                                <td>{order?.order?.paymentDetail.status}</td>
                                                <td>{order?.order?.orderTotal}</td>
                                                <td>{moment(order?.order?.createdAt).format('YYYY-MM-DD')}</td>
                                                <td>
                                                    <OrderItemsDialog arts={order?.arts} />
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        {!ordersReceived[0] && <div className='noOrders'>No orders received!</div>}
                    </div>
                )
            }

        </div>
    )
}

export default Orders;