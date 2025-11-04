"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Game } from "@/lib/gamesData";

export default function MediaGallery({ game }: { game: Game }) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  // ✅ Ensure images and videos resolve from public/assets or remote URLs
  const resolvePath = (src: string) => {
    if (!src) return "";
    if (src.startsWith("http")) return src; // remote image or video
    return `/assets/${src.replace(/^\/assets\//, "")}`; // local asset
  };

  const allMedia = [
    { type: "video", src: game.trailer || "" },
    ...game.screenshots.map((src) => ({ type: "image", src })),
  ]
    .filter((media) => media.src)
    .map((media) => ({ ...media, src: resolvePath(media.src) }));

  const scrollThumbnails = (direction: number) => {
    const newIndex = activeMediaIndex + direction;
    if (newIndex >= 0 && newIndex < allMedia.length) {
      setActiveMediaIndex(newIndex);
    }
  };

  if (allMedia.length === 0) return null;

  return (
    <>
      {/* 🎥 Main Media Display */}
      <div className="relative w-full pb-[56.25%] mb-4 bg-black rounded overflow-hidden">
        {allMedia[activeMediaIndex].type === "video" &&
        allMedia[activeMediaIndex].src ? (
          <iframe
            src={allMedia[activeMediaIndex].src}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Image
            src={allMedia[activeMediaIndex].src || resolvePath(game.image)}
            alt={`${game.title} media ${activeMediaIndex}`}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* 🎞️ Thumbnail Carousel */}
      <div className="relative">
        {activeMediaIndex > 0 && (
          <button
            onClick={() => scrollThumbnails(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {activeMediaIndex < allMedia.length - 1 && (
          <button
            onClick={() => scrollThumbnails(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/80 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => setActiveMediaIndex(index)}
              className={`relative flex-shrink-0 w-32 h-20 rounded overflow-hidden transition-all ${
                activeMediaIndex === index ? "ring-2 ring-red-600" : ""
              }`}
            >
              {media.type === "video" ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Play size={24} className="text-white" />
                </div>
              ) : null}
              <Image
                src={media.src || resolvePath(game.image)}
                alt={`Thumbnail ${index}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
