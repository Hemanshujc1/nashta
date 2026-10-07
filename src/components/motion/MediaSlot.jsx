import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { MEDIA } from '../../data/media';
import { ScrollTrigger } from '../../lib/motion';
import { useMotionStore } from '../../store/motionStore';

const useMediaQuery = (query) => {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
};

// Data-saver, slow connection or a weak device: slots stay on their poster (no video, no fallback scene).
const useLowPower = () => {
  const reducedData = useMediaQuery('(prefers-reduced-data: reduce)');
  const [low, setLow] = useState(false);
  useEffect(() => {
    const conn = navigator.connection;
    const check = () =>
      setLow(Boolean(conn?.saveData) || /(^|-)2g$/.test(conn?.effectiveType ?? '') || (navigator.deviceMemory ?? 8) <= 2);
    check();
    conn?.addEventListener?.('change', check);
    return () => conn?.removeEventListener?.('change', check);
  }, []);
  return low || reducedData;
};

const warned = new Set();
const POSITIONED = /(^|\s)(absolute|fixed|sticky)(\s|$)/;
const BTN =
  'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141416]/85 hover:bg-[#141416] text-[#B7B5B0] hover:text-[#F6F3ED] text-xs font-semibold uppercase tracking-wider backdrop-blur-md border border-white/10 transition-all shadow-lg';

/**
 * One video slot from the PRD v3 media map. Layers, bottom to top:
 *   poster image -> children (fallback scene, only while the video file is missing) -> <video>.
 * A missing/broken video file just leaves the poster/fallback visible; the page never breaks.
 *
 * mode:
 *   'auto'  loops (per registry) while visible
 *   'scrub' paused; currentTime follows scroll (scrubTrigger/scrubStart/scrubEnd, default: the slot crossing the viewport)
 *   'once'  plays once at 50% visible, holds the last frame, offers Replay
 *   'click' poster + Play button; plays with sound and controls on click
 * mediaClassName styles the poster and video only (framing/crop), not the fallback scene.
 * active=false pauses the slot (used by MediaCrossfade for the non-active layers).
 */
export default function MediaSlot({
  id,
  className = '',
  fit = 'cover',
  mediaClassName = '',
  eager = false,
  mode = 'auto',
  active = true,
  scrubTrigger,
  scrubStart = 'top bottom',
  scrubEnd = 'bottom top',
  children,
  onVideoReady,
  onStatus,
}) {
  const cfg = MEDIA[id];
  const motionEnabled = useMotionStore((s) => s.motionEnabled);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const lowPower = useLowPower();
  const box = useRef(null);
  const video = useRef(null);
  const [near, setNear] = useState(eager);
  const [ratio, setRatio] = useState(0);
  const [tabHidden, setTabHidden] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterOk, setPosterOk] = useState(true);
  const [started, setStarted] = useState(false); // user pressed Play / Replay
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  const src = cfg ? (isMobile && cfg.mobile ? cfg.mobile : cfg.desktop) : null;
  const status = !src || failed ? 'missing' : ready ? 'ready' : 'loading';
  const visible = ratio >= (mode === 'once' ? 0.5 : 0.01);

  // Start loading within ~1 viewport of entering; track how much of the slot is on screen.
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const nearIo = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '100% 0px' });
    const viewIo = new IntersectionObserver(([entry]) => setRatio(entry.isIntersecting ? entry.intersectionRatio : 0), {
      threshold: [0, 0.01, 0.5],
    });
    nearIo.observe(el);
    viewIo.observe(el);
    return () => {
      nearIo.disconnect();
      viewIo.disconnect();
    };
  }, []);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    setReady(false);
    setFailed(false);
    setStarted(false);
    setPlaying(false);
    setEnded(false);
  }, [src]);

  useEffect(() => {
    onStatus?.(id, status);
    if (status === 'missing' && !warned.has(id)) {
      warned.add(id);
      console.warn(`[MediaSlot] ${id}: video ${src ?? '(not in registry)'} is missing, showing poster/fallback.`);
    }
  }, [id, status, src, onStatus]);

  // Playback: only while on screen, in the foreground tab, and (unless the user pressed Play) with motion on.
  useEffect(() => {
    const v = video.current;
    if (!v || !ready || mode === 'scrub') return;
    const onScreen = active && visible && !tabHidden;
    const auto = mode === 'auto' || (mode === 'once' && !ended);
    if (onScreen && ((auto && motionEnabled) || (started && !ended))) v.play().catch(() => {});
    else if (!v.paused) v.pause();
  }, [mode, active, visible, tabHidden, motionEnabled, ready, started, ended]);

  // Scrub: map scroll progress to currentTime, never queueing more than one seek.
  useEffect(() => {
    const v = video.current;
    if (!v || !ready || mode !== 'scrub' || !motionEnabled) return undefined;
    let target = 0;
    const seek = () => {
      if (!v.seeking && Math.abs(v.currentTime - target) > 0.01) v.currentTime = target;
    };
    v.pause();
    v.addEventListener('seeked', seek);
    const triggerEl = (scrubTrigger && typeof scrubTrigger === 'object' && 'current' in scrubTrigger ? scrubTrigger.current : scrubTrigger) ?? box.current;
    if (!triggerEl) return undefined;

    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start: scrubStart,
      end: scrubEnd,
      onUpdate: (self) => {
        target = self.progress * Math.max((v.duration || 0) - 0.05, 0);
        seek();
      },
    });
    return () => {
      st.kill();
      v.removeEventListener('seeked', seek);
    };
  }, [mode, ready, motionEnabled, scrubTrigger, scrubStart, scrubEnd]);

  const play = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.ended || ended) v.currentTime = 0;
    if (mode === 'click') v.muted = false;
    setEnded(false);
    setStarted(true);
  }, [mode, ended]);

  const showVideo = src && near && !failed && !lowPower;
  const revealed = ready && (mode === 'click' ? started : motionEnabled || started);
  const showFallback = Boolean(children) && status === 'missing' && !lowPower;
  const canPlay = showVideo && ready && !playing && (mode === 'click' || mode === 'once');
  const button = !canPlay ? null : ended ? 'Replay' : mode === 'click' || !motionEnabled ? 'Play' : null;

  return (
    <div
      ref={box}
      className={`${POSITIONED.test(className) ? '' : 'relative'} overflow-hidden ${className}`}
      data-media-slot={id}
      data-media-status={lowPower ? 'poster-only' : status}
    >
      {cfg?.poster && posterOk && !revealed && (
        <img src={cfg.poster} alt="" className={`absolute inset-0 w-full h-full ${mediaClassName}`} style={{ objectFit: fit }} onError={() => setPosterOk(false)} />
      )}
      {showFallback && children}
      {showVideo && (
        <video
          ref={video}
          src={src}
          muted
          playsInline
          loop={cfg.loop && mode === 'auto'}
          controls={mode === 'click' && started}
          preload={eager || mode === 'scrub' ? 'auto' : 'metadata'}
          aria-hidden={mode === 'click' ? undefined : 'true'}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${mediaClassName}`}
          style={{ objectFit: fit, opacity: revealed ? 1 : 0, pointerEvents: revealed ? undefined : 'none' }}
          onLoadedData={(e) => {
            // Dev servers answer missing files with index.html; guard against a non-video "ready".
            if (e.currentTarget.videoWidth > 0) {
              setReady(true);
              onVideoReady?.();
            } else {
              setFailed(true);
            }
          }}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setEnded(true);
          }}
          onError={() => setFailed(true)}
        >
          {cfg.captions && <track kind="captions" src={cfg.captions} srcLang="en" label="English" default />}
        </video>
      )}
      {button === 'Play' && (
        <button type="button" onClick={play} aria-label={`Play ${cfg.label ?? 'video'}`} className="absolute inset-0 z-20 flex items-center justify-center group">
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-[#141416]/85 border border-white/15 backdrop-blur-md shadow-lg transition-transform group-hover:scale-105">
            <Play size={22} className="text-[#F6F3ED] translate-x-0.5" />
          </span>
        </button>
      )}
      {button === 'Replay' && (
        <div className="absolute bottom-4 right-4 z-20">
          <button type="button" onClick={play} className={BTN}>
            <RotateCcw size={12} className="text-[#D9B779]" />
            Replay
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Stacked slots where only `activeId` plays; layers crossfade over `duration` ms (V02 flavour worlds).
 * Slots mount the first time they become active. `fallback` is one shared scene, shown while the
 * active slot's video is missing.
 */
export function MediaCrossfade({ ids, activeId, duration = 500, className = '', fit = 'cover', fallback }) {
  const lowPower = useLowPower();
  const [seen, setSeen] = useState(() => [activeId]);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    setSeen((s) => (s.includes(activeId) ? s : [...s, activeId]));
  }, [activeId]);

  const onStatus = useCallback((id, status) => {
    setStatuses((s) => (s[id] === status ? s : { ...s, [id]: status }));
  }, []);

  return (
    <div className={`${POSITIONED.test(className) ? '' : 'relative'} overflow-hidden ${className}`}>
      {ids
        .filter((id) => seen.includes(id))
        .map((id) => (
          <div
            key={id}
            className="absolute inset-0 transition-opacity ease-out"
            style={{ opacity: id === activeId ? 1 : 0, transitionDuration: `${duration}ms` }}
          >
            <MediaSlot id={id} fit={fit} active={id === activeId} onStatus={onStatus} className="absolute inset-0" />
          </div>
        ))}
      {fallback && !lowPower && statuses[activeId] === 'missing' && fallback}
    </div>
  );
}
