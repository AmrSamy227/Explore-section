import Link from 'next/link';
import { gamesLibrary } from '@/lib/gamesData';
import { Gamepad2, Users, Monitor } from 'lucide-react';

export default function ExplorePage() {
  const allGenres = Array.from(
    new Set(gamesLibrary.flatMap(game => game.genre))
  ).sort();

  const allDevelopers = Array.from(
    new Set(gamesLibrary.map(game => game.developer))
  ).sort();

  const allPlatforms = Array.from(
    new Set(gamesLibrary.flatMap(game => game.platforms))
  ).sort();

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-white slide-in">
          Explore Games
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
        </h1>
        <p className="text-gray-400 mb-12 text-lg">
          Browse games by genres, developers, and platforms
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/explore/genres" className="group">
            <div className="bg-[#2a2a2a] rounded-lg p-8 hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-600 p-4 rounded-lg">
                  <Gamepad2 size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Genres</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Explore {allGenres.length} different game genres
              </p>
              <div className="flex flex-wrap gap-2">
                {allGenres.slice(0, 6).map((genre) => (
                  <span key={genre} className="text-xs bg-[#1c1c1c] px-2 py-1 rounded text-gray-300">
                    {genre}
                  </span>
                ))}
                {allGenres.length > 6 && (
                  <span className="text-xs bg-red-600 px-2 py-1 rounded text-white">
                    +{allGenres.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </Link>

          <Link href="/explore/developers" className="group">
            <div className="bg-[#2a2a2a] rounded-lg p-8 hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-600 p-4 rounded-lg">
                  <Users size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Developers</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Browse {allDevelopers.length} game developers
              </p>
              <div className="flex flex-wrap gap-2">
                {allDevelopers.slice(0, 4).map((dev) => (
                  <span key={dev} className="text-xs bg-[#1c1c1c] px-2 py-1 rounded text-gray-300">
                    {dev}
                  </span>
                ))}
                {allDevelopers.length > 4 && (
                  <span className="text-xs bg-red-600 px-2 py-1 rounded text-white">
                    +{allDevelopers.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </Link>

          <Link href="/explore/platforms" className="group">
            <div className="bg-[#2a2a2a] rounded-lg p-8 hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-600 p-4 rounded-lg">
                  <Monitor size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Platforms</h2>
              </div>
              <p className="text-gray-400 mb-4">
                Discover games on {allPlatforms.length} platforms
              </p>
              <div className="flex flex-wrap gap-2">
                {allPlatforms.map((platform) => (
                  <span key={platform} className="text-xs bg-[#1c1c1c] px-2 py-1 rounded text-gray-300">
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </div>
      
    </div>
    
  );
}
