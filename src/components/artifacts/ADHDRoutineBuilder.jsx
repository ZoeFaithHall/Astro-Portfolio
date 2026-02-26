import { useState } from "react";

const STEPS = [
  {
    id: "setup",
    question: "What's your work setup?",
    type: "single",
    options: [
      { label: "Single job", value: "single" },
      { label: "Two streams (W-2 + contract, two jobs, etc.)", value: "dual" },
      { label: "Freelance / multiple clients", value: "freelance" },
      { label: "Student", value: "student" },
    ],
  },
  {
    id: "stream1",
    question: "What do you call your first work stream?",
    type: "text",
    placeholder: "e.g. Day job, Primary, School, Client A",
  },
  {
    id: "stream2",
    question: "What do you call your second work stream?",
    type: "text",
    placeholder: "e.g. Side project, Contract, Freelance, Research",
    showIf: (answers) =>
      answers.setup !== "single" && answers.setup !== "student",
  },
  {
    id: "peak",
    question: "When is your brain sharpest?",
    type: "single",
    options: [
      { label: "Morning — I front-load deep work", value: "morning" },
      { label: "Afternoon — I warm up slowly", value: "afternoon" },
      { label: "Evening — I'm a night owl", value: "evening" },
      { label: "It changes — no consistent pattern", value: "varies" },
    ],
  },
  {
    id: "comms",
    question: "How do you communicate for work?",
    type: "multi",
    options: [
      { label: "Slack", value: "Slack" },
      { label: "Email", value: "email" },
      { label: "Teams", value: "Teams" },
      { label: "Discord", value: "Discord" },
      { label: "Text / iMessage", value: "text" },
    ],
  },
  {
    id: "taskTool",
    question: "What's your task manager?",
    type: "single",
    options: [
      { label: "Todoist", value: "Todoist" },
      { label: "Notion", value: "Notion" },
      { label: "Apple Reminders", value: "Reminders" },
      { label: "Asana / Linear / Jira", value: "project tool" },
      { label: "Pen and paper", value: "notebook" },
      { label: "I don't have one yet", value: "task manager" },
    ],
  },
  {
    id: "timeTrack",
    question: "Do you need to track billable hours?",
    type: "single",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    showIf: (answers) =>
      answers.setup !== "single" && answers.setup !== "student",
  },
  {
    id: "breaks",
    question: "What resets your brain between tasks?",
    type: "multi",
    options: [
      { label: "Walking", value: "walk" },
      { label: "Snack / coffee", value: "snack" },
      { label: "Music", value: "music" },
      { label: "Quick stretch", value: "stretch" },
      { label: "Scroll my phone (honest)", value: "phone" },
      { label: "Literally nothing — I just stare", value: "stare" },
    ],
  },
  {
    id: "struggle",
    question: "What's your biggest ADHD challenge at work?",
    type: "multi",
    options: [
      { label: "Starting tasks", value: "initiation" },
      { label: "Finishing tasks", value: "completion" },
      { label: "Context switching", value: "switching" },
      { label: "Time blindness", value: "time" },
      { label: "Remembering what I was doing", value: "memory" },
      { label: "Overwhelm / paralysis", value: "overwhelm" },
    ],
  },
];

function buildRoutine(a) {
  const isDual = a.setup === "dual" || a.setup === "freelance";
  const stream1 = a.stream1 || (a.setup === "student" ? "Study" : "Work");
  const stream2 = a.stream2 || "Side project";
  const commsStr = (a.comms || []).join(" / ") || "messages";
  const taskTool = a.taskTool || "task manager";
  const breakList = (a.breaks || [])
    .map((b) => {
      const map = {
        walk: "walk",
        snack: "snack",
        music: "music",
        stretch: "stretch",
        phone: "phone break",
        stare: "zone out",
      };
      return map[b] || b;
    })
    .slice(0, 3)
    .join(", ");
  const breakText = breakList || "step away from screens";
  const struggles = a.struggle || [];
  const needsTimer = a.timeTrack === true;

  const peakLabel =
    {
      morning: "Morning",
      afternoon: "Afternoon",
      evening: "Evening",
      varies: "Whenever focus hits",
    }[a.peak] || "Morning";

  const blocks = [];

  blocks.push({
    when: "Start of day",
    what: `Open ${taskTool}, read today's tasks, pick <strong>ONE anchor task</strong>`,
    time: "5 min",
  });

  blocks.push({ divider: isDual ? stream1 : peakLabel });

  blocks.push({
    when: "Comms batch",
    what: `Check ${commsStr} — <strong>respond in one batch, then close</strong>`,
    time: "15 min",
  });

  if (needsTimer) {
    blocks.push({
      when: `${stream1} block`,
      what: `<strong>Start timer</strong>, then deep work on your anchor task`,
      time: "flexible",
    });
  } else {
    blocks.push({
      when: "Focus block",
      what: `Deep work on your anchor task — <strong>one thing, no tabs, no ${commsStr.split(" / ")[0]}</strong>`,
      time: "flexible",
    });
  }

  blocks.push({ divider: "Break", boundary: true });

  blocks.push({
    when: "Real break",
    what: `${breakText.charAt(0).toUpperCase() + breakText.slice(1)} — away from work. This is not optional.`,
    time: "30+ min",
    boundary: true,
  });

  if (isDual) {
    blocks.push({ divider: stream2 });

    blocks.push({
      when: "Re-anchor",
      what: `Switch context to ${stream2} — <strong>${needsTimer ? "start timer, " : ""}check comms, pick your anchor</strong>`,
      time: "5 min",
    });

    blocks.push({
      when: `${stream2} block`,
      what: `Deep work — <strong>${needsTimer ? "timer running, " : ""}one task at a time</strong>`,
      time: "flexible",
    });
  } else {
    blocks.push({ divider: "Afternoon" });

    blocks.push({
      when: "Re-anchor",
      what: `Check your anchor task — <strong>done? Pick the next. Not done? Keep going.</strong>`,
      time: "2 min",
    });

    blocks.push({
      when: "Focus block",
      what: `Second deep work session — <strong>ride momentum or switch if stuck</strong>`,
      time: "flexible",
    });
  }

  blocks.push({ divider: "Shutdown" });

  const endWhat = needsTimer
    ? `<strong>Stop timer</strong>, then note where you left off in ${taskTool}`
    : `<strong>Note where you left off</strong> — one sentence in ${taskTool}`;

  blocks.push({ when: "End of work", what: endWhat, time: "5 min" });
  blocks.push({
    when: "Done",
    what: "Close all work tabs. You are off. Respect the boundary.",
    time: "0 min",
    boundary: true,
  });

  const rules = [];

  rules.push({
    label: "01",
    text: `<strong>One anchor task${isDual ? " per stream" : ""}.</strong> Not five priorities. Not a ranked list. One thing that, if you do nothing else, means the day was productive.`,
  });

  rules.push({
    label: "02",
    text: `<strong>Batch ${commsStr.split(" / ")[0]}, don't drip it.</strong> Checking messages every 10 minutes is not working — it's interrupting. Set windows and close the app between them.`,
  });

  if (struggles.includes("switching")) {
    rules.push({
      label: "03",
      text: `<strong>Transitions need time.</strong> Context switching is the ADHD tax. Build buffers between tasks or you'll bleed one into the next and finish neither.`,
    });
  } else if (struggles.includes("time")) {
    rules.push({
      label: "03",
      text: `<strong>Set timers, not intentions.</strong> Time blindness means "I'll do it for 30 minutes" becomes 3 hours or 3 minutes. Use a real timer. Every time.`,
    });
  } else {
    rules.push({
      label: "03",
      text: `<strong>Transitions need time.</strong> Context switching is the ADHD tax. Build buffers between tasks or you'll bleed one into the next and finish neither.`,
    });
  }

  rules.push({
    label: "04",
    text: `<strong>Note where you left off.</strong> Future you will not remember. One sentence saves thirty minutes of context recovery tomorrow morning.`,
  });

  const emergencies = [];

  if (struggles.includes("initiation") || struggles.includes("overwhelm")) {
    emergencies.push({
      title: '"I can\'t start anything"',
      text: `Open ${taskTool} filtered to quick wins. Do the smallest possible thing. Momentum usually follows. If it doesn't — ${breakList.split(",")[0] || "walk"} for 10 minutes and try once more.`,
    });
  } else {
    emergencies.push({
      title: '"I can\'t start anything"',
      text: `Open ${taskTool} and find the smallest task. Do just that. Momentum usually follows. If not, take a 10 minute break and try again.`,
    });
  }

  if (struggles.includes("completion")) {
    emergencies.push({
      title: '"I can\'t finish anything"',
      text: "If you're endlessly polishing one thing while ignoring another — that's perfectionism masking avoidance. Ship the 80% version. Move on. You can iterate later.",
    });
  } else if (struggles.includes("memory")) {
    emergencies.push({
      title: '"I forgot what I was doing"',
      text: `Check ${taskTool} for your last note. If there isn't one, check your browser history, recent files, and ${commsStr.split(" / ")[0]} timestamps to reconstruct. Then write the note you should have written.`,
    });
  } else {
    emergencies.push({
      title: '"I\'m overwhelmed"',
      text: "Look at only one project. What's the single most urgent thing? Do that. Ignore everything else for 90 minutes. Then reassess.",
    });
  }

  return { blocks, rules, emergencies, isDual, stream1, stream2 };
}

function QuestionStep({
  step,
  value,
  onChange,
  onNext,
  onBack,
  current,
  total,
}) {
  const isText = step.type === "text";
  const isMulti = step.type === "multi";

  const handleSelect = (val) => {
    if (isMulti) {
      const arr = Array.isArray(value) ? value : [];
      onChange(
        arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
      );
    } else {
      onChange(val);
    }
  };

  const canContinue = isText
    ? value && value.trim()
    : isMulti
      ? Array.isArray(value) && value.length > 0
      : value !== undefined && value !== null;

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          color: "#555",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        Step {current} of {total}
      </div>
      <h2
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 28,
          fontWeight: 600,
          color: "#e8e8e8",
          marginBottom: 32,
          letterSpacing: -0.5,
          lineHeight: 1.3,
        }}
      >
        {step.question}
      </h2>

      {isText ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && canContinue && onNext()}
          placeholder={step.placeholder}
          autoFocus
          style={{
            width: "100%",
            maxWidth: 400,
            padding: "14px 18px",
            background: "#111",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#e8e8e8",
            fontSize: 16,
            fontFamily: "'Outfit', sans-serif",
            outline: "none",
          }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxWidth: 480,
          }}
        >
          {step.options.map((opt) => {
            const selected = isMulti
              ? Array.isArray(value) && value.includes(opt.value)
              : value === opt.value;
            return (
              <button
                key={String(opt.value)}
                onClick={() => {
                  handleSelect(opt.value);
                  if (!isMulti) setTimeout(onNext, 200);
                }}
                style={{
                  padding: "14px 20px",
                  background: selected ? "rgba(194,240,25,0.1)" : "#111",
                  border: `1px solid ${selected ? "rgba(194,240,25,0.4)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 8,
                  color: selected ? "#C2F019" : "#aaa",
                  fontSize: 15,
                  fontFamily: "'Outfit', sans-serif",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                {isMulti && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: `1.5px solid ${selected ? "#C2F019" : "#555"}`,
                      marginRight: 12,
                      verticalAlign: "middle",
                      position: "relative",
                      top: -1,
                      background: selected
                        ? "rgba(194,240,25,0.2)"
                        : "transparent",
                      textAlign: "center",
                      lineHeight: "16px",
                      fontSize: 12,
                    }}
                  >
                    {selected ? "✓" : ""}
                  </span>
                )}
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        {current > 1 && (
          <button
            onClick={onBack}
            style={{
              padding: "10px 24px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              color: "#888",
              fontSize: 14,
              fontFamily: "'Outfit', sans-serif",
              cursor: "pointer",
            }}
          >
            Back
          </button>
        )}
        {(isText || isMulti) && (
          <button
            onClick={onNext}
            disabled={!canContinue}
            style={{
              padding: "10px 24px",
              background: canContinue ? "#C2F019" : "#333",
              border: "none",
              borderRadius: 6,
              color: canContinue ? "#0a0a0a" : "#666",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              cursor: canContinue ? "pointer" : "not-allowed",
            }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function RoutineDashboard({ data, onReset }) {
  const { blocks, rules, emergencies } = data;

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 56,
        }}
      >
        <div>
          <div
            style={{
              color: "#C2F019",
              fontSize: 28,
              marginBottom: 20,
              animation: "spin 20s linear infinite",
            }}
          >
            ✺
          </div>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 42,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              marginBottom: 12,
              color: "#e8e8e8",
            }}
          >
            Your Daily <span style={{ color: "#C2F019" }}>Routine</span>
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#888",
              fontWeight: 300,
              letterSpacing: 0.3,
              maxWidth: 500,
              lineHeight: 1.6,
            }}
          >
            Built for your brain. Not a productivity system — a survival
            framework.
          </p>
        </div>
        <button
          onClick={onReset}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 6,
            color: "#555",
            fontSize: 12,
            fontFamily: "'Space Mono', monospace",
            cursor: "pointer",
            letterSpacing: 1,
            marginTop: 8,
          }}
        >
          REDO
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {blocks.map((b, i) => {
          if (b.divider) {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "28px 0",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "linear-gradient(90deg, #C2F019, transparent)",
                    opacity: 0.2,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 3,
                    color: "#555",
                  }}
                >
                  {b.divider}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: "linear-gradient(90deg, transparent, #C2F019)",
                    opacity: 0.2,
                  }}
                />
              </div>
            );
          }
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 80px",
                alignItems: "center",
                padding: "20px 24px",
                background: b.boundary ? "rgba(194,240,25,0.03)" : "#111",
                border: `1px solid ${b.boundary ? "rgba(194,240,25,0.08)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 8,
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  color: "#C2F019",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                  opacity: b.boundary ? 0.7 : 1,
                }}
              >
                {b.when}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: b.boundary ? "#888" : "#e8e8e8",
                  lineHeight: 1.4,
                  paddingRight: 16,
                  fontStyle: b.boundary ? "italic" : "normal",
                }}
                dangerouslySetInnerHTML={{ __html: b.what }}
              />
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  color: "#555",
                  textAlign: "right",
                  letterSpacing: 0.5,
                }}
              >
                {b.time}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        {rules.map((r, i) => (
          <div
            key={i}
            style={{
              padding: 24,
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              background: "#111",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#C2F019",
                marginBottom: 10,
                opacity: 0.7,
              }}
            >
              Rule {r.label}
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#888",
                lineHeight: 1.6,
                fontWeight: 300,
              }}
              dangerouslySetInnerHTML={{ __html: r.text }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 40,
          textAlign: "center",
          padding: 40,
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          background: "rgba(194,240,25,0.06)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -14,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 20,
            color: "#C2F019",
            background: "#0a0a0a",
            padding: "0 16px",
          }}
        >
          ✺
        </div>
        <p
          style={{
            fontSize: 15,
            color: "#888",
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        >
          <strong style={{ color: "#C2F019", fontWeight: 600 }}>
            Not every day needs to be a 10.
          </strong>
          <br />
          A minimum viable day is: one meaningful thing shipped,
          <br />
          comms checked once, and a note for tomorrow.
          <br />
          That's a win. Protect the streak, not the score.
        </p>
      </div>

      <div style={{ marginTop: 40 }}>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#555",
            marginBottom: 16,
          }}
        >
          When the system breaks
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {emergencies.map((e, i) => (
            <div
              key={i}
              style={{
                padding: 20,
                border: "1px solid rgba(255,100,100,0.1)",
                borderRadius: 8,
                background: "rgba(255,100,100,0.02)",
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e8e8e8",
                  marginBottom: 8,
                }}
              >
                {e.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#888",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                {e.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 56,
          padding: 28,
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 12,
          background: "#111",
        }}
      >
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#C2F019",
            marginBottom: 20,
            opacity: 0.7,
          }}
        >
          Keep this on your desktop
        </div>
        <p
          style={{
            fontSize: 14,
            color: "#888",
            lineHeight: 1.6,
            fontWeight: 300,
            marginBottom: 20,
          }}
        >
          Save this page, then pin it so it launches every time you restart. No
          app to remember. No habit to build. It's just there.
        </p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "#e8e8e8",
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              MAC
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "Open this page in Chrome",
                "⋮ menu → Save and Share → Create Shortcut",
                'Check "Open as window"',
                "System Settings → General → Login Items → add it",
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 13,
                    color: "#888",
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      color: "#C2F019",
                      opacity: 0.5,
                      minWidth: 20,
                    }}
                  >
                    {i + 1}.
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: "#e8e8e8",
                letterSpacing: 1,
                marginBottom: 12,
              }}
            >
              WINDOWS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "Open this page in Chrome or Edge",
                "⋮ menu → More Tools → Create Shortcut",
                'Check "Open as window"',
                "Move shortcut to Startup folder (shell:startup)",
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 13,
                    color: "#888",
                    fontWeight: 300,
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 11,
                      color: "#C2F019",
                      opacity: 0.5,
                      minWidth: 20,
                    }}
                  >
                    {i + 1}.
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 48,
          textAlign: "center",
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          color: "#555",
          letterSpacing: 1,
        }}
      >
        SYSTEMS OVER WILLPOWER
      </div>
    </div>
  );
}

export default function ADHDRoutineBuilder() {
  const [answers, setAnswers] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  const visibleSteps = STEPS.filter((s) => !s.showIf || s.showIf(answers));
  const step = visibleSteps[currentStep];

  const handleNext = () => {
    if (currentStep < visibleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setDone(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setDone(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
      `}</style>
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0a0a",
          color: "#e8e8e8",
          fontFamily: "'Outfit', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(194,240,25,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(194,240,25,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "60px 32px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {!done ? (
            <>
              <div
                style={{
                  color: "#C2F019",
                  fontSize: 28,
                  marginBottom: 40,
                  animation: "spin 20s linear infinite",
                }}
              >
                ✺
              </div>
              {step && (
                <QuestionStep
                  step={step}
                  value={answers[step.id]}
                  onChange={(val) => setAnswers({ ...answers, [step.id]: val })}
                  onNext={handleNext}
                  onBack={handleBack}
                  current={currentStep + 1}
                  total={visibleSteps.length}
                />
              )}
            </>
          ) : (
            <RoutineDashboard
              data={buildRoutine(answers)}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </>
  );
}
