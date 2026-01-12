import React from 'react';

interface MusicTabProps {
    selections: Set<string>;
    showMore: boolean;
    onToggleSelection: (item: string) => void;
    onToggleShowMore: () => void;
}

const MUSIC_GENRES = [
    'Bhangra', 'Bluegrass', 'Blues', 'Christian / Gospel', 'Classical', 'Country',
    'Electronic / EDM', 'Folk', 'Hip Hop / Rap', 'Indian Classical', 'Jazz',
    'Latin', 'Metal', 'Pop', 'R&B / Soul', 'Reggae', 'Rock', 'World Music'
];

const MusicTab: React.FC<MusicTabProps> = ({
    selections,
    showMore,
    onToggleSelection,
    onToggleShowMore,
}) => {
    const displayedGenres = showMore ? MUSIC_GENRES : MUSIC_GENRES.slice(0, 12);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Choose the music genre</h3>
            <div className="flex flex-wrap gap-3">
                {displayedGenres.map((genre) => (
                    <button
                        key={genre}
                        type="button"
                        onClick={() => onToggleSelection(genre)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                            selections.has(genre)
                                ? 'bg-green-50 border-green-600 text-green-700 font-medium'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {genre}
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

export default MusicTab;
