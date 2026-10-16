"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Mic, Send, Siren } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/common/Button";
import { Card, CardHeader } from "@/components/common/Card";
import { analyzeResqAi, sendResqAiSos } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import type { CreatedEmergency, ResqAiAnalysis, ResqAiConfidenceLabel, ResqAiSeverity } from "@/lib/types";

const EXAMPLES = [
  "How do I perform CPR?",
  "Someone is choking and can't breathe",
  "My friend fell and hit his head",
  "I got bitten by a snake",
  "I have a small cut",
  "Someone has severe bleeding",
];

function severityTone(severity: ResqAiSeverity) {
  if (severity === "CRITICAL") return "critical" as const;
  if (severity === "URGENT") return "high" as const;
  if (severity === "NON-URGENT") return "success" as const;
  return "neutral" as const;
}

function confidenceTone(label: ResqAiConfidenceLabel) {
  if (label === "HIGH") return "success" as const;
  if (label === "MEDIUM") return "medium" as const;
  return "neutral" as const;
}

function mapSosSeverity(severity: ResqAiSeverity): "low" | "medium" | "high" | "critical" {
  if (severity === "CRITICAL") return "critical";
  if (severity === "URGENT") return "high";
  if (severity === "NON-URGENT") return "medium";
  return "high";
}

function speechRecognitionCtor() {
  const speechWindow = window as Window & {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition || null;
}

interface BrowserSpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function readPosition(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Browser geolocation is not available."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(error.message || "Location permission was denied."));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 15000 },
    );
  });
}

export function ResqAiAssistant() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ResqAiAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [sosBusy, setSosBusy] = useState(false);
  const [sosError, setSosError] = useState<string | null>(null);
  const [createdSos, setCreatedSos] = useState<CreatedEmergency | null>(null);
  const [manualCoords, setManualCoords] = useState({ latitude: "", longitude: "" });
  const [needManualLocation, setNeedManualLocation] = useState(false);

  const voiceAvailable = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(speechRecognitionCtor());
  }, []);

  async function analyze(text = message) {
    const next = text.trim();
    if (!next) {
      setError("Enter a symptom, injury, or emergency question.");
      return;
    }
    setLoading(true);
    setError(null);
    setSosError(null);
    setCreatedSos(null);
    try {
      const analysis = await analyzeResqAi(next);
      setResult(analysis);
      setMessage(next);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof ApiError ? caught.message : "ResQ AI could not analyze this question.");
    } finally {
      setLoading(false);
    }
  }

  function startVoice() {
    const Ctor = speechRecognitionCtor();
    if (!Ctor) {
      setError("Voice input is not available in this browser. Chrome supports it.");
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const spoken = event.results[0]?.[0]?.transcript ?? "";
      if (spoken) {
        setMessage(spoken);
        void analyze(spoken);
      }
    };
    recognition.onerror = () => {
      setListening(false);
      setError("Voice input stopped before a phrase was captured.");
    };
    recognition.onend = () => setListening(false);
    setListening(true);
    setError(null);
    recognition.start();
  }

  async function sendSos() {
    if (!result) return;
    setSosBusy(true);
    setSosError(null);
    try {
      let latitude: number;
      let longitude: number;
      const typedLat = Number(manualCoords.latitude);
      const typedLng = Number(manualCoords.longitude);
      if (needManualLocation && Number.isFinite(typedLat) && Number.isFinite(typedLng)) {
        latitude = typedLat;
        longitude = typedLng;
      } else {
        try {
          const fix = await readPosition();
          latitude = fix.latitude;
          longitude = fix.longitude;
        } catch (locationError) {
          setNeedManualLocation(true);
          throw locationError instanceof Error
            ? locationError
            : new Error("Location is required for ResQNet SOS, the same as the Android app.");
        }
      }

      const emergency = await sendResqAiSos({
        latitude,
        longitude,
        description: `ResQ AI ${result.severity} ${result.intent}. Confidence ${(result.confidence * 100).toFixed(0)}%. Query: ${message}`,
        severity: mapSosSeverity(result.severity),
        messageId: `RESQ-AI-${crypto.randomUUID()}`,
      });
      setCreatedSos(emergency);
    } catch (caught) {
      setSosError(
        caught instanceof ApiError
          ? caught.message
          : caught instanceof Error
            ? caught.message
            : "SOS could not be sent through ResQNet.",
      );
    } finally {
      setSosBusy(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
      <Card>
        <CardHeader
          title="Ask ResQ AI"
          subtitle="Type a question or describe what you can see. Guidance comes from the first-aid dataset, not a diagnosis."
        />
        <div className="space-y-4 p-5">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted">Emergency or first-aid question</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={5}
              placeholder="Example: Someone is choking and cannot breathe"
              className="w-full rounded-lg border border-line bg-navy-950 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-cyan/40 focus:ring-1 focus:ring-cyan/40"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void analyze()} disabled={loading}>
              <Send className="size-4" aria-hidden="true" />
              {loading ? "Analyzing…" : "Ask ResQ AI"}
            </Button>
            <Button variant="secondary" onClick={startVoice} disabled={!voiceAvailable || listening || loading}>
              <Mic className="size-4" aria-hidden="true" />
              {listening ? "Listening…" : voiceAvailable ? "Voice input" : "Voice unavailable"}
            </Button>
          </div>
          {!voiceAvailable ? (
            <p className="text-xs text-muted">
              Chrome speech recognition is not available here. The Android app already uses the existing
              SpeechRecognizer for ResQ AI.
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="text-sm text-accent">
              {error}
            </p>
          ) : null}
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Try a real example</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  className="rounded-full border border-line px-3 py-1 text-xs text-muted hover:border-cyan/40 hover:text-ink"
                  onClick={() => void analyze(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Guidance" subtitle="Structured retrieval result from the live Express API." />
        <div className="space-y-4 p-5">
          {!result ? (
            <p className="text-sm text-muted">
              No analysis yet. Ask a question to retrieve first-aid guidance. Low-confidence matches will not invent a
              procedure.
            </p>
          ) : (
            <>
              {result.requiresSOS ? (
                <div className="rounded-lg border border-accent/40 bg-accent/10 p-3">
                  <p className="text-sm font-semibold text-accent">CRITICAL EMERGENCY DETECTED</p>
                  <p className="mt-1 text-xs text-muted">
                    Possible: {result.intent} · Confidence {Math.round(result.confidence * 100)}%
                  </p>
                </div>
              ) : null}

              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Emergency</dt>
                  <dd className="mt-1 text-sm text-ink">{result.intent}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Severity</dt>
                  <dd className="mt-1">
                    <Badge tone={severityTone(result.severity)}>{result.severity}</Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Confidence</dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm">
                    <Badge tone={confidenceTone(result.confidenceLabel)}>{result.confidenceLabel}</Badge>
                    <span>{Math.round(result.confidence * 100)}%</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">SOS</dt>
                  <dd className="mt-1 text-sm text-ink">{result.requiresSOS ? "Recommended" : "Not required from this match"}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Classifier confidence</dt>
                  <dd className="mt-1 text-sm text-ink">
                    {result.classifierConfidence != null
                      ? `${Math.round(result.classifierConfidence * 100)}%`
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Retrieval similarity</dt>
                  <dd className="mt-1 text-sm text-ink">
                    {result.retrievalSimilarity != null
                      ? `${Math.round(result.retrievalSimilarity * 100)}%`
                      : "—"}
                  </dd>
                </div>
              </dl>

              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Immediate first aid</h3>
                {result.steps.length > 0 ? (
                  <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-ink">
                    {result.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-2 text-sm text-ink">{result.answer}</p>
                )}
              </div>

              {result.requiresSOS ? (
                <div className="rounded-lg border border-accent/30 bg-navy-950 p-3">
                  <p className="mb-2 text-sm font-semibold text-accent">SEND SOS THROUGH RESQNET</p>
                  <p className="mb-3 text-xs text-muted">
                    This uses the existing <code>POST /api/emergency</code> SOS route. Location is required, matching
                    the Android SosCoordinator.
                  </p>
                  {needManualLocation ? (
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <input
                        value={manualCoords.latitude}
                        onChange={(event) =>
                          setManualCoords((current) => ({ ...current, latitude: event.target.value }))
                        }
                        placeholder="Latitude"
                        className="rounded-lg border border-line bg-navy-900 px-3 py-2 text-sm outline-none focus:border-cyan/40"
                      />
                      <input
                        value={manualCoords.longitude}
                        onChange={(event) =>
                          setManualCoords((current) => ({ ...current, longitude: event.target.value }))
                        }
                        placeholder="Longitude"
                        className="rounded-lg border border-line bg-navy-900 px-3 py-2 text-sm outline-none focus:border-cyan/40"
                      />
                    </div>
                  ) : null}
                  <Button variant="danger" onClick={() => void sendSos()} disabled={sosBusy}>
                    <Siren className="size-4" aria-hidden="true" />
                    {sosBusy ? "Sending SOS…" : "Send SOS through ResQNet"}
                  </Button>
                  {sosError ? (
                    <p role="alert" className="mt-2 text-sm text-accent">
                      {sosError}
                    </p>
                  ) : null}
                  {createdSos ? (
                    <p className="mt-2 text-sm text-ok">
                      SOS stored as emergency{" "}
                      <Link className="underline" href={`/emergencies/${createdSos.id}`}>
                        {createdSos.id}
                      </Link>
                      . It will appear on the Emergencies and Map screens.
                    </p>
                  ) : null}
                </div>
              ) : null}

              <p className="flex items-start gap-2 text-xs text-muted">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                {result.disclaimer}
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
