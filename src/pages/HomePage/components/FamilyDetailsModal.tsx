import React from 'react';
import type { FamilyData, Sibling } from '../types';

interface FamilyDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: FamilyData;
    newSibling: Sibling;
    onChange: (data: FamilyData) => void;
    onSiblingChange: (sibling: Sibling) => void;
    onAddSibling: () => void;
    onRemoveSibling: (index: number) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
}

const FamilyDetailsModal: React.FC<FamilyDetailsModalProps> = ({
    isOpen,
    onClose,
    data,
    newSibling,
    onChange,
    onSiblingChange,
    onAddSibling,
    onRemoveSibling,
    onSubmit,
}) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const handleSiblingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onSiblingChange({ ...newSibling, [name]: value });
    };

    return (
        <div
            className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-[2000] p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Family Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Father Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Father Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Father Name
                                </label>
                                <input
                                    type="text"
                                    name="fatherName"
                                    value={data.fatherName}
                                    onChange={handleChange}
                                    placeholder="Enter father's name"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Father Occupation
                                </label>
                                <input
                                    type="text"
                                    name="fatherOccupation"
                                    value={data.fatherOccupation}
                                    onChange={handleChange}
                                    placeholder="Enter father's occupation"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Father Status
                                </label>
                                <select
                                    name="fatherStatus"
                                    value={data.fatherStatus}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                >
                                    <option value="alive">Alive</option>
                                    <option value="late">Late</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Mother Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mother Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mother Name
                                </label>
                                <input
                                    type="text"
                                    name="motherName"
                                    value={data.motherName}
                                    onChange={handleChange}
                                    placeholder="Enter mother's name"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mother Occupation
                                </label>
                                <input
                                    type="text"
                                    name="motherOccupation"
                                    value={data.motherOccupation}
                                    onChange={handleChange}
                                    placeholder="Enter mother's occupation"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mother Status
                                </label>
                                <select
                                    name="motherStatus"
                                    value={data.motherStatus}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                >
                                    <option value="alive">Alive</option>
                                    <option value="late">Late</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Siblings */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Siblings</h3>
                        <div className="space-y-3 mb-4">
                            {data.siblings.map((sibling, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <span className="font-medium text-gray-800">{sibling.name}</span>
                                        {sibling.gender && <span className="text-gray-600 ml-2">({sibling.gender})</span>}
                                        {sibling.occupation && <span className="text-gray-500 ml-2">- {sibling.occupation}</span>}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onRemoveSibling(index)}
                                        className="text-red-600 hover:text-red-800 px-2 py-1 rounded transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
                            <input
                                type="text"
                                name="name"
                                placeholder="Sibling Name"
                                value={newSibling.name}
                                onChange={handleSiblingChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                            />
                            <select
                                name="gender"
                                value={newSibling.gender}
                                onChange={handleSiblingChange}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="occupation"
                                    placeholder="Occupation (Optional)"
                                    value={newSibling.occupation || ''}
                                    onChange={handleSiblingChange}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-700 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={onAddSibling}
                                    className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1B5E20] to-[#0D3B13] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FamilyDetailsModal;

