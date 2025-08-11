import { useTheme } from "../../context/ThemeContext";


function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button className="cursor-pointer" onClick={toggleTheme}>
            💡Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    )
}

export default ThemeToggleButton