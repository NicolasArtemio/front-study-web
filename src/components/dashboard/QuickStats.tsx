import type { JSX } from "react";
import { useStats } from "../../hooks/useStats";

export const QuickStats = (): JSX.Element => {
    const stats = useStats();
    const goalPercentage = (stats.dailyGoal.completed / stats.dailyGoal.total) * 100;

    return (
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Tu Progreso</h3>

            {/* Streak */}
            <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">🔥</div>
                <div>
                    <p className="text-2xl font-bold text-white">{stats.streak}</p>
                    <p className="text-sm text-slate-400">días seguidos</p>
                </div>
            </div>

            {/* Daily Goal */}
            <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Meta diaria</span>
                    <span className="text-purple-400 font-semibold">
                        {stats.dailyGoal.completed}/{stats.dailyGoal.total}
                    </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goalPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Total Words */}
            <div className="flex items-center gap-3">
                <div className="text-3xl">📚</div>
                <div>
                    <p className="text-2xl font-bold text-white">{stats.totalWords}</p>
                    <p className="text-sm text-slate-400">palabras aprendidas</p>
                </div>
            </div>
        </div>
    );
};
