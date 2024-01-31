import { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom'


// import css
import './navbar.css'


// import components
import Cart from '../../cart/cart';
import Drawer from '@mui/material/Drawer';
import Bubbles from '../../utility/bubbles/bubbles';


// import logo 
import logo from '../../../assets/logo/logo.png'


// import redux actions
import { logoutUser } from '../../../redux/slices/authSlice';

// menu
const menus = [
    { title: 'home' },
    { title: 'arts' },
    { title: 'auction' },
    { title: 'help', subMenu: ['about', 'contact', 'company'] },
];

const Navbar = ({ isAuthenticated }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // local state
    const [sidebar, setSidebar] = useState(false);
    const [accountPopover, setAccountPopover] = useState(false);
    const [toggleCart, setToggleCart] = useState({ right: false });

    // redux state
    const { cartItems } = useSelector(state => state.cart);
    const { myData, isLoading } = useSelector(state => state.auth);

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) { return }
        setToggleCart({ ...toggleCart, [anchor]: open });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logoutUser());
        navigate('/');
        toast.success("Logged out successfully!");
    };

    return (
        <>
            <nav className='navbar'>
                <div className="navLogo">
                    <Link to='/'><img src={logo} alt='logo' style={{ marginRight: "0.5rem" }} /> Artsy </Link>
                </div>

                <ul className={!sidebar ? "navMenu" : "navMenu active"}>
                    {
                        menus.map((menu, index) => {
                            return (
                                <li key={index} onClick={() => setSidebar(false)}>
                                    <NavLink
                                        exact='true'
                                        to={menu.title === 'home' ? '/' : `${menu.title}`}
                                        onClick={menu.title === 'help' ? (e) => e.preventDefault() : null}
                                    >
                                        <span>{menu.title}</span>
                                        {menu.subMenu && <i className="fa-solid fa-chevron-down"></i>}
                                    </NavLink>
                                    {
                                        menu.subMenu &&
                                        <ul className='subMenu'>
                                            {
                                                menu.subMenu.map((sm, index) => {
                                                    return (
                                                        <li key={index}>
                                                            <NavLink exact="true" to={sm === 'digital art' ? menu.title + '/digital' : menu.title + '/' + sm}>{sm}</NavLink>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    }
                                </li>
                            )
                        })
                    }
                </ul>

                <div className='navIcons'>
                    {/* {isAuthenticated && <ChatDialog />} */}

                    <div className="profileIcon" onClick={() => setAccountPopover(!accountPopover)}>
                        {accountPopover ? 
                            <i className="fa-solid fa-xmark"></i> : isAuthenticated ? <h4>{myData?.name.charAt(0)}</h4> : <i className="fa-regular fa-user"></i>}
                                

                        <ul className={accountPopover ? "active" : ""}>
                            {!isAuthenticated &&
                                <>
                                    <li>
                                        <Link to='/login'>Login</Link>
                                    </li>
                                    <li>
                                        <Link to='/register'>Register</Link>
                                    </li>
                                </>
                            }

                            {isAuthenticated &&
                                <>
                                    <li>
                                        <Link to="#" style={{ backgroundColor: "#ededed", borderRadius: "0.5rem" }}>Signed in as <br /><b>{myData?.name}</b></Link>
                                    </li>
                                    <li>
                                        <Link to={`/user/${myData?._id}/${myData?.role === "user" ? "detail" : "artworks"}`}>My Profile</Link>
                                    </li>

                                    {isAuthenticated && myData?.role === "admin" &&
                                        <li>
                                            <Link to='/admin/dashboard'>Admin Panel</Link>
                                        </li>
                                    }

                                    <li>
                                        <Link to='#' onClick={handleLogout} style={{ borderTop: "1px solid #ededed" }}>{isLoading ? <Bubbles /> : "Log Out"}</Link>
                                    </li>
                                </>
                            }

                        </ul>
                    </div>

                    <div className="cartIcon" onClick={toggleDrawer('right', true)}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span className="nav-total-quantity">{cartItems.length}</span>
                    </div>

                    <div className="barsIcon" onClick={() => setSidebar(!sidebar)}>
                        {!sidebar ? <i className="fa-solid fa-bars"></i> : <i className="fa-solid fa-xmark"></i>}
                    </div>
                </div>

                <Drawer anchor={'right'} open={toggleCart['right']} onClose={toggleDrawer('right', false)}>
                    <Cart toggleDrawer={toggleDrawer} />
                </Drawer>
            </nav>
        </>
    )
}

export default Navbar