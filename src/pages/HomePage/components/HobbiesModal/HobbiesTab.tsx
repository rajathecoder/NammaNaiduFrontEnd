import React from 'react';

interface HobbiesTabProps {
    selections: Set<string>;
    showMore: boolean;
    onToggleSelection: (item: string) => void;
    onToggleShowMore: () => void;
}

const HOBBIES = [
    'Acting', 'Adventure Sports', 'Alternative Healing / Medicine', 'Art / Handicraft',
    'Astrology', 'Baking', 'Bike / Car Enthusiast', 'Bird Watching',
    'Blogging / Video Blogging', 'Board Games', 'Book Clubs', 'Calligraphy',
    'Clubbing', 'Collectibles', 'Cooking', 'Dancing', 'Drawing / Painting',
    'Fashion / Style', 'Gardening', 'Gaming', 'Hiking / Trekking', 'Knitting / Crochet',
    'Meditation / Yoga', 'Photography', 'Pottery / Ceramics', 'Singing', 'Travel',
    'Volunteering', 'Writing', 'Watching TV / Movies'
];

const HobbiesTab: React.FC<HobbiesTabProps> = ({
    selections,
    showMore,
    onToggleSelection,
    onToggleShowMore,
}) => {
    const displayedHobbies = showMore ? HOBBIES : HOBBIES.slice(0, 20);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Choose Hobbies & Interests</h3>
            <div className="flex flex-wrap gap-3">
                {displayedHobbies.map((hobby) => (
                    <button
                        key={hobby}
                        type="button"
                        onClick={() => onToggleSelection(hobby)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                            selections.has(hobby)
                                ? 'bg-green-50 border-green-600 text-green-700 font-medium'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {hobby}
                    </button>
                ))}
            </div>
            {!showMore && (
                <button
                    type="button"
                    onClick={onToggleShowMore}
                    className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                    Show more <span>↓</span>
                </button>
            )}
        </div>
    );
};

export default HobbiesTab;
