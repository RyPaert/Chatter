import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [connection, setConnection] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        fetch("/messages")
            .then(res => res.json())
            .then(data => setMessages(data));

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7037/chatHub")
            .withAutomaticReconnect()
            .build();

        newConnection.on("ReceiveMessage", (user, messageText) => {
            setMessages(prev => [...prev, { user, messageText }]);
        });

        newConnection.start()
            .then(() => setConnected(true))
            .catch(err => console.error("Connection failed:", err));

        setConnection(newConnection);

        return () => {
            newConnection.stop();
        };
    }, []);

    const sendMessage = async () => {
        if (connection && connected && text) {
            await connection.invoke("SendMessage", "User", text);
            setText("");
        }
    };

    return (
        <div className="chat-container-body">
            <div className="chat-container">
                <ul>
                    {messages.map((m, i) => (
                        <li className="chat-info" key={i}>
                            <b className="chat-title">{m.user}</b> <br/>{m.messageText}
                        </li>                        
                    ))}
                </ul>
            </div>
            <div className="chat-field">
                <input value={text} onChange={e => setText(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
