"use client";

import { useEffect, useState } from "react";
import { PauseIcon, PlayIcon, TimerIcon } from "./icons";
import { FOCUS_DURATION_SECONDS, formatTimer } from "@/lib/focusTimer";

export function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [running]);

  function toggleTimer() {
    if (secondsLeft === 0) {
      setSecondsLeft(FOCUS_DURATION_SECONDS);
      setRunning(true);
      return;
    }
    setRunning((current) => !current);
  }

  function resetTimer() {
    setRunning(false);
    setSecondsLeft(FOCUS_DURATION_SECONDS);
  }

  return (
    <div className="focus-timer" aria-label="25 minute focus timer">
      <div className="focus-timer-value" role="timer" aria-live="off">
        {formatTimer(secondsLeft)}
      </div>
      <div className="eyebrow focus-timer-label">
        {secondsLeft === 0 ? "Session complete" : running ? "Deep work in progress" : "Deep work session"}
      </div>
      <div className="focus-timer-controls">
        <button
          className="icon-button focus-timer-primary"
          type="button"
          onClick={toggleTimer}
          aria-label={running ? "Pause focus timer" : secondsLeft === 0 ? "Restart focus timer" : "Start focus timer"}
        >
          {running ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
        </button>
        <button
          className="icon-button"
          type="button"
          onClick={resetTimer}
          aria-label="Reset focus timer"
        >
          <TimerIcon size={18} />
        </button>
      </div>
    </div>
  );
}
