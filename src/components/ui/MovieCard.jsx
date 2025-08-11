import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaChevronDown } from "react-icons/fa";
import { useMyList } from "../../contexts/MyListContext";
import { tmdbApi } from "../../services/api/tmdb"; // added

// no video providers for hover to avoid third-party branding

const MovieCard = ({ movie, onMovieClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToMyList, removeFromMyList, isInMyList } = useMyList();
  // Hover preview state
  const [isHovered, setIsHovered] = useState(false);
  const [like, setLike] = useState(false);
  const hoverTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const containerRef = useRef(null);
  const [overlayPos, setOverlayPos] = useState({ left: 0, top: 0 });
  const [overlayHover, setOverlayHover] = useState(false);
  const [growVisible, setGrowVisible] = useState(false);
  const [growRect, setGrowRect] = useState(null);

  // Check if movie is in list
  const mediaType = movie.name && !movie.title ? 'tv' : 'movie';
  const inMyList = isInMyList(movie.id, mediaType);

  const handleCardClick = () => {
    if (onMovieClick) {
      onMovieClick(movie);
    }
  };

  const handleAddToListClick = async (e) => {
    e.stopPropagation(); // Prevent modal from opening
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      let detectedMediaType = 'movie';
      
      if (movie.name && !movie.title) {
        detectedMediaType = 'tv';
      } else if (movie.first_air_date) {
        detectedMediaType = 'tv';
      } else if (movie.release_date) {
        detectedMediaType = 'movie';
      }
      
      if (inMyList) {
        await removeFromMyList({
          tmdbId: movie.id,
          mediaType: detectedMediaType
        });
      } else {
        await addToMyList({
          tmdbId: movie.id,
          mediaType: detectedMediaType
        });
      }
    } catch (error) {
      console.error("Error updating movie list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear delayed timers on unhover (kept for potential future use)
  useEffect(() => {
    if (!isHovered && hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, [isHovered]);

  // Compute desktop breakpoint
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;

  const computeOverlayPosition = () => {
    if (!containerRef.current || !isDesktop) return;
    const rect = containerRef.current.getBoundingClientRect();
    const previewWidth = 352; // 22rem
    const margin = 16;
    let left = rect.left + rect.width / 2 - previewWidth / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - previewWidth - margin));
    let top = rect.top - 40; // prefer above a bit
    if (top < margin) {
      top = rect.bottom + 8; // place below if not enough space above
    }
    setOverlayPos({ left, top });
  };

  const handleMouseEnter = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsHovered(true);
    computeOverlayPosition();
  };

  const handleMouseLeave = () => {
    // small delay to allow moving into overlay without flicker
    hideTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100);
  };

  const activeHover = (isHovered || overlayHover) && isDesktop;

  const openWithGrow = (e) => {
    if (e) e.stopPropagation();
    if (!isDesktop) {
      handleCardClick();
      return;
    }
    // Try to measure the current hover preview element for seamless start rect
    const previewEl = document.querySelector(`[data-preview-id="movie-${movie.id}"]`);
    let rect;
    if (previewEl) {
      rect = previewEl.getBoundingClientRect();
    } else {
      // Fallback to computed overlayPos with default size
      rect = { left: overlayPos.left, top: overlayPos.top, width: 352, height: 264 };
    }
    setGrowRect({ left: rect.left, top: rect.top, width: rect.width || 352, height: rect.height || 264 });
    setGrowVisible(true);
    // After animation, open the modal and remove transition
    setTimeout(() => {
      handleCardClick();
      setGrowVisible(false);
    }, 320);
  };

  return (
    <div
      ref={containerRef}
      className="relative group/movie"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Movie Card - Click to open modal */}
      <div
        className="cursor-pointer transition-transform duration-200 hover:scale-105"
        onClick={handleCardClick}
      >
        <div className="overflow-hidden rounded-sm w-[15rem] h-[8.5rem] bg-black relative">
          {(() => {
            const backdrop = movie?.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : null;
            const poster = movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
            const url = backdrop || poster;
            const useCover = !!backdrop; // posters are portrait; use contain to avoid cropping
            return (
              <>
                <img
                  loading="lazy"
                  decoding="async"
                  src={url}
                  alt={movie.title || movie.name || "Artwork"}
                  className={`${useCover ? 'object-cover' : 'object-contain'} w-full h-full transition-transform duration-700 ease-out`}
                  onError={(e) => { e.target.src = "/no-image.jpg"; }}
                />
                {/* Movie title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <h3 className="text-gray-300 text-sm font-semibold truncate">
                    {movie.title?.toUpperCase() || movie.name?.toUpperCase() || "Unknown"}
                  </h3>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Hover Preview (desktop) via portal to avoid clipping */}
      {activeHover && createPortal(
        <HoverPreview
          left={overlayPos.left}
          top={overlayPos.top}
          movie={movie}
          inMyList={inMyList}
          like={like}
          setLike={setLike}
          onToggleList={handleAddToListClick}
          onMouseEnter={() => { if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; } setOverlayHover(true); }}
          onMouseLeave={() => { setOverlayHover(false); setIsHovered(false); }}
          previewId={`movie-${movie.id}`}
          onOpen={openWithGrow}
        />,
        document.body
      )}

      {/* Grow-to-modal transition overlay (desktop) */}
      {growVisible && isDesktop && growRect && createPortal(
        <GrowOverlay rect={growRect} posterPath={movie.backdrop_path || movie.poster_path} />,
        document.body
      )}
    </div>
  );
};

// Hover overlay as a separate component to enable mount animations
function HoverPreview({ left, top, movie, inMyList, like, setLike, onOpen, onToggleList, onMouseEnter, onMouseLeave, previewId }) {
  const [entered, setEntered] = useState(false);
  // NEW: local meta state
  const [meta, setMeta] = useState({ cert: null, runtimeMin: null, genres: [] });
  const isTV =
    !!(movie?.media_type === "tv" || (movie?.name && !movie?.title) || movie?.first_air_date);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Inject keyframes once per mount for kenburns
  useEffect(() => {
    const id = 'kb-keyframes';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `@keyframes kenburns { 0% { transform: scale(1.05) translate3d(0,0,0); } 100% { transform: scale(1.12) translate3d(0,-2%,0); } }`;
      document.head.appendChild(style);
    }
  }, []);

  // NEW: lightweight meta fetch with fallback (debounced)
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        if (!movie?.id) return;
        const endpoint = isTV ? "tv" : "movie";
        const append = isTV ? "content_ratings" : "release_dates";
        // tmdbApi expected to return data object directly
        const data = await tmdbApi.get(
          `/${endpoint}/${movie.id}`,
          { language: 'en-US', append_to_response: append }
        );

        // certification
        let cert = null;
        if (isTV) {
          const list = data?.content_ratings?.results || [];
          const pick = list.find((r) => r.iso_3166_1 === "US") || list[0];
          cert = pick?.rating || null;
        } else {
          const list = data?.release_dates?.results || [];
          const pick = list.find((r) => r.iso_3166_1 === "US") || list[0];
          const entry = pick?.release_dates?.find((e) => e.certification) || null;
          cert = entry?.certification || null;
        }

        // runtime
        const runtimeMin = isTV
          ? (Array.isArray(data?.episode_run_time) ? data.episode_run_time[0] : null)
          : data?.runtime ?? null;

        // genres
        const genres = (data?.genres || []).map((g) => g.name).slice(0, 3);

        if (!cancelled) {
          setMeta({ cert, runtimeMin, genres });
        }
      } catch {
        // ignore, keep defaults
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      cancelled = true;
    };
  }, [movie?.id, isTV]);

  const formatRuntime = (min) => {
    if (!min && isTV) return "TV Series";
    if (!min) return null;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h ? `${h}h ` : ""}${m}m`;
  };

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="hidden md:block fixed z-50"
      style={{ left, top, width: '22rem' }}
      data-preview-id={previewId}
    >
      <div className={`bg-zinc-900 rounded-lg shadow-2xl overflow-hidden transform transition-all duration-200 ${entered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="relative w-full cursor-pointer" onClick={onOpen} style={{ height: '12.5rem' }}>
          <div className="absolute inset-0 overflow-hidden">
            {(() => {
              const backdrop = movie?.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : null;
              const poster = movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;
              const url = backdrop || poster;
              const useCover = !!backdrop;
              return (
                <img
                  src={url}
                  alt={movie.title || movie.name || 'Artwork'}
                  className={`w-full h-full ${useCover ? 'object-cover' : 'object-contain bg-black'} will-change-transform scale-[1.05] animate-[kenburns_8s_ease-out_forwards]`}
                />
              );
            })()}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/70" />
          
          {/* Movie title overlay on hover preview */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
            <h2 className="text-white text-lg font-semibold truncate">
              {movie.title || movie.name || "Unknown"}
            </h2>
          </div>
        </div>

        {/* Meta + Actions */}
        <div className="p-3">
          

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleList(e); }}
              className="bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-white w-9 h-9 rounded-full grid place-items-center"
              title={inMyList ? 'Remove from My List' : 'Add to My List'}
            >
              {inMyList ? <FaCheck /> : <FaPlus />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLike(v => !v); }}
              className={`w-9 h-9 rounded-full cursor-pointer grid place-items-center ${like ? 'bg-zinc-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
              title={like ? 'Liked' : 'Like'}
            >
              <FaThumbsUp />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(e); }}
              className="ml-auto bg-zinc-800 cursor-pointer hover:bg-zinc-700 text-white w-9 h-9 rounded-full grid place-items-center"
              title="More info"
            >
              <FaChevronDown />
            </button>
          </div>
          {/* Meta row */}
          <div className="flex items-center gap-2 pt-4 text-xs text-white/80 mb-2">
            <span className="bg-white text-black font-semibold rounded px-1.5 py-0.5 leading-none whitespace-nowrap">HD</span>
            {formatRuntime(meta.runtimeMin) && (
              <span className="whitespace-nowrap">{formatRuntime(meta.runtimeMin)}</span>
            )}
            {meta.genres?.length > 0 && (
              <span className="truncate">{meta.genres.join(" • ")}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function GrowOverlay({ rect, posterPath }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setExpanded(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="hidden md:block fixed inset-0 z-[60]">
      {/* dim backdrop */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${expanded ? 'opacity-60' : 'opacity-0'}`} />
      {/* growing panel */}
      <div
        className={`absolute overflow-hidden bg-zinc-900 transition-all duration-300 ${expanded ? 'rounded-none' : 'rounded-lg'}`}
        style={{
          left: expanded ? 0 : rect.left,
          top: expanded ? 0 : rect.top,
          width: expanded ? '100vw' : rect.width,
          height: expanded ? '100vh' : rect.height,
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w1280${posterPath}`}
          alt="Backdrop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
      </div>
    </div>
  );
}

export default MovieCard;
