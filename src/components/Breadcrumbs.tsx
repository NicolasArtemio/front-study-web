import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeNames: Record<string, string> = {
  practice: "Practice",
  outdoor: "Outdoor",
  daily: "Daily",
  work: "Work",
  logs: "Logs",
  vocabulary: "Vocabulary",
  mistakes: "Mistakes",
  recommendations: "Recommendations",
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on home page
  if (pathnames.length === 0) return null;

  const buildPath = (index: number) => {
    return "/" + pathnames.slice(0, index + 1).join("/");
  };

  const formatName = (name: string) => {
    // Check if it's a phrase ID (number)
    if (/^\d+$/.test(name)) {
      return `Phrase #${name}`;
    }
    return routeNames[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <nav className="flex items-center gap-1 text-sm mb-4" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>

      {pathnames.map((name, index) => {
        const isLast = index === pathnames.length - 1;
        const path = buildPath(index);

        return (
          <div key={path} className="flex items-center gap-1">
            <ChevronRight className="w-4 h-4 text-slate-600" />
            {isLast ? (
              <span className="text-purple-600 font-medium">
                {formatName(name)}
              </span>
            ) : (
              <Link
                to={path}
                className="text-cyan-600 dark:text-cyan-400 hover:text-purple-600 transition-colors capitalize"
              >
                {formatName(name)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
