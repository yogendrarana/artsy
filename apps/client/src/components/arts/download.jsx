import axios from 'axios';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';


// import css
import './download.css'


// import components
import { Image } from 'antd'


// import redux actions
import { readArtwork } from '../../redux/slices/artSlice';


const Download = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    // local state
    const [downloading, setDownloading] = useState(false);
    
    // redux state
    const { artwork } = useSelector(state => state.art);

    const handleDownload = async (imageUrl) => {
        try {
            setDownloading(true);
            const { data } = await axios({ url: imageUrl, method: 'GET', responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'artwork.jpg');
            document.body.appendChild(link);
            link.click();
            setDownloading(false);
        } catch (error) {
            console.error(error);
            setDownloading(false);
        }
    };

    useEffect(() => {
        dispatch(readArtwork(id));
    }, [id, dispatch]);

    return (
        <>
            <div className='imageContainer'>
                {
                    artwork && artwork.images && artwork.images.map((img, index) => {
                        return (
                            <div  key={index}className='downloadContainer'>
                                <div className="imgContainer">
                                    <Image key={index} src={img.url} />
                                </div>

                                <button disabled={downloading} onClick={() => handleDownload(img.url)}>
                                    <i className="fa-solid fa-arrow-down"></i>
                                    <span>Download</span>
                                </button>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default Download