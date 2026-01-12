import React from 'react';
import type { PhotoUpload, ProofPhoto } from '../types';

interface PhotoUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    personPhotos: PhotoUpload[];
    proofPhoto: ProofPhoto | null;
    uploading: boolean;
    onProfilePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onProofUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemovePhoto: (placement: number) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
}

const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
    isOpen,
    onClose,
    personPhotos,
    proofPhoto,
    uploading,
    onProfilePhotoUpload,
    onProofUpload,
    onRemovePhoto,
    onSubmit,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[2000] p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Upload Photos & Documents</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Profile Photos */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Profile Photos (Max 5)
                        </label>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {personPhotos.map((photo) => (
                                <div key={photo.photoplacement} className="relative shrink-0">
                                    <img
                                        src={photo.preview}
                                        alt={`Photo ${photo.photoplacement}`}
                                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onRemovePhoto(photo.photoplacement)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                    >
                                        ×
                                    </button>
                                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                        Photo {photo.photoplacement}
                                    </div>
                                </div>
                            ))}
                            {personPhotos.length < 5 && (
                                <label className="shrink-0 w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                    <div className="text-center">
                                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-xs text-gray-500">Add Photo</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onProfilePhotoUpload}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Proof Document */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Upload Aadhar card *
                        </label>
                        {proofPhoto ? (
                            <div className="relative inline-block">
                                <img
                                    src={proofPhoto.preview}
                                    alt="Proof"
                                    className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) {
                                                // Create a proper FileList-like object
                                                const fileList = {
                                                    0: file,
                                                    length: 1,
                                                    item: (index: number) => index === 0 ? file : null,
                                                    [Symbol.iterator]: function* () {
                                                        yield file;
                                                    }
                                                } as unknown as FileList;
                                                
                                                const event = {
                                                    target: { files: fileList, value: '' } as HTMLInputElement,
                                                    currentTarget: input,
                                                    bubbles: true,
                                                    cancelable: true,
                                                    defaultPrevented: false,
                                                    eventPhase: 0,
                                                    isTrusted: true,
                                                    nativeEvent: e,
                                                    preventDefault: () => {},
                                                    isDefaultPrevented: () => false,
                                                    stopPropagation: () => {},
                                                    isPropagationStopped: () => false,
                                                    persist: () => {},
                                                    timeStamp: Date.now(),
                                                    type: 'change',
                                                } as unknown as React.ChangeEvent<HTMLInputElement>;
                                                onProofUpload(event);
                                            }
                                        };
                                        input.click();
                                    }}
                                    className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-blue-600"
                                >
                                    ↻
                                </button>
                            </div>
                        ) : (
                            <label className="inline-block w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                                <div className="text-center">
                                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="text-sm text-gray-500">Upload Document</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={onProofUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading || !proofPhoto || personPhotos.length === 0}
                            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[#FB34AA] to-[#C204E7] text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Uploading...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PhotoUploadModal;
