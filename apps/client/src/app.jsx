import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

// import slice
import { getMyProfileData } from './redux/slices/userSlice.js';

// import css 
import './app.css';

// import components
import Arts from './components/arts/arts.jsx';
import Error from './components/error/error.jsx';
import Detail from './components/arts/detail.jsx';
import Home from './components/layout/home/home.jsx';
import Login from './components/user/login/login.jsx';
import Download from './components/arts/download.jsx';
import Auctions from './components/auction/auction.jsx';
import About from './components/layout/about/about.jsx';
import Checkout from './components/checkout/checkout.jsx';
import Footer from './components/layout/footer/footer.jsx';
import Navbar from './components/layout/navbar/navbar.jsx';
import Profile from './components/user/profile/profile.jsx';
import AdminLayout from './components/admin/adminLayout.jsx';
import Contact from './components/layout/contact/contact.jsx';
import Company from './components/layout/company/company.jsx';
import Likes from './components/user/profile/likes/likes.jsx';
import Register from './components/user/register/register.jsx';
import UserList from './components/admin/userList/userList.jsx';
import Upload from './components/user/profile/upload/upload.jsx';
import Orders from './components/user/profile/orders/orders.jsx';
import Dashboard from './components/admin/dashboard/dashboard.jsx';
import OrderList from './components/admin/orderList/orderList.jsx';
import ArtList from './components/user/profile/artList/artList.jsx';
import ResetPassword from './components/user/password/resetPassword.jsx';
import ForgetPassword from './components/user/password/forgetPassword.jsx';
import ChangePassword from './components/user/password/changePassword.jsx';
import UserDetail from './components/user/profile/userDetail/userDetail.jsx';

// redux store
import store from './redux/store/store.js';

function App() {
    const { user, isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        store.dispatch(getMyProfileData());
    }, []);

    return (
        <div className="app">
            <Navbar user={user} isAuthenticated={isAuthenticated} />

            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/help/about' element={<About />} />
                <Route exact path='/help/contact' element={<Contact />} />
                <Route exact path='/help/company' element={<Company />} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path='/register' element={<Register />} />
                <Route exact path='/art/:id' element={<Detail />} />
                <Route exact path='/auction' element={<Auctions />} />
                <Route exact path='/arts' element={<Arts />} />
                <Route exact path='/arts/:type' element={<Arts />} />
                <Route exact path='/arts/search' element={<Arts />} />
                <Route exact path='/download-image/:id' element={<Download />} />
                <Route exact path='/password/forget' element={<ForgetPassword />} />
                <Route exact path='/password/reset/:token' element={<ResetPassword />} />
                <Route exact path='/password/change' element={<ChangePassword />} />
                <Route exact path='/checkout' element={<Checkout />} />
                <Route exact path='/user/:id' element={<Profile />}>
                    <Route index element={<ArtList />} />
                    <Route exact path='artworks' element={<ArtList />} />
                    <Route exact path='detail' element={<UserDetail />} />
                    <Route exact path='likes' element={<Likes />} />
                    <Route exact path='upload' element={<Upload />} />
                    <Route exact path='orders' element={<Orders />} />
                </Route>
                <Route exact path='/admin' element={<AdminLayout />} >
                    <Route index element={<Dashboard />} />
                    <Route exact path='dashboard' element={<Dashboard />} />
                    <Route exact path='arts' element={<ArtList />} />
                    <Route exact path='users' element={<UserList />} />
                    <Route exact path='orders' element={<OrderList />} />
                </Route>
                <Route path='*' element={<Error />} />
            </Routes>

            <Footer />
        </div>
    );
}

export default App;