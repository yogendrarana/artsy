import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';


// import css
import './hireDialog.css'


// import components
import { Dialog } from '@mui/material'


export default function HireDialog() {
    // local state
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [senderEmail, setSenderEmail] = useState('');
    const [receiverEmail, setReceiverEmail] = useState('');

    // redux state
    const { userData } = useSelector(state => state.profile);

    // functions
    const handleClose = () => { setOpen(false) };
    const handleClickOpen = () => { setOpen(true) };

    // handle hire submit
    const handleHireSubmit = async () => {
        if (!date || !time) { return toast.error("Please choose date and time!") };
        if (!senderEmail || !message) { return toast.error("Fill all the required fields!") };
        if (!receiverEmail) { return toast.error("The artist has not provide the email!") };

        const subject = `About hiring ${userData?.role}`;
        const body = message + `\n\nDate: ${date}\nTime: ${time} `;

        // open gmail in browser
        const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(receiverEmail)}&cc=&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
        handleClose();
    }

    useEffect(() => {
        if (userData?.email) {
            setReceiverEmail(userData.email);
        }
    }, [userData]);

    return (
        <>
            <button onClick={handleClickOpen}>Hire</button>

            <Dialog open={open} onClose={handleClose} className='hireDialog'>
                <form>
                    <h2>Fill in the form</h2>

                    <div>
                        <label>Receiver Email</label>
                        <input type='text' value={receiverEmail} disabled />
                    </div>

                    <div>
                        <label>Sender Email</label>
                        <input value={senderEmail} onChange={e => setSenderEmail(e.target.value)} type='email' label="Sender Email" />
                    </div>

                    <div>
                        <label>Message</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} type='text' label="Explain your proposal here" rows='5' />
                    </div>

                    <div className='dateTime'>
                        <div>
                            <label>Choose Date:</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div>
                            <label>Choose Time:</label>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} />
                        </div>
                    </div>

                    <button onClick={handleHireSubmit}>Send</button>
                </form>
            </Dialog>
        </>
    );
}