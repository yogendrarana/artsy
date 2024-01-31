import toast from 'react-hot-toast';
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


// import redux actions
import { readArtwork } from '../../redux/slices/artSlice';
import { addToCart, deleteFromCart } from '../../redux/slices/cartSlice.js';
import { addToLikes, deleteFromLikes } from '../../redux/slices/likeSlice.js';
import { placeBid, clearError as clearAuctionError, clearMessage as clearAuctionMessage, findHighestBid } from '../../redux/slices/auctionSlice.js';


// import css
import './detail.css'


// import components
import Reviews from './reviews';
import Timer from '../utility/timer/timer';
import Share from '../dialogs/share/share';
import Carousel from '../utility/carousel/carousel';


const Detail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // local state
    const [bids, setBids] = useState([])
    const [bidAmount, setBidAmount] = useState('')
    const [highestBid, setHighestBid] = useState({})

    // redux state
    const { artwork } = useSelector(state => state.art);
    const { myData } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.cart);
    const { likedArts } = useSelector(state => state.like);
    const { message: auctionMessage, error: auctionError } = useSelector(state => state.auction);


    // handle add to cart
    const handleAddToCart = () => {
        const isAdded = cartItems.find(item => item._id === artwork._id)

        if (artwork.artStatus === 'sold') {
            return toast.error('The artwork is already sold.')
        }

        if (isAdded) {
            dispatch(deleteFromCart(artwork))
            return toast.error('Deleted from cart')
        }

        if (!isAdded) {
            dispatch(addToCart(artwork))
            return toast.success('Added to cart')
        }
    }

    // handle add to likes
    const handleAddToLikes = () => {
        const isLiked = likedArts.find(item => item._id === artwork._id)

        if (isLiked) {
            dispatch(deleteFromLikes(artwork))
            return toast.error('Deleted from likes')
        }

        if (!isLiked) {
            dispatch(addToLikes(artwork))
            toast.success('Added to likes')
        }
    }

    // handle place bid
    const handlePlaceBid = () => {
        if (!myData) return toast.error('Please login to place a bid');
        if (!bidAmount) return toast.error('Please enter the bidding amount');

        // disable when time ends
        if (Date.now() > Date.parse(artwork?.auctionEndDate)) return toast.error('The time of the auction has already ended!');

        if (bidAmount <= artwork?.estimatedValueFrom) return toast.error(`The bidding price should be bigger than the lower estimated value of Rs ${artwork?.estimatedValueFrom}`);
        dispatch(placeBid({ bidAmount, artId: artwork?._id, bidderId: myData?._id })).then(() => dispatch(readArtwork(id)))
        setBidAmount('');
    }

    useEffect(() => {
        dispatch(readArtwork(id))
    }, [dispatch, id])


    useEffect(() => {
        if (artwork && artwork._id) {
            const fetchHighestBid = async () => {
                const data = await findHighestBid(artwork?._id);
                setBids(data.bids);
                setHighestBid(data.highestBid);
            };

            fetchHighestBid();
        }
    }, [artwork]);



    useEffect(() => {
        if (auctionMessage) {
            toast.success(auctionMessage);
            dispatch(clearAuctionMessage());
        }

        if (auctionError) {
            toast.error(auctionError);
            dispatch(clearAuctionError());
        }

        return () => {
            dispatch(clearAuctionMessage());
            dispatch(clearAuctionError());
        };
    }, [dispatch, auctionMessage, auctionError])


    return (
        <>
            <div className='productDetailContainer'>
                <div className="firstRow">
                    <div className='carousel'>
                        <Carousel images={artwork?.images} />
                    </div>

                    <div className="infoContainer">
                        <h2>{artwork.name} {artwork?.artStatus === 'sold' && <span>(Sold)</span>}</h2>

                        <Link to={`/user/${artwork?.creatorId}/artworks`}>Creator Profile</Link>

                        <div className='rating'>
                            <div>
                                {
                                    [1, 2, 3, 4, 5].map((val, index) => {
                                        return (
                                            <i key={index} className={val <= artwork?.averageRating ? "fas fa-star" : "far fa-star"} aria-hidden='true' />
                                        )
                                    })
                                }
                            </div>
                            <div>{artwork?.reviews?.length} reviews</div>
                            {(artwork?.discount > 0) && <div>{artwork.discount} % discount</div>}
                            {artwork?.isAuctionItem && <div>Auction Item</div>}
                        </div>

                        <div className='description'>{artwork.description}</div>

                        <div className="buttons">
                            {!artwork?.isAuctionItem && <div className='price'>Rs {artwork?.price}</div>}

                            <button disabled={artwork?.isAuctionItem || myData?._id === artwork.creatorId} onClick={handleAddToLikes}>
                                <i className={likedArts.find(item => item._id === artwork?._id) ? "fa-solid fa-check" : "fa-regular fa-heart"}></i>
                            </button>

                            <button disabled={artwork?.isAuctionItem || myData?._id === artwork?.creatorId} onClick={handleAddToCart}>
                                <i className={cartItems.find(item => item._id === artwork._id) ? "fa fa-check" : "fa-solid fa-cart-shopping"} aria-hidden="true"></i>
                            </button>
                            
                            <Share />
                        </div>


                        {/* auction */}
                        {artwork && artwork.isAuctionItem &&
                            <div className='auctionInfo'>
                                <h2>Auction Information</h2>

                                <div className='option'>
                                    <div>Auction Ends In</div>
                                    <div>
                                        {artwork && artwork.auctionEndDate && <Timer artwork={artwork} />}
                                    </div>
                                </div>

                                <div className='option'>
                                    <div>Estimated Value</div>
                                    <div>
                                        <p>Rs {artwork?.estimatedValueFrom} - {artwork?.estimatedValueTo}</p>
                                    </div>
                                </div>

                                <div className='option'>
                                    <div>Highest Bid</div>
                                    <div>
                                        <p>{highestBid ? `Rs ${highestBid.bidAmount}` : "No bids"}</p>
                                        <p>{bids?.length} {bids?.length === 1 ? 'bid' : 'bids'}</p>
                                    </div>
                                </div>

                                <form>
                                    <input type='number' autoComplete='off' placeholder='Bidding Amount' value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} required />
                                    <button type='button' onClick={handlePlaceBid}>Place Bid</button>
                                </form>
                            </div>
                        }
                    </div>

                </div>

                <div className="secondRow">
                    <Reviews />
                </div>
            </div>
        </>
    )
}

export default Detail