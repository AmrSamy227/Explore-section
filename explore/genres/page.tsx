import Link from 'next/link';
import { gamesLibrary } from '@/lib/gamesData';

export default function GenresPage() {
  const genreStats = gamesLibrary.reduce((acc, game) => {
    game.genre.forEach(g => {
      if (!acc[g]) {
        acc[g] = { count: 0, games: [] };
      }
      acc[g].count++;
      acc[g].games.push(game);
    });
    return acc;
  }, {} as Record<string, { count: number; games: typeof gamesLibrary }>);

  const sortedGenres = Object.entries(genreStats).sort((a, b) => b[1].count - a[1].count);

  return (
  <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
    <div className="max-w-[1400px] mx-auto">
      {/* Page Title */}
      <h1 className="text-5xl font-bold mb-4 text-white slide-in">
        All Genres
        <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
      </h1>
      <p className="text-gray-400 mb-8 text-lg">
        Browse games by genre - {sortedGenres.length} genres available
      </p>

      {/* Responsive Grid */}
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
        {sortedGenres.map(([genre, data]) => {
          const slug = genre.toLowerCase().replace(/\s+/g, '-');
          const topGames = data.games.slice(0, 3);

          return (
            <Link key={genre} href={`/explore/genres/${slug}`}>
              <div
                className="
                  bg-[#2a2a2a]
                  rounded-lg
                  p-6
                  hover:bg-[#333]
                  transition-all
                  hover:scale-105
                  border-2 border-transparent
                  hover:border-red-600
                  group
                  transform
                "
              >
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-600 transition-colors">
                  {genre}
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  {data.count} {data.count === 1 ? 'game' : 'games'}
                </p>
                <div className="space-y-2">
                  {topGames.map((game, idx) => (
                    <div key={game.id} className="text-xs text-gray-500">
                      {idx + 1}. {game.title}
                    </div>
                  ))}
                  {data.count > 3 && (
                    <div className="text-xs text-red-600 font-semibold">
                      +{data.count - 3} more
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  </div>
);

}
