import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";



export default function Navbar() {
    const { theme } = useTheme();
    const hoverClass = theme === 'light' ? 'hover:text-gray-400' : 'hover:text-gray-400';

    return (
        <nav>
            <ul className="flex items-center justify-center gap-5 mt-4 text-lg uppercase roboto-mono ">
                <li className={`${hoverClass} cursor-pointer transition-colors`}>
                    <Link to="/">Inicio</Link>
                </li>
                <li className={`${hoverClass} cursor-pointer transition-colors`}>
                    <Link to="/logs">Logs</Link>
                </li>
                <li className={`${hoverClass} cursor-pointer transition-colors`}>
                    <Link to="/recommendations">recommendations</Link>
                </li>
                <li className={`${hoverClass} cursor-pointer transition-colors`}>
                    <Link to="/mistakes">Errores</Link>
                </li>
                <li className={`${hoverClass} cursor-pointer transition-colors`}>
                    <Link to="/vocabulary">Vocabulario</Link>
                </li>
            </ul>
        </nav>
    )
}
