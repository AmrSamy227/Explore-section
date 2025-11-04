import GameCard from '@/components/GameCard';
import { gamesLibrary } from '@/lib/gamesData';

export function generateStaticParams() {
  const developers = new Set<string>();

  gamesLibrary.forEach((game) => {
    const devs = Array.isArray(game.developer) ? game.developer : [game.developer];
    devs.forEach((dev) => developers.add(dev));
  });

  return Array.from(developers).map((developer) => ({
    slug: developer.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default function DeveloperPage({ params }: { params: { slug: string } }) {
  const games = gamesLibrary.filter((game) => {
    const devs = Array.isArray(game.developer) ? game.developer : [game.developer];
    return devs.some((dev) => dev.toLowerCase().replace(/\s+/g, '-') === params.slug);
  });

  // Get display name from the first matching game's developer list
  const matchedGame = games[0];
  let developerName = '';
  if (matchedGame) {
    const devs = Array.isArray(matchedGame.developer)
      ? matchedGame.developer
      : [matchedGame.developer];
    const found = devs.find(
      (dev) => dev.toLowerCase().replace(/\s+/g, '-') === params.slug
    );
    developerName = found || devs.join(', ');
  } else {
    developerName = params.slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const avgRating =
    games.length > 0
      ? (games.reduce((sum, g) => sum + g.rating, 0) / games.length).toFixed(1)
      : '0.0';

  return (
  <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
    <div className="max-w-[1400px] mx-auto">
      {/* Developer Title */}
      <h1 className="text-5xl font-bold mb-4 text-white slide-in">
        {developerName}
        <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
      </h1>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <p className="text-gray-400 text-lg">
          {games.length} {games.length === 1 ? "game" : "games"}
        </p>
        {games.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 text-xl">★</span>
            <span className="text-gray-400 text-lg">{avgRating} average rating</span>
          </div>
        )}
      </div>

      {/* No Games */}
      {games.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold mb-4 text-white">No games found</h3>
          <p className="text-gray-400">
            Try browsing other developers or check our full catalog
          </p>
        </div>
      ) : (
        /* Responsive Grid */
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
            gap-4
            sm:gap-4
            md:gap-6
            lg:gap-8
          "
        >
          {games.map((game) => (
            <div
              key={game.id}
              className="
                fade-in
                transform
                hover:scale-105
                transition-transform
                duration-200
                lg:scale-105
              "
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

}
