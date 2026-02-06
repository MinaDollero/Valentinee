import React, { useCallback, useEffect, useRef, useState } from 'react';
import HeartCanvas from './HeartCanvas';
import { AppState, Position } from './types';

const START_IMG = 'https://i.pinimg.com/originals/55/29/24/552924c5d913f43785c58e07371f8e53.jpg';
const YES_IMG = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ2_t6el7VgY56MCGE5L4aP8SEk5Npwa0LgQ&s';
const NO_GIF_AFTER_4 = 'https://media.tenor.com/dhuQV_msfiUAAAAM/cat-gun.gif';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.INITIAL);
  const [noCount, setNoCount] = useState(0);
  const [noBtnPos, setNoBtnPos] = useState<Position | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const noBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // center button initially (No is above Yes in document flow; we keep it there until it moves)
    // when moving occurs we set absolute pos relative to container
    function onResize() {
      if (!noBtnPos && containerRef.current && noBtnRef.current) {
        // keep No in flow (no absolute positioning) - nothing to do
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [noBtnPos]);

  const moveNoButton = useCallback(() => {
    // increment attempts and then move; when reaching 4 -> angry
    setNoCount(prev => {
      const next = prev + 1;
      if (next >= 4) {
        setState(AppState.ANGRY);
        // set an explicit position so the button doesn't overlap odd places
        if (containerRef.current && noBtnRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const padding = 24;
          const x = Math.random() * Math.max(0, rect.width - noBtnRef.current.offsetWidth - padding) + padding;
          const y = Math.random() * Math.max(0, rect.height - noBtnRef.current.offsetHeight - padding - 80) + padding;
          setNoBtnPos({ x, y });
        }
      } else {
        // set randomized position (relative to container)
        if (containerRef.current && noBtnRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const padding = 24;
          const maxX = Math.max(0, rect.width - noBtnRef.current.offsetWidth - padding);
          const maxY = Math.max(0, rect.height - noBtnRef.current.offsetHeight - padding - 80);
          const x = Math.random() * maxX + padding;
          const y = Math.random() * maxY + padding;
          setNoBtnPos({ x, y });
        }
      }
      return next;
    });
  }, []);

  const handleYes = () => {
    setState(AppState.SUCCESS);
  };

  const reset = () => {
    setState(AppState.INITIAL);
    setNoCount(0);
    setNoBtnPos(null);
  };

  // When user returns to initial, clear positioning after short delay so No appears above Yes again
  useEffect(() => {
    if (state === AppState.INITIAL) {
      const t = setTimeout(() => setNoBtnPos(null), 120);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <div className="app-root">
      <HeartCanvas />
      <div className="card" ref={containerRef}>
        <div className="state-area">
          {state === AppState.INITIAL && (
            <div className="initial">
              <img src={START_IMG} alt="start" className="start-img" />
              <h1 className="title">Will YOU be my Valentine?</h1>

              <div className="stack-area">
                {/* No appears above Yes initially (flow). When noBtnPos is set we absolute-position it. */}
                <div className="no-wrapper" style={noBtnPos ? { position: 'absolute', left: noBtnPos.x, top: noBtnPos.y } as React.CSSProperties : { position: 'static' }}>
                  <button
                    ref={noBtnRef}
                    className={`btn btn-no ${noBtnPos ? 'moved' : 'initial-pos'}`}
                    onMouseEnter={moveNoButton}
                    onClick={(e) => { e.preventDefault(); moveNoButton(); }}
                  >
                    No
                  </button>
                </div>

                <div className="yes-wrapper">
                  <button className="btn btn-yes" onClick={handleYes}>Yes! 💖</button>
                </div>
              </div>

              <p className="note">Try to click "No" if you dare 😉</p>
            </div>
          )}

          {state === AppState.ANGRY && (
            <div className="angry">
              <h2 className="angry-title">Stop messing with me! 😠</h2>
              <img src={NO_GIF_AFTER_4} alt="angry-cat" className="angry-img" />
              <p className="note">You tried to press "No" {noCount} times...</p>
              <button className="btn reset-btn" onClick={reset}>Okay, I'll be serious now 🥺</button>
            </div>
          )}

          {state === AppState.SUCCESS && (
            <div className="success">
              <img src={YES_IMG} alt="happy" className="happy-img" />
              <h2 className="success-title">Yay!!! 🎉</h2>
              <p className="note">I knew you'd say yes ❤️</p>
              <button className="btn reset-btn" onClick={reset}>Reset</button>
            </div>
          )}
        </div>
      </div>
      <footer className="footer">Made with love 🌹</footer>
    </div>
  );
};

export default App;