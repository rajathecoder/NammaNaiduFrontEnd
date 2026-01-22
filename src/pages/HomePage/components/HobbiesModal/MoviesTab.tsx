import React from 'react';

interface MoviesTabProps {
    selections: Set<string>;
    showMore: boolean;
    onToggleSelection: (item: string) => void;
    onToggleShowMore: () => void;
}

const MOVIE_TYPES = [
    'Action', 'Anime', 'Classics', 'Comedy', 'Documentaries', 'Drama',
    'Epics', 'Fantasy', 'Horror', 'Movie Fanatic', 'Neo-Noir',
    'Non-Commercial / Art', 'Romantic', 'Romantic Comedies', 'Sci-Fi',
    'Short Films', 'Thriller / Suspense', 'War Movies'
];

const MoviesTab: React.FC<MoviesTabProps> = ({
    selections,
    showMore,
    onToggleSelection,
    onToggleShowMore,
}) => {
    const displayedMovies = showMore ? MOVIE_TYPES : MOVIE_TYPES.slice(0, 12);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Choose the type of movies you watch</h3>
            <div className="flex flex-wrap gap-3">
                {displayedMovies.map((movie) => (
                    <button
                        key={movie}
                        type="button"
                        onClick={() => onToggleSelection(movie)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                            selections.has(movie)
                                ? 'bg-green-50 border-green-600 text-green-700 font-medium'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {movie}
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

export default MoviesTab;

