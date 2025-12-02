import ChatPage from './pages/ChatPage.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

export default function App() {
    return (
    //    <div className="App">
    //        <h1 className="chat-bigTitle">Live Chat</h1>
    //        <Chat />
    //    </div>
    //);
    // chatbox code
        <Router>
            <Routes>
                <Route path="/" element={<ChatPage />} />
                {/*<Route path="/name" element={<RegisterPage />} />*/}
                <Route path="/Chat" element={<ChatPage />} />
            </Routes>
        </Router>
    );
}

