import React from 'react';
import axios from "axios";

export default function EventSourcing(){
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');

    React.useEffect(() => {
        subscribe();
    }, []);

    const subscribe = async () => {
        const eventSource = new EventSource('http://localhost:5000/connect');
        eventSource.onmessage = function (event){
            setMessages(prev=>[JSON.parse(event.data), ...prev]);
        };
    };

    const sendMessage = async () => {
        let postData = {
            message: newMessage,
            id: Date.now(),
        };
        await axios.post('http://localhost:5000/new-message', postData);
    };

    return (
        <div className={'center'}>
            <div>
                <div className="form">
                    <input type="text"
                           value={newMessage}
                           onChange={e => setNewMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send message</button>
                </div>
                <div className="messages">
                    {
                        messages.map(mess => (
                            <div className={'message'} key={mess.id}>
                                {mess.message}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}