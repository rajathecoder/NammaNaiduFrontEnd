import React from 'react';
import type { HobbyTab, HobbySelections, ShowMoreStates } from '../../types';
import HobbiesTab from './HobbiesTab';
import MusicTab from './MusicTab';
import ReadingTab from './ReadingTab';
import MoviesTab from './MoviesTab';
import SportsTab from './SportsTab';
import FoodTab from './FoodTab';
import LanguagesTab from './LanguagesTab';

interface HobbiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: HobbyTab;
    onTabChange: (tab: HobbyTab) => void;
    selections: HobbySelections;
    showMoreStates: ShowMoreStates;
    onToggleSelection: (item: string, category: 'hobbies' | 'music' | 'books' | 'movies' | 'sports' | 'cuisines' | 'languages') => void;
    onToggleShowMore: (category: keyof ShowMoreStates) => void;
    onSubmit: () => void;
}

const HobbiesModal: React.FC<HobbiesModalProps> = ({
    isOpen,
    onClose,
    activeTab,
    onTabChange,
    selections,
    showMoreStates,
    onToggleSelection,
    onToggleShowMore,
    onSubmit,
}) => {
    if (!isOpen) return null;

    const tabs: { key: HobbyTab; label: string }[] = [
        { key: 'hobbies', label: 'Hobbies & Interests' },
        { key: 'music', label: 'Music' },
        { key: 'reading', label: 'Reading' },
        { key: 'movies', label: 'Movies And TV Shows' },
        { key: 'sports', label: 'Sports And Fitness' },
        { key: 'food', label: 'Food' },
        { key: 'languages', label: 'Spoken Languages' },
    ];

    return (
        <div
            className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-[2000] p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Select your interests</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            className={`px-6 py-3 font-semibold whitespace-nowrap transition-colors duration-200 border-b-2 ${activeTab === tab.key
                                ? 'border-green-600 text-green-600'
                                : 'border-transparent text-gray-600 hover:text-gray-800'
                                }`}
                            onClick={() => onTabChange(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'hobbies' && (
                        <HobbiesTab
                            selections={selections.hobbies}
                            showMore={showMoreStates.hobbies}
                            onToggleSelection={(item) => onToggleSelection(item, 'hobbies')}
                            onToggleShowMore={() => onToggleShowMore('hobbies')}
                        />
                    )}
                    {activeTab === 'music' && (
                        <MusicTab
                            selections={selections.musicGenres}
                            showMore={showMoreStates.music}
                            onToggleSelection={(item) => onToggleSelection(item, 'music')}
                            onToggleShowMore={() => onToggleShowMore('music')}
                        />
                    )}
                    {activeTab === 'reading' && (
                        <ReadingTab
                            selections={selections.bookTypes}
                            showMore={showMoreStates.books}
                            onToggleSelection={(item) => onToggleSelection(item, 'books')}
                            onToggleShowMore={() => onToggleShowMore('books')}
                        />
                    )}
                    {activeTab === 'movies' && (
                        <MoviesTab
                            selections={selections.movieTypes}
                            showMore={showMoreStates.movies}
                            onToggleSelection={(item) => onToggleSelection(item, 'movies')}
                            onToggleShowMore={() => onToggleShowMore('movies')}
                        />
                    )}
                    {activeTab === 'sports' && (
                        <SportsTab
                            selections={selections.sports}
                            showMore={showMoreStates.sports}
                            onToggleSelection={(item) => onToggleSelection(item, 'sports')}
                            onToggleShowMore={() => onToggleShowMore('sports')}
                        />
                    )}
                    {activeTab === 'food' && (
                        <FoodTab
                            selections={selections.cuisines}
                            showMore={showMoreStates.cuisines}
                            onToggleSelection={(item) => onToggleSelection(item, 'cuisines')}
                            onToggleShowMore={() => onToggleShowMore('cuisines')}
                        />
                    )}
                    {activeTab === 'languages' && (
                        <LanguagesTab
                            selections={selections.languages}
                            showMore={showMoreStates.languages}
                            onToggleSelection={(item) => onToggleSelection(item, 'languages')}
                            onToggleShowMore={() => onToggleShowMore('languages')}
                        />
                    )}
                </div>

                {/* Submit Button */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onSubmit}
                        className="w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HobbiesModal;

