import moment from 'moment';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// import redux actions
import { getAllArts, deleteArt, clearMessage } from '../../../../redux/slices/artSlice.js';

// import css
import './artList.css'

// import components
import UpdateArtwork from './updateArtwork';

const ArtList = () => {
    const { id } = useParams()
    const dispatch = useDispatch();

    // local states
    const [arts, setArts] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('')

    // redux states
    const { myData } = useSelector((state) => state.auth);
    const { allArts, message } = useSelector((state) => state.art);

    const handleDeleteArtwork = (artId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete the art? This action cannot be undone.");

        if (confirmDelete) {
            dispatch(deleteArt(artId));            
            setArts((prevArts) => prevArts.filter((art) => art._id !== artId));
        }
    }

    useEffect(() => {
        dispatch(getAllArts({ keyword, category }));
    }, [dispatch, keyword, category]);

    useEffect(() => {
        if (allArts) {
            if (id) {
                const arts = allArts.filter(art => art.creatorId.toString() === id)
                setArts(arts)
            } else {
                setArts(allArts)
            }
        }
    }, [allArts, id]);

    useEffect(() => {
        if (message) {
            toast.success(message);
            clearMessage();
        }
    }, [message]);

    return (
        <div className='artList'>
            <header>
                <div className='search'>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type='text' placeholder='Search...' value={keyword} onChange={e => setKeyword(e.target.value)} />
                </div>

                <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value='' disabled>Category</option>
                    <option value=''>All</option>
                    <option value='painting'>Painting</option>
                    <option value='photography'>Photography</option>
                    <option value='sculpture'>Sculpture</option>
                    <option value='drawing'>Drawing</option>
                    <option value='digital'>Digital</option>
                </select>
            </header>

            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>ID</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Category</th>
                        <th>Posted On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        arts[0] && arts.map((art, index) => {
                            return (
                                <tr key={index}>
                                    <td><img src={art.images[0].url} alt="artPic" /></td>
                                    <td>{art.name} {art.isAuctionItem && "(Auction Item)"}</td>
                                    <td>{art._id}</td>
                                    <td>Rs {art.price}</td>
                                    <td>{art.discount ? art.discount : 0} %</td>
                                    <td>{art.category}</td>
                                    <td>{moment(art.uploadedAt).format('YYYY-MM-DD')}</td>
                                    {(myData?._id === art.creatorId || myData?.role === 'admin') &&
                                        <td>
                                            <UpdateArtwork currentArtwork={art} />
                                            <i className="fa-solid fa-trash-can" onClick={() => handleDeleteArtwork(art._id)}></i>
                                        </td>
                                    }
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>

            {!arts[0] && <div className='noArts'>No artworks!</div>}
        </div>
    )
}

export default ArtList