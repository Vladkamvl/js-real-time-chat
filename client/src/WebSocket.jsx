import React from 'react';
import axios from "axios";

export default function WebSock(){
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [isConnected, setIsConnected] = React.useState(false);

    const socket = React.useRef();

    const sendMessage = async () => {
        const message = {
            event: 'message',
            username: username,
            message: newMessage,
            id: Date.now(),
        };
        socket.current.send(JSON.stringify(message));
    };

    const login = () => {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setIsConnected(true);

            const message = {
                event: 'connection',
                username: username,
                id: Date.now(),
            }

            console.log('connect is true');

            socket.current.send(JSON.stringify(message));
        };

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        };

        socket.current.onclose = () => {
            console.log('socket is close');
        };

        socket.current.onerror = () => {
            console.log('error in socket');
        };
    }

    if(!isConnected){
        return (
            <div className={'center'}>
                <div>
                    <div className="form">
                        <input type="text"
                               value={username}
                               placeholder={'Your name'}
                               onChange={e => setUsername(e.target.value)}
                        />
                        <button onClick={login}>Login</button>
                    </div>
                </div>
            </div>
        );
    }

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
                                { mess.event === 'connection'
                                    ? <div className="connection_message">
                                        Пользователь {mess.username} подключился
                                    </div>
                                    : <div>
                                            {mess.username}<br/> {mess.message}
                                        </div>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}