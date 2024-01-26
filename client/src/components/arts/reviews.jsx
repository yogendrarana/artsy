import moment from 'moment'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'


// import css
import './reviews.css'


// import redux actions
import { getReviews } from '../../redux/slices/artSlice.js'


// import components
import ReviewDialog from '../dialogs/review/reviewDialog.jsx'


function ReviewBar({ title, style }) {
    return (
        <div className="reviewBar">
            <div className="starsTitle">{title}</div>
            <div className="ratingGraph">
                <div className="percentageBar" style={style}></div>
            </div>
        </div>
    )
}

const Reviews = () => {
    const { id } = useParams();
    const dispatch = useDispatch()

    // redux state
    const { myData } = useSelector(state => state.user);
    const { reviews } = useSelector(state => state.art);

    // get request
    useEffect(() => {
        dispatch(getReviews(id))
    }, [dispatch, id])

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const ratingPercentages = { 1: "0%", 2: "0%", 3: "0%", 4: "0%", 5: "0%" };

    let sortedReviews = [];

    if (reviews) {
        // Sort the reviews
        sortedReviews = sortReviews(reviews);

        // Count the ratings
        sortedReviews.reduce((acc, curr) => {
            acc[curr.rating]++;
            return acc;
        }, ratingCounts);

        const totalReviews = sortedReviews.length;

        for (const [rating, count] of Object.entries(ratingCounts)) {
            const percentage = count / totalReviews * 100;
            ratingPercentages[rating] = percentage.toFixed(2) + "%";
        }
    }

    function sortReviews(reviews) {
        let sortedReviews = [];
        let currentUserReview = null;

        for (let i = 0; i < reviews.length; i++) {
            if (reviews[i].reviewerId.toString() === myData?._id.toString()) {
                currentUserReview = reviews[i];
            } else {
                sortedReviews.push(reviews[i]);
            }
        }

        if (currentUserReview) {
            console.log(currentUserReview);
            sortedReviews.unshift(currentUserReview);
        }

        return sortedReviews;
    }

    return (
        <>
            <div className='reviewsContainer'>
                <h2>Reviews</h2>

                <div className='reviewSummary'>
                    <div className='summary one'>

                        {/* show average reviews */}
                        <p>{reviews.length === 0 ? '0.0' : (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length)}</p>
                        <p>{reviews?.length === 0 ? "No reviews" : reviews.length > 1 ? (`${reviews.length} reviews`) : (`${reviews.length} review`)} </p>
                        <ReviewDialog />
                    </div>

                    <div className="summary two">
                        <ReviewBar title="5 Stars" style={{ width: ratingPercentages[5] }} />
                        <ReviewBar title="4 Stars" style={{ width: ratingPercentages[4] }} />
                        <ReviewBar title="3 Stars" style={{ width: ratingPercentages[3] }} />
                        <ReviewBar title="2 Stars" style={{ width: ratingPercentages[2] }} />
                        <ReviewBar title="1 Star" style={{ width: ratingPercentages[1] }} />
                    </div>
                </div>

                <div className="reviews">
                    {
                        reviews && sortedReviews.map((review, index) => {
                            return (
                                <div className='review' key={index}>
                                    <div className="reviewer">
                                        <div className='rating'>
                                            {
                                                [1, 2, 3, 4, 5].map((val, index) => {
                                                    return (
                                                        <i key={index} className={val <= review?.rating ? "fas fa-star" : "far fa-star"} aria-hidden='true' />
                                                    )
                                                })
                                            }
                                        </div>

                                        <div className='name'>
                                            <p>{review?.reviewerId?.name}</p>
                                            <p>({moment(review.reviewedOn).format('YYYY-MM-DD')})</p>
                                        </div>
                                    </div>

                                    <div className='comment'>{review?.comment}</div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Reviews;