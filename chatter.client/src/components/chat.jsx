import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [username, setUsername] = useState("")
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/messages`)
            .then(res => res.json())
            .then(data => setMessages(data));

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7037/chatHub")
            .withAutomaticReconnect()
            .build();

        newConnection.on("ReceiveMessage", (user, messageText, id) => {
            setMessages(prev => [...prev, { id, user, messageText }]);
        });

        newConnection.start()
            .catch(err => console.error("Connection failed:", err));


        return () => {
            newConnection.stop();
        };
    }, []);

    const sendMessage = async () => {
        if (username === "") {
            alert("Please enter your username before sending a message");
            return;
        }
        await fetch(`${apiUrl}/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: "User", messageText: text })
        });
        setText("");
    };
    const handleSetUsername = () => {
        const name = prompt("enter your username:");
        if (name) {
            setUsername(name);
            setIsUsernameSet(true);
        }
    };
    const deleteMessage = async (id) => {
        await fetch(`${apiUrl}/messages/${id}`, {
            method: "DELETE",
        });
        setMessages(prevMessages => prevMessages.filter(m => m.id !== id));
    };


    if (!isUsernameSet) {
        return (
            <div className="chat-container-body-username">
                <div className="chat-container-username">
                    <h2 className="username-title-warning">Please enter your username</h2>
                    <button className="username-button-send" onClick={handleSetUsername} >
                        send
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container-body">
            <div className="chat-container">
                <ul>
                    {messages.map((m) => (
                        <li className="chat-info" key={m.id}>  
                            <div className="chat-text">
                                <b className="chat-title">{m.user}</b><br></br>
                                <span>{m.messageText}</span>
                            </div>
                            <button onClick={() => deleteMessage(m.id)}>Delete</button>
                        </li>                       
                    ))}
                </ul>
            </div>
            <div className="chat-field">
                <input value={text} onChange={e => setText(e.target.value)} disabled={username === ""} />
                <button onClick={sendMessage} disabled={username === "" || text === ""}>Send</button>
            </div>
        </div>
    );
}
