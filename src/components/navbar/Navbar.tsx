import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Home, BookOpen, X, Menu, Mic, AlertCircle, Lightbulb, PenTool, LogOut } from "lucide-react";

const navLinks = [
  { path: "/", label: "Home", icon: Home },
  { path: "/logs", label: "Logs", icon: BookOpen },
  { path: "/vocabulary", label: "Vocabulary", icon: PenTool },
  { path: "/mistakes", label: "Mistakes", icon: AlertCircle },
  { path: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { path: "/practice", label: "Practice", icon: Mic },
];

export default function Navbar() {
  const { theme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const bgClass = theme === "light"
    ? "bg-white/80 border-gray-200"
    : "bg-gray-900/80 border-gray-700";

  const textClass = theme === "light"
    ? "text-gray-800"
    : "text-white";

  const hoverClass = theme === "light"
    ? "hover:bg-gray-100"
    : "hover:bg-gray-800";

  const handleLogin = () => {
    window.location.href = "http://localhost:3000/api/v1/auth/google";
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${bgClass} backdrop-blur-md border-b transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-2 font-bold text-xl ${textClass} transition-colors`}>
            <span className="text-2xl">📚</span>
            <span className="hidden sm:inline">StudyApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${isActive(path)
                        ? "text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400"
                        : "text-slate-600 dark:text-slate-400 border-transparent hover:text-purple-600 dark:hover:text-purple-400"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className={`text-sm font-medium ${textClass}`}>{user?.name}</span>
                <button
                  onClick={logout}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium ${textClass} ${hoverClass} rounded-lg`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Login with Google
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg ${textClass} ${hoverClass}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <ul className="flex flex-col gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 border-l-4 ${isActive(path)
                        ? "text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20"
                        : "text-slate-600 dark:text-slate-400 border-transparent hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Mobile Auth */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium w-full ${textClass}`}
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg"
                >
                  Login with Google
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
