export default function Loading() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-4">
        <div className="w-16 h-16 border-t-4 border-violet-600 border-solid rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-bold mb-4 text-center">Preparing your mentorship session...</h2>
        <div className="w-full max-w-md h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-600 animate-pulse"></div>
        </div>
      </div>
    );
  }