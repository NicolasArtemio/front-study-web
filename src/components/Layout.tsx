import type { ReactNode } from "react";
import Navbar from "./navbar/Navbar";
import Breadcrumbs from "./Breadcrumbs";
import ThemeToggleButton from "./themeToggleButton/themeToggleButton";

interface LayoutProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
}

export default function Layout({ children, showBreadcrumbs = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggleButton />
      <Navbar />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {showBreadcrumbs && <Breadcrumbs />}
          {children}
        </div>
      </main>
    </div>
  );
}
