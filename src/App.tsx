import { useState, useEffect, useRef } from "react";

const PIZZA_IMG = "https://cdn.poehali.dev/projects/67fd2a68-693a-4617-800d-213242a11f1a/files/9511ab53-ce5b-4655-b69b-9fc1a0cb64aa.jpg";
const SUSHI_IMG = "https://cdn.poehali.dev/projects/67fd2a68-693a-4617-800d-213242a11f1a/files/fd0cd88a-f4c1-481e-b194-35d6cbd9230a.jpg";
const MACD_IMG = "https://cdn.poehali.dev/projects/67fd2a68-693a-4617-800d-213242a11f1a/files/459da22d-f1cd-4252-b1ed-daaf645c7cc8.jpg";

const NO_RESPONSES = [
  "Подумай ещё раз 🥺",
  "Ну пожалуйста... 💕",
  "Я буду очень-очень ждать 🙏",
  "Ариночка, ну же! 🌸",
  "Я приготовил кое-что особенное... 👀",
  "Ты точно не хочешь? Я умею готовить 😅",
  "Даже сердечки расстроились 💔",
  "Последний шанс сказать ДА! 🌹",
];

const FOOD_OPTIONS = [
  { id: "pizza", name: "Пицца", emoji: "🍕", img: PIZZA_IMG, desc: "Горячая, с сыром" },
  { id: "sushi", name: "Суши", emoji: "🍱", img: SUSHI_IMG, desc: "Свежие, нежные" },
  { id: "macd", name: "Макдональдс", emoji: "🍔", img: MACD_IMG, desc: "Быстро и весело" },
];

const DATES = [
  { id: "june20", label: "20 июня", sub: "Пятница", emoji: "🌸" },
  { id: "june21", label: "21 июня", sub: "Суббота", emoji: "🌹" },
];

const TIMES = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

type Step = "invite" | "food" | "date" | "time" | "message" | "final";

const FloatingHearts = () => {
  const hearts = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 0.8 + Math.random() * 1.4,
    duration: 5 + Math.random() * 8,
    delay: Math.random() * 6,
    top: Math.random() * 100,
    emoji: ["💕", "💗", "🌸", "✨", "💖", "🌷"][Math.floor(Math.random() * 6)],
  }));

  return (
    <div className="hearts-bg">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart"
          style={{
            left: `${h.left}%`,
            top: `${h.top}%`,
            fontSize: `${h.size}rem`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  );
};

const ProgressDots = ({ current }: { current: Step }) => {
  const steps: Step[] = ["invite", "food", "date", "time", "message", "final"];
  const idx = steps.indexOf(current);
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="transition-all duration-500 rounded-full"
          style={{
            width: i === idx ? "28px" : "8px",
            height: "8px",
            background: i <= idx ? "linear-gradient(90deg, #e8789a, #f472b6)" : "#f9c6d8",
          }}
        />
      ))}
    </div>
  );
};

const Confetti = () => {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: ["#f472b6", "#e8789a", "#fce4ec", "#c04070", "#fff0f5", "#f9a8d4"][Math.floor(Math.random() * 6)],
    size: 6 + Math.random() * 10,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2,
    shape: Math.random() > 0.5 ? "50%" : "2px",
  }));

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 999 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "-10px",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<Step>("invite");
  const [noCount, setNoCount] = useState(0);
  const [noMessage, setNoMessage] = useState("");
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const go = (next: Step) => {
    setPageKey((k) => k + 1);
    setStep(next);
  };

  const handleNo = () => {
    const msg = NO_RESPONSES[noCount % NO_RESPONSES.length];
    setNoMessage(msg);
    setNoCount((c) => c + 1);
  };

  useEffect(() => {
    if (step === "final") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      if (audioRef.current) {
        audioRef.current.volume = 0.35;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [step]);

  const selectedDateLabel = DATES.find((d) => d.id === selectedDate)?.label;
  const selectedFoodLabel = FOOD_OPTIONS.find((f) => f.id === selectedFood)?.name;

  return (
    <div className="min-h-screen relative overflow-hidden font-cormorant" style={{ background: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 50%, #fdf0f7 100%)" }}>
      <FloatingHearts />
      {showConfetti && <Confetti />}

      <audio ref={audioRef} loop>
        <source src="https://cdn.pixabay.com/audio/2022/02/22/audio_d1718ab41b.mp3" type="audio/mpeg" />
      </audio>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {step !== "invite" && step !== "final" && <ProgressDots current={step} />}

        {/* ШАГ 1: ПРИГЛАШЕНИЕ */}
        {step === "invite" && (
          <div key={pageKey} className="page-transition text-center max-w-lg mx-auto">
            <div className="text-6xl mb-4 animate-heartbeat inline-block">💝</div>
            <h1
              className="text-5xl md:text-6xl font-light mb-2 shimmer-text"
              style={{ fontFamily: "Cormorant Garamond, serif", lineHeight: 1.2 }}
            >
              Арина...
            </h1>
            <div className="section-divider my-5" />
            <p className="text-3xl md:text-4xl font-light mb-2" style={{ color: "#8b3a5a" }}>
              Пойдёшь ли ты на свидание
            </p>
            <p className="text-2xl md:text-3xl mb-8" style={{ fontFamily: "Caveat, cursive", color: "#c04070" }}>
              со мной? 🌸
            </p>

            <div className="card-romantic p-8 mb-8 mx-auto max-w-sm">
              <p className="text-lg text-center" style={{ color: "#9b4f6e", fontStyle: "italic" }}>
                Я, Артём, хочу провести с тобой<br />
                незабываемый вечер 💕
              </p>
            </div>

            {noMessage && (
              <div className="animate-bounce-in mb-6 px-6 py-3 rounded-full inline-block"
                style={{ background: "linear-gradient(135deg, #ffe0ea, #ffc6d5)", color: "#c0234f" }}>
                <span className="text-xl" style={{ fontFamily: "Caveat, cursive", fontWeight: 600 }}>
                  {noMessage}
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-romantic text-xl px-12 py-4" onClick={() => go("food")}>
                Да, конечно! 💕
              </button>
              <button className="btn-no" onClick={handleNo}>
                Нет...
              </button>
            </div>
          </div>
        )}

        {/* ШАГ 2: ЕДА */}
        {step === "food" && (
          <div key={pageKey} className="page-transition text-center max-w-2xl mx-auto w-full">
            <div className="text-5xl mb-4">🍽️</div>
            <h2 className="text-4xl md:text-5xl font-light mb-2 shimmer-text">
              Что будем кушать?
            </h2>
            <p className="text-xl mb-8" style={{ fontFamily: "Caveat, cursive", color: "#c04070" }}>
              Выбери, что тебе по душе
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {FOOD_OPTIONS.map((food, i) => (
                <div
                  key={food.id}
                  className={`food-card ${selectedFood === food.id ? "selected" : ""}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => setSelectedFood(food.id)}
                >
                  <div className="relative overflow-hidden" style={{ height: "180px" }}>
                    <img
                      src={food.img}
                      alt={food.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{ transform: selectedFood === food.id ? "scale(1.08)" : "scale(1)" }}
                    />
                    {selectedFood === food.id && (
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(232,120,154,0.25)" }}>
                        <span className="text-4xl">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-2xl mb-1">{food.emoji}</div>
                    <h3 className="text-2xl font-medium" style={{ color: "#8b3a5a" }}>{food.name}</h3>
                    <p className="text-sm" style={{ fontFamily: "Caveat, cursive", color: "#c04070" }}>{food.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-romantic"
              style={{ opacity: selectedFood ? 1 : 0.5, cursor: selectedFood ? "pointer" : "not-allowed" }}
              onClick={() => selectedFood && go("date")}
            >
              Вперёд! →
            </button>
          </div>
        )}

        {/* ШАГ 3: ДАТА */}
        {step === "date" && (
          <div key={pageKey} className="page-transition text-center max-w-md mx-auto w-full">
            <div className="text-5xl mb-4">📅</div>
            <h2 className="text-4xl md:text-5xl font-light mb-2 shimmer-text">
              Когда встретимся?
            </h2>
            <p className="text-xl mb-8" style={{ fontFamily: "Caveat, cursive", color: "#c04070" }}>
              Выбери подходящий день 🌸
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {DATES.map((d) => (
                <button
                  key={d.id}
                  className={`date-btn ${selectedDate === d.id ? "selected" : ""}`}
                  onClick={() => setSelectedDate(d.id)}
                >
                  <div className="text-3xl mb-2">{d.emoji}</div>
                  <div className="text-3xl font-medium" style={{ color: "#8b3a5a" }}>{d.label}</div>
                  <div className="text-sm mt-1" style={{ fontFamily: "Caveat, cursive", color: "#c04070" }}>{d.sub}</div>
                  {selectedDate === d.id && (
                    <div className="mt-2 text-lg" style={{ color: "#e8789a" }}>💕 Выбрано!</div>
                  )}
                </button>
              ))}
            </div>

            <button
              className="btn-romantic"
              style={{ opacity: selectedDate ? 1 : 0.5, cursor: selectedDate ? "pointer" : "not-allowed" }}
              onClick={() => selectedDate && go("time")}
            >
              Далее →
            </button>
          </div>
        )}

        {/* ШАГ 4: ВРЕМЯ */}
        {step === "time" && (
          <div key={pageKey} className="page-transition text-center max-w-lg mx-auto w-full">
            <div className="text-5xl mb-4">⏰</div>
            <h2 className="text-4xl md:text-5xl font-light mb-2 shimmer-text">
              В котором часу?
            </h2>
            <p className="text-xl mb-8" style={{ fontFamily: "Caveat, cursive", color: "#c04070" }}>
              Выбери время встречи 💫
            </p>

            <div className="card-romantic p-6 mb-6">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {TIMES.map((t) => (
                  <button
                    key={t}
                    className={`time-btn ${selectedTime === t ? "selected" : ""}`}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {selectedTime && (
              <p className="text-lg mb-4 animate-fade-in-scale" style={{ fontFamily: "Caveat, cursive", color: "#c04070" }}>
                💕 Встречаемся в {selectedTime}!
              </p>
            )}

            <button
              className="btn-romantic"
              style={{ opacity: selectedTime ? 1 : 0.5, cursor: selectedTime ? "pointer" : "not-allowed" }}
              onClick={() => selectedTime && go("message")}
            >
              Последний шаг →
            </button>
          </div>
        )}

        {/* ШАГ 5: СООБЩЕНИЕ */}
        {step === "message" && (
          <div key={pageKey} className="page-transition text-center max-w-lg mx-auto w-full">
            <div className="text-5xl mb-4">💌</div>
            <h2 className="text-4xl md:text-5xl font-light mb-2 shimmer-text">
              Напиши мне
            </h2>
            <p className="text-xl mb-6" style={{ fontFamily: "Caveat, cursive", color: "#c04070" }}>
              Пожелание, комментарий — всё что угодно 🌷
            </p>

            <div className="card-romantic p-6 mb-6">
              <textarea
                className="w-full border-none outline-none resize-none"
                style={{
                  fontFamily: "Caveat, cursive",
                  color: "#8b3a5a",
                  background: "transparent",
                  fontSize: "1.4rem",
                  minHeight: "140px",
                }}
                placeholder="Например: жду не дождусь! 🥰"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button className="btn-romantic" onClick={() => go("final")}>
              {message ? "Отправить 💕" : "Пропустить →"}
            </button>
          </div>
        )}

        {/* ШАГ 6: ФИНАЛ */}
        {step === "final" && (
          <div key={pageKey} className="page-transition text-center max-w-lg mx-auto w-full">
            <div className="text-7xl mb-6 animate-heartbeat inline-block">💖</div>
            <h2 className="text-5xl md:text-6xl font-light mb-3" style={{ fontFamily: "Cormorant Garamond, serif", color: "#8b3a5a", lineHeight: 1.2 }}>
              Ура, Арина! 🎉
            </h2>
            <p className="text-2xl mb-2 shimmer-text font-light">
              Жду тебя с нетерпением!
            </p>

            <div className="section-divider my-6" />

            <div className="card-romantic p-7 mb-6 text-left">
              <p className="text-center text-xl mb-5" style={{ fontFamily: "Caveat, cursive", color: "#9b4f6e" }}>
                ✨ Наше свидание:
              </p>
              <div className="space-y-4">
                {selectedFoodLabel && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍽️</span>
                    <div>
                      <div className="text-sm" style={{ color: "#c07090" }}>Кухня</div>
                      <div className="text-2xl font-medium" style={{ color: "#8b3a5a" }}>{selectedFoodLabel}</div>
                    </div>
                  </div>
                )}
                {selectedDateLabel && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <div className="text-sm" style={{ color: "#c07090" }}>Дата</div>
                      <div className="text-2xl font-medium" style={{ color: "#8b3a5a" }}>{selectedDateLabel} июня</div>
                    </div>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <div className="text-sm" style={{ color: "#c07090" }}>Время</div>
                      <div className="text-2xl font-medium" style={{ color: "#8b3a5a" }}>{selectedTime}</div>
                    </div>
                  </div>
                )}
                {message && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💌</span>
                    <div>
                      <div className="text-sm" style={{ color: "#c07090" }}>Сообщение</div>
                      <div className="text-xl" style={{ fontFamily: "Caveat, cursive", color: "#8b3a5a" }}>"{message}"</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-romantic p-6 mb-6" style={{ background: "linear-gradient(135deg, rgba(252,228,236,0.8), rgba(255,240,245,0.9))" }}>
              <p className="text-2xl text-center" style={{ fontFamily: "Caveat, cursive", color: "#8b3a5a", lineHeight: 1.6 }}>
                💕 Ариночка, ты делаешь меня<br />
                самым счастливым человеком!<br />
                <span className="text-xl">— Артём 🌹</span>
              </p>
            </div>

            <button
              className="btn-romantic"
              onClick={() => {
                setStep("invite");
                setNoCount(0);
                setNoMessage("");
                setSelectedFood(null);
                setSelectedDate(null);
                setSelectedTime(null);
                setMessage("");
                setPageKey((k) => k + 1);
              }}
            >
              💕 Перечитать
            </button>

            <p className="mt-6 text-4xl animate-heartbeat inline-block">💗</p>
          </div>
        )}
      </div>
    </div>
  );
}
