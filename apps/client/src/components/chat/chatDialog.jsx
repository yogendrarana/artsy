import toast from 'react-hot-toast'
import { io }  from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

// import redux actions
import { getChatMessages, sendMessage, getMyChats } from '../../redux/slices/chatSlice.js';

// import css
import "swiper/css";
import './chatDialog.css'

// import components
import Message from './message';
import Participant from './participant';
import Dialog from '@mui/material/Dialog';

export default function ChatDialog() {
	const socket = useRef();
	const dispatch = useDispatch();
	const chatFeedRef = useRef(null);
	const [textMessage, setTextMessage] = useState('');
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [currentChatMessages, setCurrentChatMessages] = useState([]);

    const [openReviewDialog, setOpenReviewDialog] = useState(false);

	const {chats, chatMessages} = useSelector(state => state.chat);
	const {myData, isAuthenticated} = useSelector(state => state.auth);

    const handleClose = () => {setOpenReviewDialog(false)};
    const handleClickOpen = () => {setOpenReviewDialog(true)};


	// get my chats
	useEffect(() => {
		if (myData && myData._id) {
			dispatch(getMyChats(myData._id))
		}
	}, [dispatch, myData]);


	// get messages of specific chat
	useEffect(() =>{
		if(currentChat === null) return;
		dispatch(getChatMessages(currentChat._id));
	}, [currentChat, dispatch]);

	// update current chat message
	useEffect(() => {
		setCurrentChatMessages(chatMessages);
	}, [chatMessages]);


	// socket initialization 
	useEffect(() => {
		socket.current = io('http://localhost:8800');
		
		socket.current.on('getMessage', ({chatId, sender, receiver, text}) => {
			dispatch(getMyChats(myData._id));
			setArrivalMessage({chatId, sender, receiver, text})
		});
		
	}, [dispatch, myData._id]);

	// arrival message and current chat messages
	useEffect(() => {
		if (arrivalMessage) {
			if (currentChat && currentChat.participants.includes(arrivalMessage.sender)) {
				// should include this to reflect live change on receiver side
				setCurrentChatMessages(prev => [...prev, arrivalMessage]);
			}

			if (!openReviewDialog || currentChat === null || currentChat._id !== arrivalMessage.chatId) {
				toast.success("New message received.");
				setArrivalMessage(null)
			}

			setArrivalMessage(null)
		}
	}, [arrivalMessage, currentChat, openReviewDialog]);

	// add and get online users
	useEffect(() => {
		if(myData && myData._id){
			socket.current.emit('addOnlineUser', myData?._id);
			socket.current.on('getOnlineUsers', (onlineUsers) => {setOnlineUsers(onlineUsers)})
		}
	}, [myData]);


	// Scroll to the bottom of the chat feed when a new message is received or sent
	useEffect(() => {
		if (chatFeedRef.current) {
			chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
		}
	}, [currentChatMessages]);


	// handling the message send
	const handleSendMessage = async (e) => {
		e.preventDefault();

		// send message to socket io
		const sender = myData._id;
		const receiver = currentChat.participants.find(id => id !== myData._id);
		const message = {chatId: currentChat._id, sender, receiver, text: textMessage}
		socket.current.emit('sendMessage', message);
		
		// send message to backend
		dispatch(sendMessage(message)).then(() => {dispatch(getMyChats(myData._id));});

		// should include this to reflect live change on sender side
		setCurrentChatMessages(prev => [...prev, {chatId: currentChat._id, sender, receiver, text: textMessage}])

		setTextMessage('');
	}

    return (
        <>
            <button onClick={handleClickOpen}><i className="fa-regular fa-comment"></i></button>
            
            <Dialog className="chatDialogContainer" open={openReviewDialog} onClose={handleClose} BackdropProps={{ invisible: true }}> {/* BackdropProps={{ invisible: true }} */}
				<div className='chatBox'>
					<div className='chatHeading'>					
						<p>Chats</p>
						<i className="fa-solid fa-xmark" onClick={() => handleClose()}></i>
					</div>

					{!isAuthenticated && 
						<div className='loginFirst'>
							Please log in first to access <br /> chat feature.
						</div>
					}
					
					{isAuthenticated && 
						<div className='participants'> 
							{chats && chats.map((chat, index) => {
								return (
									<div onClick={() => setCurrentChat(chat)} key={index} className='participantContainer'>
										<Participant chat={chat} currentChat={currentChat} onlineUsers={onlineUsers}  />	
									</div>
								)
							})}
						</div>
					}

					{isAuthenticated && 
						<div className='chatFeed' ref={chatFeedRef}>
							{(currentChat === null) && <div className='noChat'>Please select the user <br />to send message.</div>}
							{(currentChat !== null) && !currentChatMessages.length && 
								<div className='noMessage'>
									<i className="fa-solid fa-comment-slash"></i>
									<p>No messages yet. <br />Please start typing your message.</p>
								</div>
							}
							{(currentChat !== null) && currentChatMessages.map((message, index) => {return <Message key={index} message={message} />})}
						</div>
					}
					
					<div className='chatInput'>
						<input type='text' placeholder='Message...' value={textMessage} onChange={(e) => setTextMessage(e.target.value)} />
						<button onClick={handleSendMessage} disabled={!currentChat || !textMessage}><i className="fa-solid fa-paper-plane"></i></button>
					</div>
				</div>  
            </Dialog>
        </>
    );
}