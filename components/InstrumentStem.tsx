import React from 'react';
import { InstrumentAnalysis } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { DrumIcon } from './icons/DrumIcon';
import { GuitarIcon } from './icons/GuitarIcon';
import { MicIcon } from './icons/MicIcon';
import { KeyboardIcon } from './icons/KeyboardIcon';
import { BassIcon } from './icons/BassIcon';
import { FxIcon } from './icons/FxIcon';
import { StringIcon } from './icons/StringIcon';
import { MusicIcon } from './icons/MusicIcon';

interface InstrumentStemProps extends InstrumentAnalysis {
  isPlaying: boolean;
  onPlayToggle: () => void;
}

const getInstrumentIcon = (instrumentName: string) => {
    const lowerInstrument = instrumentName.toLowerCase();
    if (lowerInstrument.includes('drum')) return <DrumIcon className="w-8 h-8"/>;
    if (lowerInstrument.includes('guitar')) return <GuitarIcon className="w-8 h-8"/>;
    if (lowerInstrument.includes('vocal')) return <MicIcon className="w-8 h-8"/>;
    if (lowerInstrument.includes('keyboard') || lowerInstrument.includes('synth')) return <KeyboardIcon className="w-8 h-8"/>;
    if (lowerInstrument.includes('bass')) return <BassIcon className="w-8 h-8"/>;
    if (lowerInstrument.includes('fx') || lowerInstrument.includes('effect')) return <FxIcon className="w-8 h-8"/>;
    if (lowerInstrument.includes('string') || lowerInstrument.includes('orchestra')) return <StringIcon className="w-8 h-8"/>;
    return <MusicIcon className="w-8 h-8"/>;
}


export const InstrumentStem: React.FC<InstrumentStemProps> = ({
  instrument,
  description,
  isPlaying,
  onPlayToggle,
}) => {
  const playingClasses = isPlaying 
    ? 'border-purple-500 ring-4 ring-purple-500/30' 
    : 'border-gray-700 hover:border-purple-600';

  return (
    <div className={`bg-gray-800 p-6 rounded-xl border ${playingClasses} transition-all duration-300 flex flex-col shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
            <div className="text-purple-400">
                {getInstrumentIcon(instrument)}
            </div>
            <h3 className="text-2xl font-bold text-gray-100">{instrument}</h3>
        </div>
        <button
          onClick={onPlayToggle}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 ${isPlaying ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-purple-600 hover:text-white'}`}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
        </button>
      </div>
      <p className="text-gray-400 flex-grow">{description}</p>
    </div>
  );
};
