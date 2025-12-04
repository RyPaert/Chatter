import ChatPage from './pages/ChatPage.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Router>
    );
}
