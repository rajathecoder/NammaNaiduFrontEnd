import React from 'react';

interface ReadingTabProps {
    selections: Set<string>;
    showMore: boolean;
    onToggleSelection: (item: string) => void;
    onToggleShowMore: () => void;
}

const BOOK_TYPES = [
    'Autobiographies / Biographies', 'Business / Professional', 'Classics',
    'Comics / Graphic Novels', 'Fantasy', 'Fiction', 'History', 'Humor',
    'Literature', 'Love Reading Almost Anything', 'Magazines / Newspapers',
    'Philosophy / Spiritual', 'Poetry', 'Romance', 'Science Fiction',
    'Self Help', 'Thriller / Mystery', 'Travel Books'
];

const ReadingTab: React.FC<ReadingTabProps> = ({
    selections,
    showMore,
    onToggleSelection,
    onToggleShowMore,
}) => {
    const displayedBooks = showMore ? BOOK_TYPES : BOOK_TYPES.slice(0, 12);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Choose the type of books you read</h3>
            <div className="flex flex-wrap gap-3">
                {displayedBooks.map((book) => (
                    <button
                        key={book}
                        type="button"
                        onClick={() => onToggleSelection(book)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                            selections.has(book)
                                ? 'bg-green-50 border-green-600 text-green-700 font-medium'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {book}
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

export default ReadingTab;

