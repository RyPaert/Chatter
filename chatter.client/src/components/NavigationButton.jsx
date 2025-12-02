import { useNavigate } from "react-router-dom";

export default function NavigationButton({ to, buttonText }) {
    let navigate = useNavigate();
    return (
        <button onClick={() => navigate(to)}>
            {buttonText}
        </button>
    )
}