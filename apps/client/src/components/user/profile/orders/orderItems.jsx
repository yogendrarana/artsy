import { useState } from 'react';


// import css
import './orderItems.css'


// import components
import { Dialog } from '@mui/material'


export default function OrderItemsDialog({ arts }) {

    // local state
    const [open, setOpen] = useState(false);

    // functions
    const handleClose = () => { setOpen(false) };
    const handleClickOpen = () => { setOpen(true) };


    return (
        <>
            <i onClick={handleClickOpen} className='fa-solid fa-list'></i>

            <Dialog open={open} onClose={handleClose} className='orderItemsDialog'>
                <div className='orderItemsContainer'>
                    <h2>Order Items</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arts && arts[0] && arts.map((art, index) => {
                                    return (
                                        <tr key={index}>
                                            <td><img src={art.images[0].url} alt="artPic" /></td>
                                            <td>{art.name} {art.isAuctionItem && "(Auction Item)"}</td>
                                            <td>Rs {art.price}</td>
                                            <td>{art.category}</td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>
                </div>
            </Dialog>
        </>
    );
}