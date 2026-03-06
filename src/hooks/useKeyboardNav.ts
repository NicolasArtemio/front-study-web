import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyboardNav() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs/textareas
            const target = e.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.isContentEditable
            ) {
                return;
            }

            if (e.key === "Escape") {
                navigate(-1);
            }

            if (e.altKey && e.key === "h") {
                e.preventDefault();
                navigate("/");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [navigate]);
}
