import React from 'react';

interface SportsTabProps {
    selections: Set<string>;
    showMore: boolean;
    onToggleSelection: (item: string) => void;
    onToggleShowMore: () => void;
}

const SPORTS = [
    'Aerobics', 'American Football', 'Archery', 'Badminton', 'Baseball',
    'Basketball', 'Billiards / Snooker / Pool', 'Bowling', 'Boxing',
    'Cricket', 'Cycling', 'Football', 'Golf', 'Gym / Bodybuilding',
    'Handball', 'Hockey', 'Horseback Riding', 'Jogging / Walking / Running',
    'Martial Arts', 'Rowing', 'Rugby', 'Running', 'Skating', 'Skiing',
    'Soccer', 'Swimming', 'Table Tennis', 'Tennis', 'Volleyball', 'Weightlifting'
];

const SportsTab: React.FC<SportsTabProps> = ({
    selections,
    showMore,
    onToggleSelection,
    onToggleShowMore,
}) => {
    const displayedSports = showMore ? SPORTS : SPORTS.slice(0, 20);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Select Sports/ Fitness Activities/ Games</h3>
            <div className="flex flex-wrap gap-3">
                {displayedSports.map((sport) => (
                    <button
                        key={sport}
                        type="button"
                        onClick={() => onToggleSelection(sport)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                            selections.has(sport)
                                ? 'bg-green-50 border-green-600 text-green-700 font-medium'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {sport}
                    </button>
                ))}
            </div>
            {!showMore && (
                <button
                    type="button"
                    onClick={onToggleShowMore}
                    className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
                >
                    Show more <span>↓</span>
                </button>
            )}
        </div>
    );
};

export default SportsTab;

