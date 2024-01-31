import toast from 'react-hot-toast';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


// import css
import './reviewDialog.css'


// import components
import { Dialog } from '@mui/material';


// import redux actions
import { clearError, clearMessage, createReview, getReviews } from '../../../redux/slices/artSlice.js';


export default function ReviewDialog() {
    const { id } = useParams();
    const dispatch = useDispatch();

    // local state
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [openReviewDialog, setOpenReviewDialog] = useState(false);

    // redux state
    const { error, message } = useSelector(state => state.art)

    const handleClickOpen = () => { setOpenReviewDialog(true) };
    const handleClose = () => { setOpenReviewDialog(false) };

    const handleReviewSubmit = () => {
        if (rating === 0) return toast.error('Please, provide the rating.')
        dispatch(createReview({ rating, comment, id })).then(() => dispatch(getReviews(id)));
        setRating(0);
        setComment('');
        handleClose();
    }

    useEffect(() => {
        if (message) {
            toast.success(message);
            dispatch(clearMessage());
        }

        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [error, message, dispatch])

    return (
        <>
            <button onClick={handleClickOpen}>Write a Review</button>

            <Dialog open={openReviewDialog} onClose={handleClose} className="reviewDialogContainer">
                <div className='reviewDialogContent'>
                    <h2>Your review</h2>

                    <div className="rating">
                        {
                            [1, 2, 3, 4, 5].map((val, index) => {
                                return (
                                    <i key={index} className={val <= rating ? "fas fa-star" : "far fa-star"} onClick={() => setRating(val)} aria-hidden='true' />
                                )
                            })
                        }
                    </div>

                    <textarea placeholder="Please, write your review..." value={comment} onChange={e => setComment(e.target.value)}></textarea>

                    <div className='buttons'>
                        <button onClick={handleReviewSubmit}>Submit</button>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
