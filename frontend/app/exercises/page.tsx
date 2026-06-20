"use client";

import { useEffect, useMemo, useState } from "react";
import { AppChrome } from "@/components/AppChrome";
import { ExerciseIcon, PlayIcon, SparkIcon, TimerIcon } from "@/components/icons";
import { ApiError, generateExercise } from "@/lib/api";
import { storage } from "@/lib/storage";
import type { CopingExercise, JournalAnalysis } from "@/lib/types";

const defaultExercise: CopingExercise = {
  id: "box-breathing",
  title: "Box Breathing",
  goal: "Lower immediate physiological urgency before returning to study.",
  durationMinutes: 4,
  steps: [
    "Exhale fully and let your shoulders drop.",
    "Inhale gently through your nose for four seconds.",
    "Hold for four seconds without straining.",
    "Exhale for four seconds, pause for four, and repeat."
  ],
  whyThisHelps:
    "A slower, predictable breathing rhythm can reduce the felt urgency that makes focused work harder."
};

const neutralAnalysis: JournalAnalysis = {
  moodScore: 5,
  energyLevel: "medium",
  primaryEmotion: "stressed",
  stressTriggers: ["exam preparation"],
  hiddenPattern: null,
  urgency: "medium",
  supportiveSummary: "Keep the next step small and concrete."
};

export default function ExercisesPage() {
  const [exercise, setExercise] = useState<CopingExercise>(defaultExercise);
  const [analysis, setAnalysis] = useState<JournalAnalysis>(neutralAnalysis);
  const [secondsLeft, setSecondsLeft] = useState(defaultExercise.durationMinutes * 60);
  const [running, setRunning] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const latestExercise = storage.loadLatestExercise();
    const latestEntry = storage.loadJournalEntries()[0];
    if (latestExercise) setExercise(latestExercise);
    if (latestEntry) setAnalysis(latestEntry.analysis);
  }, []);

  useEffect(() => {
    setSecondsLeft(exercise.durationMinutes * 60);
    setRunning(false);
  }, [exercise]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const timeLabel = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [secondsLeft]);

  async function personalizeExercise() {
    setGenerating(true);
    setError(null);
    try {
      const result = await generateExercise({
        currentAnalysis: analysis,
        userRequest: "Give me the most useful short exercise I can do before my next study block."
      });
      setExercise(result.exercise);
      storage.saveLatestExercise(result.exercise);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "A personalized exercise could not be generated."
      );
    } finally {
      setGenerating(false);
    }
  }

  function resetTimer() {
    setRunning(false);
    setSecondsLeft(exercise.durationMinutes * 60);
  }

  function toggleTimer() {
    if (secondsLeft === 0) {
      setSecondsLeft(exercise.durationMinutes * 60);
      setRunning(true);
      return;
    }
    setRunning((value) => !value);
  }

  return (
    <AppChrome>
      <div className="exercise-page">
        <header className="exercise-header">
          <div>
            <div className="eyebrow exercise-kicker">Adaptive reset</div>
            <h1>Regain enough calm for the next step.</h1>
            <p>
              Use one short protocol matched to your latest check-in, then return to the smallest
              useful study action.
            </p>
          </div>
          <button
            className="ghost-button"
            type="button"
            onClick={() => void personalizeExercise()}
            disabled={generating}
          >
            <SparkIcon size={18} />
            {generating ? "Personalizing…" : "Personalize with Gemini"}
          </button>
        </header>

        {error ? <div className="inline-error" role="alert">{error}</div> : null}

        <section className="surface-card exercise-hero">
          <div>
            <div className="exercise-meta">
              <span className="pill">For {analysis.primaryEmotion} moments</span>
              <span className="small-muted">
                <TimerIcon size={16} /> {exercise.durationMinutes} minutes
              </span>
            </div>
            <h2>{exercise.title}</h2>
            <p>{exercise.goal}</p>
          </div>

          <div className="exercise-timer" aria-live="polite">
            <ExerciseIcon size={28} />
            <strong>{timeLabel}</strong>
            <span>{running ? "Stay with the rhythm" : secondsLeft === 0 ? "Complete" : "Ready"}</span>
            <div>
              <button className="primary-button" type="button" onClick={toggleTimer}>
                <PlayIcon size={18} /> {running ? "Pause" : secondsLeft === 0 ? "Restart" : "Start"}
              </button>
              <button className="dark-button" type="button" onClick={resetTimer}>Reset</button>
            </div>
          </div>
        </section>

        <section className="exercise-protocol">
          <div>
            <div className="eyebrow section-label">Step-by-step</div>
            <h2>Follow the protocol</h2>
          </div>
          <ol>
            {exercise.steps.map((step, index) => (
              <li key={`${step}-${index}`}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="surface-card exercise-rationale">
          <div className="eyebrow exercise-kicker">Why this helps</div>
          <p>{exercise.whyThisHelps}</p>
          <small>
            This is a general wellbeing exercise, not medical treatment. Stop if it feels
            uncomfortable.
          </small>
        </section>
      </div>
    </AppChrome>
  );
}
