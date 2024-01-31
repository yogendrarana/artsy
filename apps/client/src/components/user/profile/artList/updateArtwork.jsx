import { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

// import redux actions
import { updateArtwork } from '../../../../redux/slices/artSlice.js';

// import css
import './updateArtwork.css'

// import components
import Dialog from '@mui/material/Dialog';

export default function UpdateArtwork({ currentArtwork }) {
    const dispatch = useDispatch();

    // local states
    const [name, setName] = useState(currentArtwork.name || '');
    const [price, setPrice] = useState(currentArtwork.price || '');
    const [discount, setDiscount] = useState(currentArtwork.discount || '');
    const [category, setCategory] = useState(currentArtwork.category || '');
    const [description, setDescription] = useState(currentArtwork.description || '');

    // redux states
    const { isLoading } = useSelector(state => state.art)

    // dialog controllers
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleClickOpen = () => setOpen(true);

    const updateArtworkHandler = () => {
        if (name === '' || price === '' || category === '' || description === '') {
            return toast.error('Please, fill in all the required fields.');
        }

        dispatch(updateArtwork({ artId: currentArtwork._id, name, price, discount, category, description }));
        
        handleClose();
    };

    return (
        <>
            <i className="fa-solid fa-pen" onClick={handleClickOpen}></i>

            <Dialog open={open} onClose={handleClose} className="updateArtworkContainer">
                <form>
                    <header>
                        <h2>Update Artwork</h2>
                        <i className="fa-solid fa-xmark" onClick={handleClose}></i>
                    </header>

                    <div>
                        <label>Name</label> <br />
                        <input type='text' placeholder='Name' value={name} onChange={e => setName(e.target.value)}></input>
                    </div>

                    <div>
                        <label>Price</label> <br />
                        <input type='number' placeholder='Price' value={price} onChange={e => setPrice(e.target.value)}></input>
                    </div>

                    <div>
                        <label>Discount</label> <br />
                        <input type='number' placeholder='Discount' value={discount} onChange={e => setDiscount(e.target.value)} />
                    </div>

                    <div>
                        <label>Category</label> <br />
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            <option disabled value=''>Category</option>
                            <option value='painting'>Painting</option>
                            <option value='drawing'>Drawing</option>
                            <option value='sculpture'>Sculpture</option>
                            <option value='photography'>Photography</option>
                        </select>
                    </div>

                    <div className='description'>
                        <label>Description</label> <br />
                        <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    </div>

                    <button type='button' onClick={updateArtworkHandler} disabled={isLoading ? true : false || name === '' || price === '' || category === '' || description === ''}>Update</button>
                </form>
            </Dialog>
        </>
    );
}
