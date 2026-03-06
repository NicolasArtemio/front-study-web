import { useState, useRef, useEffect } from "react";
import type { JSX } from "react";
import { Plus, X, Pencil, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FAB = (): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleActionClick = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end" ref={containerRef}>
            {/* Menu Options Modal */}
            <div
                className={`mb-4 flex flex-col items-end gap-3 transition-all duration-300 origin-bottom-right ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
                    }`}
            >
                <button
                    onClick={() => handleActionClick("/vocabulary")}
                    className="flex items-center gap-3 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg shadow-lg hover:bg-slate-700 transition"
                >
                    <span className="font-medium">Añadir palabra</span>
                    <BookOpen className="w-5 h-5 text-purple-400" />
                </button>

                <button
                    onClick={() => handleActionClick("/mistakes")}
                    className="flex items-center gap-3 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg shadow-lg hover:bg-slate-700 transition"
                >
                    <span className="font-medium">Registrar error</span>
                    <X className="w-5 h-5 text-red-500" />
                </button>

                <button
                    onClick={() => handleActionClick("/logs")}
                    className="flex items-center gap-3 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg shadow-lg hover:bg-slate-700 transition"
                >
                    <span className="font-medium">Crear log</span>
                    <Pencil className="w-5 h-5 text-cyan-400" />
                </button>
            </div>

            {/* Main FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-[0_10px_25px_-5px_rgba(168,85,247,0.5)] hover:scale-110 transition-transform focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                aria-label="Actions menu"
            >
                <div className={`transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>
                    <Plus size={28} />
                </div>
            </button>
        </div>
    );
};
