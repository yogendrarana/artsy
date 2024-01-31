const TopSellers = ({ topSellers }) => {
    return (
        <div className='topSellersContainer'>
            <h2>Top Sellers</h2>
            <table>
                <thead>
                    <tr>
                        <th>Creator ID</th>
                        <th>Name</th>
                        <th>Total Sales</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        topSellers.map((seller, index) => {
                            return (
                                <tr key={index}>
                                    <td>{seller?._id}</td>
                                    <td>{seller?.creatorName}</td>
                                    <td>{seller?.totalSales}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TopSellers;