import { Link } from 'react-router-dom'

// import css
import './category.css'

// import images
import drawing from '../../../assets/images/drawing.jpg'
import painting from '../../../assets/images/painting.jpg'
import sculpture from '../../../assets/images/sculpture.jpg'
import photography from '../../../assets/images/photography.jpg'

// component
function CategoryItem(props) {
    return (
        <div className='category'>
            <img src={props.image} alt='pic'></img>

            <p>{props.title}</p>

            <Link to={props.address}></Link>
        </div>
    )
}

const Category = () => {
    return (
        <>
            <section className='categorySection'>
                <h2>Browse By Category</h2>
                <div className='categories'>
                    <CategoryItem title='Painting' address='/arts/painting' image={painting} />
                    <CategoryItem title='Photography' address='/arts/photography' image={photography} />
                    <CategoryItem title='Sculpture' address='/arts/sculpture' image={sculpture} />
                    <CategoryItem title='Drawing' address='/arts/drawing' image={drawing} />
                </div>
            </section>
        </>
    )
}

export default Category;