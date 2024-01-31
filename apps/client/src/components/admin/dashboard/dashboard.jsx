import { useEffect, useState } from 'react'
import { useDispatch, useSelector, } from 'react-redux'


// import css 
import './dashboard.css'


// import components
import NewUsers from './newUsers'
import Widgets from './widget.jsx'
import TopSellers from './topSellers'
import RecentOrders from './recentOrders'
import SaleByCategory from './salesByCategory.jsx'
import Skeleton from '../../utility/skeleton/skeleton'


// import redux actions
import { getStats } from '../../../redux/slices/adminSlice.js'


const Dashboard = () => {
    const dispatch = useDispatch();

    // local state
    const [barData, setBarData] = useState([]);
    const [newUsers, setNewUsers] = useState([]);
    const [newOrders, setNewOrders] = useState([]);
    const [topSellers, setTopSellers] = useState([]);

    // redux state
    const { stats, isLoading } = useSelector(state => state.admin);

    useEffect(() => {
        dispatch(getStats());
    }, [dispatch])

    useEffect(() => {
        if (stats && stats.salesByCategory) {
            setBarData(stats.salesByCategory);
        }

        if (stats && stats.newUsers) {
            setNewUsers(stats.newUsers);
        }

        if (stats && stats.newOrders) {
            setNewOrders(stats.newOrders);
        }

        if (stats && stats.topSellers) {
            setTopSellers(stats.topSellers);
        }
    }, [stats]);


    if (isLoading) {
        return <Skeleton style={{ height: "30vh", width: "100%", marginTop: '1rem' }} />;
    }

    return (
        <div className='dashboardContainer'>
            <div className="widgetsContainer">
                <Widgets title="Total Users" value={stats?.totalUsers} />
                <Widgets title="Total Creators" value={stats?.totalCreators} />
                <Widgets title="Total Artworks" value={stats?.totalArtworks} />
                <Widgets title="Total Orders" value={stats?.totalOrders} />
                <Widgets title="Total Sale (in Rs)" value={stats?.totalSale} />
            </div>

            <div className="featuredInfo">
                <NewUsers newUsers={newUsers} />
                <RecentOrders newOrders={newOrders} />
            </div>

            <div className="charts">
                <TopSellers topSellers={topSellers} />
                <SaleByCategory barData={barData} />
            </div>
        </div>
    )
}

export default Dashboard;