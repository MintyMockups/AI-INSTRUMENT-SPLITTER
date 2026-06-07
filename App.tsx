import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SongInputForm } from './components/SongInputForm';
import { Loader } from './components/Loader';
import { InstrumentStem } from './components/InstrumentStem';
import { analyzeSong } from './services/geminiService';
import { InstrumentAnalysis } from './types';
import { MusicIcon } from './components/icons/MusicIcon';

const App: React.FC = () => {
  const [songFile, setSongFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<InstrumentAnalysis[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (songFile) {
        const objectUrl = URL.createObjectURL(songFile);
        const audio = new Audio(objectUrl);
        audioRef.current = audio;

        const handleSongEnd = () => setCurrentlyPlaying(null);
        audio.addEventListener('ended', handleSongEnd);

        return () => {
            audio.pause();
            audio.removeEventListener('ended', handleSongEnd);
            URL.revokeObjectURL(objectUrl);
            audioRef.current = null;
        };
    }
  }, [songFile]);

  const handleAnalysis = useCallback(async () => {
    if (!songFile) {
      setError('Please select a song file to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    
    if (audioRef.current) {
        audioRef.current.pause();
    }
    setCurrentlyPlaying(null);

    try {
      const result = await analyzeSong(songFile.name);
      setAnalysis(result);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to analyze the song. The model may be unable to identify this track or an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [songFile]);

  const handlePlayToggle = useCallback((instrumentName: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentlyPlaying === instrumentName) {
      audio.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audio.paused) {
        audio.play().catch(e => console.error("Error playing audio:", e));
      }
      setCurrentlyPlaying(instrumentName);
    }
  }, [currentlyPlaying]);
  
  const handleFileChange = useCallback((file: File | null) => {
    if (audioRef.current) {
        audioRef.current.pause();
        setCurrentlyPlaying(null);
    }
    setSongFile(file);
    if (analysis || error) {
        setAnalysis(null);
        setError(null);
    }
  }, [analysis, error]);

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">{error}</div>;
    }
    if (analysis) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {analysis.map((item) => (
            <InstrumentStem
              key={item.instrument}
              instrument={item.instrument}
              description={item.description}
              isPlaying={currentlyPlaying === item.instrument}
              onPlayToggle={() => handlePlayToggle(item.instrument)}
            />
          ))}
        </div>
      );
    }
    return (
       <div className="text-center text-gray-400 flex flex-col items-center gap-4">
          <MusicIcon className="w-24 h-24 text-gray-600"/>
          <p className="text-lg">Upload a song file to begin the AI analysis.</p>
          <p className="text-sm text-gray-500">The AI will identify the song from its filename and break it down into core components.</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              AI Instrument Splitter
            </span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Upload any song file. Our AI will analyze the track based on its name and describe each instrument's role, from drums to vocals and FX.
          </p>
        </header>

        <main>
          <div className="max-w-2xl mx-auto mb-12">
            <SongInputForm
              selectedFile={songFile}
              onFileChange={handleFileChange}
              onSubmit={handleAnalysis}
              isLoading={isLoading}
            />
          </div>
          
          <div className="mt-8">
            {renderContent()}
          </div>
        </main>
         <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>Powered by Gemini. The AI provides a descriptive analysis. The play button plays the original uploaded track.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;