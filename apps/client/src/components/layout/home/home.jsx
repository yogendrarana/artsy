import { useEffect, useState } from 'react'


// import css
import './home.css'


// import hooks
import useFetch from '../../../hooks/useFetch'


// import components
import Hero from './hero'
import Category from './category'
import Subscribe from './subscribe'
import Recommendation from './recommendation'
import Slider from '../../utility/slider/slider'

const Home = () => {
    const { data } = useFetch('/arts/recommendations');
    const [specialOffers, setSpecialOffers] = useState([]);

    useEffect(() => {
        if (data) {
            setSpecialOffers(data.specialOffers);
        }
    }, [data])

    return (
        <>
            <div className='homeContainer'>
                <Hero />
                <Category />
                <Slider title='Special Offers' data={specialOffers} />
                <Recommendation />
                <Subscribe />
            </div>
        </>

    )
}

export default Home