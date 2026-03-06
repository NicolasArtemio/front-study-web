import type { JSX } from "react";
import { Link } from "react-router-dom";
import { useStats } from "../../hooks/useStats";

export const ActivityCards = (): JSX.Element => {
    const stats = useStats();

    const activityCards = [
        {
            icon: "📖",
            title: "Vocabulary",
            stat: `${stats.totalWords} palabras`,
            link: "/vocabulary",
            color: "from-purple-600 to-purple-700",
        },
        {
            icon: "❌",
            title: "Mistakes",
            stat: `${stats.pendingMistakes} pendientes`,
            link: "/mistakes",
            color: "from-red-600 to-red-700",
        },
        {
            icon: "🎤",
            title: "Practice",
            stat: "Quick Start",
            link: "/practice",
            color: "from-cyan-600 to-cyan-700",
        },
        {
            icon: "💡",
            title: "Recommendations",
            stat: "Phrasal Verbs",
            link: "/recommendations",
            color: "from-pink-600 to-pink-700",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4">
            {activityCards.map((card) => (
                <Link
                    to={card.link}
                    key={card.title}
                    className="group bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-700 hover:border-purple-500 hover:bg-slate-700/50 transition-all cursor-pointer"
                >
                    <div className="text-4xl mb-3">{card.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
                    <p className="text-sm text-slate-400 group-hover:text-purple-400 transition-colors">
                        {card.stat}
                    </p>
                </Link>
            ))}
        </div>
    );
};
