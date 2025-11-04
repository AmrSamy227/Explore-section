"use client";

import { useState } from "react";
import Link from "next/link";
import { gamesLibrary } from "@/lib/gamesData";

export default function DevelopersPage() {
  // Compute developer stats
  const developerStats = gamesLibrary.reduce((acc, game) => {
    const developers = Array.isArray(game.developer) ? game.developer : [game.developer];
    developers.forEach((dev) => {
      if (!acc[dev]) acc[dev] = { count: 0, games: [], avgRating: 0 };
      acc[dev].count++;
      acc[dev].games.push(game);
    });
    return acc;
  }, {} as Record<string, { count: number; games: typeof gamesLibrary; avgRating: number }>);

  Object.keys(developerStats).forEach((dev) => {
    const games = developerStats[dev].games;
    developerStats[dev].avgRating = games.reduce((sum, g) => sum + g.rating, 0) / games.length;
  });

  const allDevelopers = Object.entries(developerStats).sort((a, b) => b[1].count - a[1].count);

  // ---------- FILTER STATES ----------
  const [selectedMinRating, setSelectedMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered developers
  const filteredDevelopers = allDevelopers.filter(([dev, data]) => {
    const matchesRating = data.avgRating >= selectedMinRating;
    const matchesQuery = dev.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesQuery;
  });

  const ratingsOptions = [0, 7, 8, 9, 9.5];

  return (
    <div className="min-h-screen bg-[#1c1c1c] py-12 px-4">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-white slide-in">
          All Developers
          <span className="block w-20 h-1 bg-red-600 mt-4 rounded"></span>
        </h1>
        <p className="text-gray-400 mb-8 text-lg">
          Browse games by developer - {filteredDevelopers.length} developers featured
        </p>

        {/* ---------- FILTER SECTION ---------- */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          {/* Search */}
          <input
            type="text"
            placeholder="Search developer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-gray-700 focus:outline-none focus:border-red-600 transition"
          />

          {/* Min rating filter */}
          <select
            value={selectedMinRating}
            onChange={(e) => setSelectedMinRating(Number(e.target.value))}
            className="w-full sm:w-1/6 px-4 py-2 rounded-lg bg-[#2a2a2a] text-white border border-gray-700 focus:outline-none focus:border-red-600 transition"
          >
            {ratingsOptions.map((r) => (
              <option key={r} value={r}>
                Min Rating: {r === 0 ? "Any" : r + "★"}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- DEVELOPERS GRID ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredDevelopers.map(([developer, data]) => {
            const slug = developer.toLowerCase().replace(/\s+/g, "-");
            const topGames = data.games.slice(0, 3);

            return (
              <Link key={developer} href={`/explore/developers/${slug}`}>
                <div className="bg-[#2a2a2a] rounded-lg p-6 hover:bg-[#333] transition-all hover:scale-105 border-2 border-transparent hover:border-red-600 group">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-600 transition-colors">
                    {developer}
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <p className="text-gray-400 text-sm">
                      {data.count} {data.count === 1 ? "game" : "games"}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-400 text-sm">{data.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
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
          {filteredDevelopers.length === 0 && (
            <p className="text-gray-400 col-span-full text-center mt-10">
              No developers match the filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
