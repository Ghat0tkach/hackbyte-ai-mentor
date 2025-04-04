export default function LogoSection() {
  return (
    <section className="w-full py-6 sm:py-8 border-y border-zinc-800 bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-wider font-medium">Trusted by innovative teams</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 opacity-70">
            {["Microsoft", "Google", "Amazon", "Meta", "Apple"].map((company) => (
              <div key={company} className="flex items-center justify-center">
                <span className="text-sm sm:text-base text-zinc-400 font-semibold">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}