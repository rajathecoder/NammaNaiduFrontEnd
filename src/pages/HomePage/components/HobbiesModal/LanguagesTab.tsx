import React from 'react';

interface LanguagesTabProps {
    selections: Set<string>;
    showMore: boolean;
    onToggleSelection: (item: string) => void;
    onToggleShowMore: () => void;
}

const LANGUAGES = [
    'Afrikaans', 'Angika', 'Arabic', 'Assamese', 'Awadhi', 'Bahasa',
    'Bengali', 'Bhojpuri', 'Bihari', 'Burmese', 'Cantonese', 'Chhattisgarhi',
    'Croatian', 'Danish', 'Dogri', 'Dutch', 'English', 'Finnish',
    'French', 'Garhwali', 'German', 'Greek', 'Gujarati', 'Haryanvi',
    'Hebrew', 'Himachali', 'Hindi', 'Italian', 'Japanese', 'Kannada',
    'Kashmiri', 'Konkani', 'Korean', 'Malayalam', 'Marathi', 'Nepali',
    'Oriya', 'Punjabi', 'Rajasthani', 'Russian', 'Sanskrit', 'Sindhi',
    'Spanish', 'Tamil', 'Telugu', 'Urdu'
];

const LanguagesTab: React.FC<LanguagesTabProps> = ({
    selections,
    showMore,
    onToggleSelection,
    onToggleShowMore,
}) => {
    const displayedLanguages = showMore ? LANGUAGES : LANGUAGES.slice(0, 25);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Choose the languages you know</h3>
            <div className="flex flex-wrap gap-3">
                {displayedLanguages.map((language) => (
                    <button
                        key={language}
                        type="button"
                        onClick={() => onToggleSelection(language)}
                        className={`px-4 py-2 rounded-full border-2 transition-all ${
                            selections.has(language)
                                ? 'bg-green-50 border-green-600 text-green-700 font-medium'
                                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {language}
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

export default LanguagesTab;
