import { toast } from 'react-hot-toast'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Outlet, useParams } from 'react-router-dom'


// import redux actions
import { clearError, clearMessage, updateAvatar, getUserProfile } from '../../../redux/slices/profileSlice.js'


// import css 
import './profile.css'


// import components
import Seo from '../../seo/seo'
import Khalti from '../../dialogs/khalti/khalti'
import Spinner from '../../utility/spinner/spinner'
import HireDialog from '../../dialogs/hire/hireDialog'


const Profile = () => {
    const { id } = useParams()
    const menuRef = useRef(null)
    const dispatch = useDispatch();

    // redux states
    const { myData } = useSelector(state => state.auth);
    const { userData, message, error, isLoading } = useSelector(state => state.profile);


    // scroll to tops
    const handleScroll = () => {
        menuRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAvatarChange = async (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = async () => {
            if (reader.readyState === 2) {
                dispatch(updateAvatar({ avatar: reader.result }));
            }
        }
    }

    useEffect(() => {
        dispatch(getUserProfile(id))

        if (message) {
            toast.success(message);
            dispatch(clearMessage());
        }

        if (error) {
            toast.error(error);
            dispatch(clearError());
        }

    }, [dispatch, error, message, id]);

    return (
        <>
            <Seo title={`Profile of ${userData?.name}`} description="Profile page of user." />

            <section className='profileSection'>
                <div className="profileCard">
                    <div className="avatar">
                        {myData && userData._id === myData._id &&
                            <label htmlFor='avatar'>
                                {isLoading ? <Spinner /> : (
                                    <>
                                        <i className="fa-solid fa-plus"></i>
                                        <input id="avatar" type="file" name='avatar' accept='image/*' onChange={handleAvatarChange} />
                                    </>
                                )}
                            </label>
                        }
                        {userData && userData.avatar && userData.avatar.url !== "" && <img src={userData.avatar.url} alt='avatar' />}
                        {userData && !userData.avatar && userData.name && Object.keys(userData).length !== 0 && <p>{userData.name[0]}</p>}
                    </div>

                    <div className="name">{userData && userData.name}</div>
                    <div className="role">Role: {userData && userData.role}</div>
                    <div className="email">Email: {userData && userData.email}</div>


                    {userData.socials &&
                        <div className="social">
                            {userData.socials.facebook !== '' &&
                                <a href={`https://facebook.com/${userData.socials.facebook}`} target='_blank' rel="noopener noreferrer">
                                    <i className="fa-brands fa-facebook facebook"></i>
                                </a>
                            }

                            {userData.socials.instagram !== '' &&
                                <a href={`https://instagram.com/${userData.socials.instagram}`} target='_blank' rel="noopener noreferrer">
                                    <i className="fa-brands fa-instagram instagram"></i>
                                </a>
                            }

                            {userData.socials.twitter !== '' &&
                                <a href={`https://twitter.com/${userData.socials.twitter}`} target='_blank' rel="noopener noreferrer">
                                    <i className="fa-brands fa-twitter twitter"></i>
                                </a>
                            }
                        </div>
                    }

                    <div className="buttons">
                        {(userData._id !== myData?._id) && (userData.role !== 'admin') && <HireDialog />}
                        {(userData._id !== myData?._id) && (userData?.donation?.khalti?.public_key && userData?.donation?.khalti?.secret_key) && <Khalti />}
                    </div>
                </div>

                <div className="profileOptions">
                    <nav ref={menuRef} onClick={handleScroll}>
                        {myData?.role !== "user" && <NavLink to='artworks'>Artworks</NavLink>}

                        {userData?._id === myData?._id && <NavLink to='detail'>Detail</NavLink>}

                        {userData?._id === myData?._id && <NavLink to='likes'>Likes</NavLink>}

                        {userData?._id === myData?._id && <NavLink to='orders'>Orders</NavLink>}

                        {userData?._id === myData?._id && myData?.role !== "user" && <NavLink to='upload'>Upload</NavLink>}
                    </nav>

                    <Outlet />
                </div>
            </section>
        </>
    )
}

export default Profile;