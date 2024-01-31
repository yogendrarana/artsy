import toast from 'react-hot-toast'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


// import css
import './upload.css'


// import components
import Bubbles from '../../../utility/bubbles/bubbles'


// import actions
import { clearError, clearMessage, uploadArt } from '../../../../redux/slices/artSlice.js';


const Upload = () => {
    const dispatch = useDispatch();

    // local states
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState([]);
    const [discount, setDiscount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isAuctionItem, setIsAuctionItem] = useState(false);
    const [estimatedValueTo, setEstimatedValueTo] = useState('');
    const [estimatedValueFrom, setEstimatedValueFrom] = useState('');

    // redux states
    const { error, message, isLoading } = useSelector(state => state.art);


    const handleImageChange = (e) => {
        e.preventDefault();
        setImages(old => [...old, ...e.target.files]);
        setImagePreviews(prev => [...prev, ...Array.from(e.target.files).map(img => URL.createObjectURL(img))]);
    };

    const handleClear = () => {
        setName('')
        setPrice('')
        setImages([])
        setDiscount('')
        setCategory('')
        setDescription('')
        setSelectedTime('')
        setSelectedDate('')
        setImagePreviews([])
        setEstimatedValueTo('')
        setIsAuctionItem(false)
        setEstimatedValueFrom('')
    }

    const handleSubmit = async () => {
        if (images.length < 1) {
            return toast.error("You must include image of you artwork as well.")
        };

        if (isAuctionItem && (estimatedValueFrom === '' || estimatedValueTo === '' || selectedDate === '' || selectedTime === '')) {
            return toast.error("Please fill all the fields.")
        };

        const myForm = new FormData();
        myForm.append('name', name);
        myForm.append('price', price);
        myForm.append('discount', discount);
        myForm.append('category', category);
        myForm.append('description', description);
        myForm.append('isAuctionItem', isAuctionItem);

        for (const image of images) {
            myForm.append('artImages', image);
        }

        if (isAuctionItem) {
            myForm.append('estimatedValueFrom', estimatedValueFrom);
            myForm.append('estimatedValueTo', estimatedValueTo);
            myForm.append('auctionEndDate', selectedDate + ' ' + selectedTime);
        }

        dispatch(uploadArt(myForm));
    };


    useEffect(() => {
        if (message) {
            handleClear();
            toast.success(message);
            dispatch(clearMessage());
        }

        if (error) {
            toast.error(error);
            dispatch(clearError());
        }
    }, [dispatch, message, error])

    return (
        <>
            <div className="uploadContainer">
                <form>
                    <div className='row1'>
                        <div>
                            <span>Name</span>
                            <input type="text" placeholder='required*' value={name} autoComplete='off' onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div>
                            <span>Price</span>
                            <input type="number" placeholder='required*' value={price} min='0' autoComplete='off' onChange={(e) => setPrice(e.target.value)} required />
                        </div>

                        <div>
                            <span>Discount</span>
                            <input type="number" placeholder='optional' value={discount} min='0' onChange={(e) => setDiscount(e.target.value)} />
                        </div>

                        <div>
                            <span>Choose Category</span>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                <option value='' disabled>Category</option>
                                <option value='painting'>Painting</option>
                                <option value='photography'>Photography</option>
                                <option value='drawing'>Drawing</option>
                                <option value='sculpture'>Sculpture</option>
                            </select>
                        </div>
                    </div>

                    <div className="row2">
                        <div>
                            <textarea value={description}
                                placeholder="Please add the detailed description of your art here..."
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="row3">
                        <input id='artImages' type='file' accept='images/*' onChange={handleImageChange} multiple required />

                        <label htmlFor='artImages'>
                            <i className="fa-solid fa-arrow-up-from-bracket"></i>
                            <p>Upload images of your art.</p>
                        </label>

                        {imagePreviews[0] &&
                            <div className="imagePreview" style={{ display: imagePreviews[0] ? "flex" : "none" }}>
                                {imagePreviews.map((img, index) => { return <img key={index} src={img} alt="artImage" /> })}
                            </div>
                        }
                    </div>

                    <div className={isAuctionItem ? "auctionFields active" : "auctionFields"}>
                        <div>
                            <span>Estimated Value (From)</span>
                            <input type="number" placeholder="required" value={estimatedValueFrom} min="0" onChange={e => setEstimatedValueFrom(e.target.value)} required={isAuctionItem} />
                        </div>

                        <div>
                            <span>Estimated Value (To)</span>
                            <input type="number" placeholder="required" value={estimatedValueTo} min="0" onChange={e => setEstimatedValueTo(e.target.value)} required={isAuctionItem} />
                        </div>

                        <div>
                            <span>End Date</span>
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required={isAuctionItem} />
                        </div>

                        <div>
                            <span>End Time</span>
                            <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required={isAuctionItem} />
                        </div>
                    </div>

                    <div className="buttons">
                        <input type="checkbox" checked={isAuctionItem} onChange={() => setIsAuctionItem(!isAuctionItem)} /><span>Upload as auction artwork?</span>
                        <button type='button' onClick={handleClear} disabled={isLoading} className='clearButton'>Clear</button>
                        <button type='button' onClick={handleSubmit} disabled={isLoading}>{isLoading ? <Bubbles /> : "Submit"}</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Upload;