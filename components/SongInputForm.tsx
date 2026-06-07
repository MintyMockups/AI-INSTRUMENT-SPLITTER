import React, { useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { MusicIcon } from './icons/MusicIcon';

interface SongInputFormProps {
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
  onSubmit: () => void;
  isLoading: boolean;
}

export const SongInputForm: React.FC<SongInputFormProps> = ({
  onFileChange,
  selectedFile,
  onSubmit,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        onFileChange(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit();
    }
  };

  const clearFile = () => {
    onFileChange(null);
  }

  const dragClasses = isDragging ? 'border-purple-500 bg-gray-700/50' : 'border-gray-600';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700">
      <div
        className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed ${dragClasses} rounded-lg cursor-pointer transition-colors duration-200`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
            id="file-upload"
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileSelect}
            accept="audio/mpeg, audio/wav, audio/ogg, audio/mp3"
            disabled={isLoading || !!selectedFile}
        />
        {selectedFile ? (
            <div className="text-center">
                <MusicIcon className="w-12 h-12 mx-auto text-purple-400 mb-2"/>
                <p className="font-semibold text-gray-200">{selectedFile.name}</p>
                <p className="text-sm text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
        ) : (
            <div className="text-center text-gray-400">
                <UploadIcon className="w-12 h-12 mx-auto mb-2"/>
                <p className="font-semibold text-gray-200">Drag & drop a song file</p>
                <p>or <span className="text-purple-400 font-medium">click to browse</span></p>
                <p className="text-xs mt-2 text-gray-500">MP3, WAV, OGG supported</p>
            </div>
        )}
      </div>

      {selectedFile && (
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
                type="submit"
                disabled={isLoading || !selectedFile}
                className="w-full flex justify-center items-center font-bold text-lg px-6 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50"
            >
                {isLoading ? 'Analyzing...' : 'Analyze Song'}
            </button>
            <button
                type="button"
                onClick={clearFile}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-4 rounded-lg bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
                Clear
            </button>
        </div>
      )}
    </form>
  );
};