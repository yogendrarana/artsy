import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// import redux actions
import { addToCart, deleteFromCart } from '../../../redux/slices/cartSlice.js';
import { addToLikes, deleteFromLikes } from '../../../redux/slices/likeSlice.js';

// import css
import './card.css'

const Card = ({ art, title, style }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // redux state
    const { myData } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.cart);
    const { likedArts } = useSelector(state => state.like);

    // handle add to cart
    const handleAddToCart = (art) => {
        const isAdded = cartItems.find(item => item._id === art._id)

        if (art.artStatus === 'sold') {
            return toast.error('The artwork is already sold.')
        }

        if (isAdded) {
            dispatch(deleteFromCart(art))
            return toast.error('Deleted from cart')
        }

        if (!isAdded) {
            dispatch(addToCart(art))
            return toast.success('Added to cart')
        }
    }

    // handle add to likes
    const handleAddToLikes = () => {
        const isLiked = likedArts.find(item => item._id === art._id)

        if (isLiked) {
            dispatch(deleteFromLikes(art))
            return toast.error('Removed from likes')
        }

        if (!isLiked) {
            dispatch(addToLikes(art))
            toast.success('Added to likes')
        }
    }


    return (
        <div className="cardContainer" style={style}>
            {art?.artStatus === 'sold' && <div className="artStatus">Sold</div>}
            <div className='itemImage'>
                <img src={art.images[0].url} alt="product-pic" />
            </div>

            <div className='itemInfo'>
                <p>{art.name}</p>
                <p>Rs {art.price} {title === "Special Offers" && <span>(-{art.discount}%)</span>}</p>
            </div>

            <div className="itemButtons">
                <button disabled={myData?._id === art?.creatorId || art?.isAuctionItem} onClick={() => handleAddToCart(art)}>
                    <i className={cartItems.find(item => item._id === art._id) ? "fa fa-check" : "fa-solid fa-cart-shopping"} aria-hidden="true"></i>
                    <span>{cartItems.find(item => item._id === art._id) ? "Added To Cart" : "Add To Cart"}</span>
                </button>

                <button onClick={() => navigate(`/art/${art._id}`)}>
                    <i className="fa-regular fa-eye"></i>
                    <span>View Detail</span>
                </button>

                <button disabled={myData?._id === art?.creatorId || art?.isAuctionItem} onClick={handleAddToLikes}>
                    <i className={likedArts.find(item => item._id === art._id) ? "fa-solid fa-check" : "fa-regular fa-heart"}></i>
                    <span>{likedArts.find(item => item._id === art._id) ? "Liked" : "Like"}</span>
                </button>
            </div>
        </div>
    )
}

export default Card;