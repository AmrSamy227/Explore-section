import DownloadButton from '@/components/DownloadButton';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getGameById, gamesLibrary } from '@/lib/gamesData';
import { Download, Play, Heart, Bell, EyeOff } from 'lucide-react';
import MediaGallery from './MediaGallery';
import ActionButtons from './ActionButtons';


export function generateStaticParams() {
  return gamesLibrary.map((game) => ({
    id: game.id,
  }));
}

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const game = getGameById(resolvedParams.id);

  if (!game) {
    notFound();
  }

  // ✅ Normalize developer(s) to an array
  const devs = Array.isArray(game.developer) ? game.developer : [game.developer];

  // ✅ Calculate genre rarity scores
  const genreCount: Record<string, number> = {};
  gamesLibrary.forEach((g) => {
    g.genre.forEach((genre) => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });

 // ✅ Find games by same developer (up to 3)
  const developerGames = gamesLibrary
    .filter((g) => {
      if (g.id === game.id) return false;
      const gDevs = Array.isArray(g.developer) ? g.developer : [g.developer];
      return gDevs.some((d) => devs.includes(d));
    })
    .slice(0, 3);

  // ✅ Calculate how many genre games we need to reach 6 total
  const genreGamesNeeded = 6 - developerGames.length;

  // ✅ Find games by genre with rarity scoring
  const genreGames = gamesLibrary
    .filter((g) => {
      if (g.id === game.id) return false;
      // Exclude games already in developer list
      const gDevs = Array.isArray(g.developer) ? g.developer : [g.developer];
      const isSameDev = gDevs.some((d) => devs.includes(d));
      if (isSameDev) return false;
      // Must have at least one matching genre
      return g.genre.some((genre) => game.genre.includes(genre));
    })
    .map((g) => {
      let score = 0;

      // Same genres with rarity weighting
      const matchingGenres = g.genre.filter((genre) => game.genre.includes(genre));
      matchingGenres.forEach((genre) => {
        const totalGames = gamesLibrary.length;
        const genreFrequency = genreCount[genre] || 1;
        const rarityScore = Math.max(1, Math.round((totalGames / genreFrequency) * 3));
        score += rarityScore;
      });

      // Bonus for matching ALL genres (exact match)
      if (matchingGenres.length === game.genre.length && 
          matchingGenres.length === g.genre.length) {
        score += 20;
      }

      // Bonus for matching multiple genres
      if (matchingGenres.length > 1) {
        score += matchingGenres.length * 3;
      }

      return { game: g, score, matchingGenres: matchingGenres.length };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.matchingGenres - a.matchingGenres;
    })
    .slice(0, genreGamesNeeded)
    .map((item) => item.game);

  // ✅ Combine: up to 3 from developer + fill rest with genre games (total 6)
  const relatedGames = [...developerGames, ...genreGames];

  return (
    <div className="min-h-screen">
      {/* 🎮 Game Header */}
      <div
        className="bg-gradient-to-r from-black/80 to-black/80 bg-cover bg-center py-12 px-6"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${
            game.background || game.banner
          })`,
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* 🧭 Breadcrumb */}
          <nav className="mb-8 flex flex-wrap gap-2 text-sm">
            <Link href="/games" className="text-red-400 hover:text-red-500">
              All Games
            </Link>
            <span className="text-gray-500">›</span>
            <Link
              href={`/category/${game.genre[0].toLowerCase()}`}
              className="text-red-400 hover:text-red-500"
            >
              {game.genre[0]}
            </Link>
            <span className="text-gray-500">›</span>
            <span className="text-gray-400">{game.title}</span>
          </nav>

          {/* 🖼️ Game Info */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <Image
                src={game.banner}
                alt={game.title}
                width={300}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-2">{game.title}</h1>

              {/* ✅ Developer Link (handles string or array) */}
              <p className="text-gray-400 mb-6">
                {Array.isArray(game.developer) ? (
                  game.developer.map((dev, i) => (
                    <span key={dev}>
                      <Link
                        href={`/explore/developers/${String(dev)
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        {dev}
                      </Link>
                      {i < game.developer.length - 1 && ', '}
                    </span>
                  ))
                ) : game.developer ? (
                  <Link
                    href={`/explore/developers/${String(game.developer)
                      .toLowerCase()
                      .replace(/\s+/g, '-')}`}
                    className="text-red-400 hover:text-red-500 transition-colors"
                  >
                    {game.developer}
                  </Link>
                ) : (
                  <span className="text-gray-500 italic">Unknown Developer</span>
                )}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {game.platforms.map((platform) => (
                  <span key={platform} className="bg-[#333] px-3 py-1 rounded text-sm">
                    {platform}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <DownloadButton game={game} />
                <button className="bg-[#333] hover:bg-[#444] px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all">
                  <Play size={20} /> Play with GAME PASS
                </button>
              </div>

              <div className="text-gray-400 text-sm space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="font-bold">{game.rating}</span> Rating
                </p>
                <p>
                  <strong>Size:</strong> {game.size}
                </p>
                <p>
                  <strong>Release Year:</strong> {game.release_year}
                </p>
                <p className="mb-6 text-gray-400">
                  <strong>Genres:</strong>{" "}
                  {game.genre.map((g, index) => (
                    <span key={g}>
                      <Link
                        href={`/explore/genres/${g
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                        className="text-red-400 hover:text-red-500 transition-colors"
                      >
                        {g}
                      </Link>
                      {index < game.genre.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-800" />

      {/* 🖼️ Media Gallery */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6">{game.title}</h2>
        <MediaGallery game={game} />

        {/* ❤️ Action Buttons */}
<ActionButtons />


        {/* 📝 About The Game */}
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6 relative inline-block pb-2">
            About The Game
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-red-600"></span>
          </h2>
          <p className="text-lg leading-relaxed mb-4">{game.long_description}</p>
        </section>

        {/* ⚙️ System Requirements */}
        <section className="my-12">
          <h2 className="text-3xl font-bold mb-6 relative inline-block pb-2">
            System Requirements
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-red-600"></span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl text-red-600 mb-4">Minimum Requirements</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">OS:</strong> {game.requirements.minimum.os}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Processor:</strong> {game.requirements.minimum.processor}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Memory:</strong> {game.requirements.minimum.memory}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Graphics:</strong> {game.requirements.minimum.graphics}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Storage:</strong> {game.requirements.minimum.storage}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl text-red-600 mb-4">Recommended Requirements</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">OS:</strong> {game.requirements.recommended.os}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Processor:</strong> {game.requirements.recommended.processor}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Memory:</strong> {game.requirements.recommended.memory}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Graphics:</strong> {game.requirements.recommended.graphics}
                </li>
                <li className="pb-3 border-b border-gray-800">
                  <strong className="text-red-600">Storage:</strong> {game.requirements.recommended.storage}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 🎮 More Like This */}
        {relatedGames.length > 0 && (
          <section className="my-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold relative inline-block pb-2">
                Related Games
                <span className="absolute bottom-0 left-0 w-20 h-1 bg-red-600"></span>
              </h2>
              <Link
              href={`/game/${game.id}/more-like-this`}
              className="text-red-400 hover:text-red-500"
            >
              See All
            </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedGames.map((relatedGame) => (
                <Link
                  key={relatedGame.id}
                  href={`/game/${relatedGame.id}`}
                  className="group"
                >
                  <div className="relative aspect-video mb-2 rounded overflow-hidden">
                    <Image
                      src={relatedGame.image}
                      alt={relatedGame.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <h3 className="text-sm font-medium truncate group-hover:text-red-600 transition-colors">
                    {relatedGame.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}