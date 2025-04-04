export default function OnboardingHeader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
      <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm">
        <span className="flex h-2 w-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 mr-2"></span>
        <span className="text-zinc-400">Personalize Your Experience</span>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
          Let's Set Up Your
          {" "}
          <span className="underline decoration-purple-500/50 decoration-wavy">
           AI  Mentor
           </span>
        </h1>
        <p className="max-w-[900px] text-zinc-400 md:text-xl/relaxed">
          Answer a few questions to customize your learning experience
        </p>
      </div>
    </div>
  );
}