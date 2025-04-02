import { useState } from "react";

const cardValues: { [key: string]: number } = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
  "7": 7, "8": 8, "9": 9, "10": 10,
  J: 10, Q: 10, K: 10, A: 1,
};

const getRecommendation = (userCards: string[], dealerCard: string): string => {
  const total = userCards.reduce((sum, c) => sum + (c === "A" ? 1 : cardValues[c]), 0);
  if (total >= 17) return "STAND";
  if (total <= 11) return "HIT";
  return dealerCard === "A" || cardValues[dealerCard] >= 7 ? "HIT" : "STAND";
};

export default function Home() {
  const [userCards, setUserCards] = useState<string>("10,6");
  const [dealerCard, setDealerCard] = useState<string>("5");
  const [result, setResult] = useState<string | null>(null);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🃏 Blackjack Strategy</h1>
      <div style={{ marginTop: "1rem" }}>
        <label>
          Твои карты:
          <input
            type="text"
            value={userCards}
            onChange={(e) => setUserCards(e.target.value)}
            placeholder="например: 10,6"
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <label>
          Карта дилера:
          <input
            type="text"
            value={dealerCard}
            onChange={(e) => setDealerCard(e.target.value)}
            placeholder="например: 5"
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <button
        onClick={() => {
          const user = userCards.split(",").map((c) => c.trim().toUpperCase());
          const dealer = dealerCard.trim().toUpperCase();
          setResult(getRecommendation(user, dealer));
        }}
        style={{ marginTop: "1.5rem", padding: "0.5rem 1rem", fontSize: "16px" }}
      >
        Получить рекомендацию
      </button>

      {result && (
        <div style={{ marginTop: "2rem", fontSize: "24px", fontWeight: "bold" }}>
          👉 Рекомендация: <span style={{ textDecoration: "underline" }}>{result}</span>
        </div>
      )}
    </main>
  );
}
