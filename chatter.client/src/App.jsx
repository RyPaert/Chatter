import Chat from './components/chat.jsx';
import './App.css'

export default function App() {
    return (
        <div className="App">
        <button className="button_for_name">User name</button>
            <h1 className="chat-bigTitle">Live Chat</h1>
            <Chat />
        </div>
    );
}

