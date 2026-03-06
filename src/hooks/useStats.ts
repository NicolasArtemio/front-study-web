export const useStats = () => {
    return {
        streak: 7,
        dailyGoal: { completed: 3, total: 5 },
        totalWords: 124,
        pendingMistakes: 3,
        recentMistakes: [
            { id: 1, mistake: 'I go to home', correction: 'I go home' },
            { id: 2, mistake: "She don't like", correction: "She doesn't like" },
            { id: 3, mistake: 'I am agree', correction: 'I agree' },
            { id: 4, mistake: 'Depend of', correction: 'Depend on' },
            { id: 5, mistake: 'Explain me', correction: 'Explain to me' },
        ]
    };
};
