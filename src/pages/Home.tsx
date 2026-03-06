import type { JSX } from "react";
import Layout from "../components/Layout";
import { QuickStats } from "../components/dashboard/QuickStats";
import { ActivityCards } from "../components/dashboard/ActivityCards";
import { RecentMistakes } from "../components/dashboard/RecentMistakes";
import { FAB } from "../components/dashboard/FAB";
import { useStats } from "../hooks/useStats";

const Home = (): JSX.Element => {
  const stats = useStats();

  return (
    <Layout showBreadcrumbs={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Background Decorative Illustration */}
        <img
          src="/bg.webp"
          alt="mascot"
          className="fixed bottom-4 right-4 w-32 h-32 opacity-20 pointer-events-none z-0 object-contain"
        />

        <div className="relative z-10 w-full">
          {/* Header */}
          <div className="mb-8 mt-4 lg:mt-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">
              ¡Hola, Estudiante! 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
              Tienes{" "}
              <span className="text-purple-600 dark:text-purple-400 font-semibold">
                {stats.pendingMistakes} palabras
              </span>{" "}
              pendientes por repasar
            </p>
          </div>

          {/* 3-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Stats */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <QuickStats />
            </div>

            {/* Center Column: Activities */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <ActivityCards />
            </div>

            {/* Right Column: Mistake List */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <RecentMistakes />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FAB />
    </Layout>
  );
};

export default Home;
