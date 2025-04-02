"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const cardValues = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7,
  "8": 8, "9": 9, "10": 10, "J": 10, "Q": 10, "K": 10, "A": 11,
} as const;

const emojiCards: { [key in keyof typeof cardValues]: string } = {
  "2": "2️⃣", "3": "3️⃣", "4": "4️⃣", "5": "5️⃣", "6": "6️⃣", "7": "7️⃣",
  "8": "8️⃣", "9": "9️⃣", "10": "🔟", "J": "🃏", "Q": "👸", "K": "🤴", "A": "🅰️"
};

const cards = Object.keys(cardValues);

const getRecommendation = (userCards: string[], dealerCard: string): string => {
  const hasAce = userCards.includes("A");
  const total = userCards.reduce(
    (sum, c) => sum + (c === "A" ? 1 : cardValues[c as keyof typeof cardValues]),
    0
  );
  const softTotal = hasAce ? total + 10 : total;

  if (userCards.length === 2 && userCards[0] === userCards[1]) {
    const pair = userCards[0];
    if (["A", "8"].includes(pair)) return "SPLIT";
    if (["10", "J", "Q", "K"].includes(pair)) return "STAND";
    if (pair === "9" && !["7", "10", "A", "J", "Q", "K"].includes(dealerCard)) return "SPLIT";
    if (pair === "7" && ["2", "3", "4", "5", "6", "7"].includes(dealerCard)) return "SPLIT";
    if (pair === "6" && ["2", "3", "4", "5", "6"].includes(dealerCard)) return "SPLIT";
    if (pair === "4" && ["5", "6"].includes(dealerCard)) return "SPLIT";
    if (pair === "3" && ["2", "3", "4", "5", "6", "7"].includes(dealerCard)) return "SPLIT";
    if (pair === "2" && ["2", "3", "4", "5", "6", "7"].includes(dealerCard)) return "SPLIT";
  }

  if (softTotal === 13 || softTotal === 14) {
    if (["5", "6"].includes(dealerCard)) return "DOUBLE";
  }
  if (softTotal === 15 || softTotal === 16) {
    if (["4", "5", "6"].includes(dealerCard)) return "DOUBLE";
  }
  if (softTotal === 17) {
    if (["3", "4", "5", "6"].includes(dealerCard)) return "DOUBLE";
  }
  if (softTotal === 18) {
    if (["3", "4", "5", "6"].includes(dealerCard)) return "DOUBLE";
  }
  if (!hasAce && total === 9 && ["3", "4", "5", "6"].includes(dealerCard)) return "DOUBLE";
  if (!hasAce && total === 10 && ["2", "3", "4", "5", "6", "7", "8", "9"].includes(dealerCard)) return "DOUBLE";
  if (!hasAce && total === 11 && dealerCard !== "A") return "DOUBLE";

  if (hasAce) {
    if (softTotal >= 19) return "STAND";
    if (softTotal === 18 && ["9", "10", "J", "Q", "K", "A"].includes(dealerCard)) return "HIT";
    if (softTotal === 18) return "STAND";
    if (softTotal <= 17) return "HIT";
  }

  if (total >= 17) return "STAND";
  if (total <= 11) return "HIT";
  if (total === 12 && ["4", "5", "6"].includes(dealerCard)) return "STAND";
  if (total >= 13 && total <= 16 && ["2", "3", "4", "5", "6"].includes(dealerCard)) return "STAND";

  return "HIT";
};

export default function Home() {
  const [userCards, setUserCards] = useState<string[]>(["", ""]);
  const [dealerCard, setDealerCard] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const handleCardChange = (index: number, value: string) => {
    const updated = [...userCards];
    updated[index] = value;
    setUserCards(updated);
  };

  const calculate = () => {
    if (userCards.includes("") || !dealerCard) {
      alert("Введите все карты");
      return;
    }
    const rec = getRecommendation(userCards, dealerCard);
    setResult(rec);
  };

  const resultColor = {
    HIT: "text-red-600",
    STAND: "text-green-600",
    DOUBLE: "text-yellow-500",
    SPLIT: "text-yellow-500",
  }[result || ""];

  return (
    <main  text-center p-8`}>
      <div className="flex justify-between max-w-md mx-auto mb-4">
        <h1 className="text-4xl font-bold">🎴 Блэкджек</h1>
        <button
          className="text-sm px-3 py-1 border rounded-xl shadow bg-white/10 hover:bg-white/20"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Светлая" : "🌙 Тёмная"}
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-md mx-auto bg-white/70 dark:bg-gray-800 shadow-xl rounded-2xl p-6">
        <div>
          <p className="mb-2 font-semibold text-lg">Твои карты:</p>
          <div className="flex justify-center gap-3">
            {userCards.map((card, idx) => (
              <select
                key={idx}
                className="border rounded-xl px-3 py-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white shadow-sm"
                value={card}
                onChange={(e) => handleCardChange(idx, e.target.value)}
              >
                <option value="">--</option>
                {cards.map((c) => (
                  <option key={c} value={c}>{emojiCards[c as keyof typeof emojiCards]}</option>
                ))}
              </select>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-lg">Карта дилера:</p>
          <select
            className="border rounded-xl px-3 py-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white shadow-sm"
            value={dealerCard}
            onChange={(e) => setDealerCard(e.target.value)}
          >
            <option value="">--</option>
            {cards.map((c) => (
              <option key={c} value={c}>{emojiCards[c as keyof typeof emojiCards]}</option>
            ))}
          </select>
        </div>

        <button
          onClick={calculate}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-xl transition-all duration-300 shadow-lg"
        >
          🧠 Рассчитать
        </button>

        {result && (
          <div>
            👉 Рекомендация: <span className="underline">{result}</span>
          </div>
        )}
      </div>
    </main>
  );
}
