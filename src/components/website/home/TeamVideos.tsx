"use client";

import { useState } from "react";
import { videos } from "@/data/site";
import { AssetImage } from "@/components/ui/AssetImage";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function TeamVideos() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  return (
    <section className="TeamVideos">
      <SectionTitle
        className="TeamVideos-title container"
        mark="rumax-team-mark.svg"
        markClass="TeamVideos-mark"
        title="The Rumax Team"
      >
        <p>
          Our dedicated team of healthcare professionals committed to delivering
          exceptional care
        </p>
      </SectionTitle>

      <div className="TeamVideos-container">
        <div className="TeamVideos-row">
          {videos.map((video, index) => {
            const isPlaying = playingIndex === index;

            return (
              <article
                className={`TeamVideos-card ${video.size} ${isPlaying ? "is-playing" : ""
                  }`}
                key={video.thumb}
              >
                <AssetImage
                  className="TeamVideos-thumb"
                  name={video.thumb}
                  alt={video.alt}
                />

                <button
                  type="button"
                  aria-label={video.label}
                  onClick={() => setPlayingIndex(index)}
                >
                  <AssetImage
                    name={video.playIcon}
                    aria-hidden="true"
                  />
                </button>

                <video
                  className="TeamVideos-player"
                  controls
                  preload="metadata"
                  hidden={!isPlaying}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
