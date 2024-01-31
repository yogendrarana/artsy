import { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// import css and image
import './hero.css'
import heroImage from '../../../assets/images/paint.jpg'

const Hero = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = (event) => {
    if (event.type === 'click' || (event.type === 'keydown' && event.key === 'Enter')) {
      if(keyword === ''){
        event.preventDefault(); // prevent page refresh
        return toast.error('Please enter a keyword first.');
      } else if (keyword.trim()) {
        navigate(`/arts/search?keyword=${keyword}`)
      }
  
      if (event.key === 'Enter') {
        event.preventDefault();
      }
    }
  };

  const heroStyle = {  
    backgroundImage: `url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: "center",
    backgroundRepeat: 'no-repeat',
  }
  

  return (
    <>
        <div className='heroContainer' style={heroStyle}>
          <p>Discover a world of creativity <br /> with our online marketplace for arts!</p>
          <form>
            <input type='text' placeholder='Search...' onChange={e => setKeyword(e.target.value)} value={keyword} onKeyDown={handleSearch} />
            <button onClick={handleSearch}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
    </>
  )
}

export default Hero