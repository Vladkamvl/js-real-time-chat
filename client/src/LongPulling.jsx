import React from 'react';
import axios from "axios";

export default function LongPulling(){
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');

    React.useEffect(() => {
        subscribe();
    }, []);

    const subscribe = async () => {
        try{
            // const {data} = await axios.get('http://localhost:5000/get-message');
            const {data} = await axios.get('http://fe53-176-213-248-12.ngrok.io/get-message');
            setMessages(prev => [data, ...prev]);
            await subscribe();
        }catch (e) {
            setTimeout(() => {
                subscribe();
            }, 500);
        }
    };

    const sendMessage = async () => {
        let postData = {
            message: newMessage,
            id: Date.now(),
        };
        await axios.post('http://fe53-176-213-248-12.ngrok.io/new-message', postData);
    };

    return (
        <div className={'center'}>
            <div>
                <div className="form">
                    <input type="text"
                           value={newMessage}
                           onChange={e => setNewMessage(e.target.value)}
                    />
                    <button onClick={sendMessage} onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}>Send message</button>
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