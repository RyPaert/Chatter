import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [username, setUsername] = useState("");
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        
        fetch(`${apiUrl}/messages`)
            .then((res) => res.json())
            .then((data) => setMessages(data));

        
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${apiUrl}/chatHub`)
            .withAutomaticReconnect()
            .build();

      
        connection.on("ReceiveMessage", (user, messageText, id) => {
            setMessages((prev) => [...prev, { id, user, messageText }]);
        });

      
        connection.on("MessageDeleted", (id) => {
            setMessages((prev) => prev.filter((m) => m.id !== id));
        });

     
        connection.start().catch((err) => console.error("Connection failed:", err));

        return () => {
            connection.stop();
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
            body: JSON.stringify({ user: username, messageText: text }) 
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
        const ok = window.confirm("are u sure u want to DELETE this message?");
        if (!ok) return;
        await fetch(`${apiUrl}/messages/${id}?user=${username}`, {
            method: "DELETE"
        });

    };

    if (!isUsernameSet) {
        return (
            <div className="chat-container-body-username">
                <div className="chat-container-username">
                    <h2 className="username-title-warning">Please enter your username</h2>
                    <button className="button-primary" onClick={handleSetUsername}>
                        enter
                    </button>
                </div>
            </div>
        );
    }
    const logout = () => {
        setUsername("");      
        setIsUsernameSet(false);  
        setText("");          

    };


    return (
        <div className="chat-container-body">
            <div className="chat-container-header">
                <button className="logout-button" onClick={logout}>Log out</button>
            </div>

            <div className="chat-container">
                <ul>
                    {messages.map((m) => (
                        <li className="chat-info" key={m.id}>
                            <div className="chat-text">
                                <b className="chat-title">{m.user}</b>
                                <br />
                                <span>{m.messageText}</span>
                            </div>
                            {m.user === username && (
                                <button onClick={() => deleteMessage(m.id)}>Delete</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-field">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" ? sendMessage() : ""}
                    disabled={username === ""}
                />
                <button  onClick={sendMessage} disabled={username === "" || text === ""}>
                    Send
                </button>
            </div>
        </div>
    );
}
