import { useDispatch } from 'react-redux';

// import redux actions
import { deleteFromLikes } from '../../../../redux/slices/likeSlice.js';

// import css and 
import './likes.css'

// import components
import Seo from '../../../seo/seo';
import { useEffect, useState } from 'react';

const Likes = () => {
    const dispatch = useDispatch()
    const [likes, setLikes] = useState([]);
    
    const handleDeleteFromLikes = (art) => {
        dispatch(deleteFromLikes(art));
        const newLikes = likes.filter(item => item._id !== art._id);
        setLikes(newLikes);
    };
    
    useEffect (() => {
        const likedArts = localStorage.getItem('likedArts') ? JSON.parse(localStorage.getItem('likedArts')) : [];
        setLikes(likedArts);
    }, []);

    return (
        <>
            <Seo description="Page for demonstrating likes of a user.." />

            <div className="likesContainer">
                {likes[0] &&
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>ID</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {likes.map((like) => (
                                <tr key={like?._id}>
                                    <td><img src={like.images[0].url} alt="artPic" /></td>
                                    <td>{like?.name}</td>
                                    <td>{like?._id}</td>
                                    <td>Rs {like?.price}</td>
                                    <td>{like?.category}</td>
                                    <td><i className="fa-solid fa-trash-can" onClick={() => handleDeleteFromLikes(like)}></i></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }

                {!likes[0] && <div className="noLikes">You have not liked any art yet!</div>}
            </div>
        </>
    );
}

export default Likes;