import React from 'react';

interface FoodTabProps {
    selections: Set<string>;
    showMore: boolean;
    onToggleSelection: (item: string) => void;
    onToggleShowMore: () => void;
}

const CUISINES = [
    'American', 'Arabic', 'Bengali', 'Brazilian', 'Chinese', 'Continental',
    'French', 'Greek', 'Gujarati', 'Indian', 'Italian', 'Japanese',
    'Korean', 'Mediterranean', 'Mexican', 'North Indian', 'Punjabi',
    'South Indian', 'Thai', 'Vegetarian', 'Vegan'
];

const FoodTab: React.FC<FoodTabProps> = ({
    selections,
    showMore,
    onToggleSelection,
    onToggleShowMore,
}) => {
    const displayedCuisines = showMore ? CUISINES : CUISINES.slice(0, 15);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Choose your favourite cuisine</h3>
            <div className="flex flex-wrap gap-3">
                {displayedCuisines.map((cuisine) => (
                    <button
                        key={cuisine}
                        type="button"
                        onClick={() => onToggleSelection(cuisine)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                            selections.has(cuisine)
                                ? 'bg-green-50 border-green-600 text-green-700 font-medium'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {cuisine}
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

export default FoodTab;

