import { useRef } from "react";
import { useSpeech } from "../../hooks/use-speech";

export const ChatInterface = ({ hidden, type ,containerClassName = "", showHeader = true, ...props }) => {
  const input = useRef();
  const { tts, loading, message, startRecording, stopRecording, recording } = useSpeech();
  
  

  // Add console logs to debug recording state
  const handleRecording = () => {
    if (recording) {
      console.log('Stopping recording...');
      stopRecording();
    } else {
      console.log('Starting recording...');
      startRecording();
    }
  };

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      tts(text,type);
      input.current.value = "";
    }
  };
  
  if (hidden) {
    return null;
  }

  return (
    <div className={`flex flex-col w-full ${containerClassName}`}>
      {showHeader && (
        <div className="w-full backdrop-blur-lg bg-white/60 p-5 rounded-xl shadow-lg border border-white/20 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="font-black text-xl text-gray-800">AI Mentor</h1>
              <p className="text-gray-600 text-sm">
                {loading ? 
                  <span className="flex items-center">
                    Processing
                    <span className="ml-2 flex space-x-1">
                      <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                      <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></span>
                      <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></span>
                    </span>
                  </span> : 
                  "Type a message or use voice to chat with the AI"
                }
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Input section with improved styling */}
      <div className="flex items-center gap-3 w-full">
        <button
          onClick={handleRecording}
          disabled={loading || message}
          className={`flex-shrink-0 flex items-center justify-center rounded-full w-12 h-12 transition-all duration-200 ${
            recording 
              ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" 
              : "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
          } ${loading || message ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {recording ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          )}
        </button>

        <div className="relative flex-1">
          <input
            className="w-full p-3 pl-4 pr-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-white/20 placeholder:text-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Type your message here..."
            ref={input}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          {recording && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-red-500 font-medium">Recording</span>
              </div>
            </div>
          )}
        </div>
        
        <button
          disabled={loading || message}
          onClick={sendMessage}
          className={`flex-shrink-0 flex items-center justify-center rounded-full w-12 h-12 transition-all duration-200 ${
            loading || message 
              ? "bg-gray-400 opacity-50 cursor-not-allowed" 
              : "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/30"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" transform="rotate(90 10 10)" />
          </svg>
        </button>
      </div>
    </div>
  );
};
