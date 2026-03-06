import type { JSX } from "react";
import { Link } from "react-router-dom";
import { useStats } from "../../hooks/useStats";

export const RecentMistakes = (): JSX.Element => {
    const stats = useStats();

    return (
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Últimos Errores</h3>

            <div className="space-y-3 flex-1 overflow-y-auto">
                {stats.recentMistakes.map((mistake) => (
                    <div
                        key={mistake.id}
                        className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-colors cursor-pointer"
                    >
                        <div className="text-xl">⚠️</div>
                        <div className="flex-1">
                            <p className="text-sm text-white font-medium">{mistake.mistake}</p>
                            <p className="text-xs text-slate-400 mt-1">{mistake.correction}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Link
                to="/mistakes"
                className="block text-center text-purple-400 hover:text-purple-300 text-sm mt-4 font-medium"
            >
                Ver todos →
            </Link>
        </div>
    );
};
