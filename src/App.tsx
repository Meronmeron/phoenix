import { useState } from "react";
import "./App.css";

function App() {
  const [betAmount, setBetAmount] = useState(0.3);
  const [isHighRisk, setIsHighRisk] = useState(true);
  const [selectedCardIndex, setSelectedCardIndex] = useState(6); // Middle card initially
  const [isMoving, setIsMoving] = useState(false);
  const [selectionHistory, setSelectionHistory] = useState<{ color: string }[]>(
    []
  ); // Track final selections
  const [showResults, setShowResults] = useState(false); // Toggle for showing results

  const cards = [
    { id: 1, type: "black", color: "#1a1a2e" },
    { id: 2, type: "red", color: "#dc2626" },
    { id: 3, type: "black", color: "#1a1a2e" },
    { id: 4, type: "red", color: "#dc2626" },
    { id: 5, type: "black", color: "#1a1a2e" },
    { id: 6, type: "red", color: "#dc2626" },
    { id: 7, type: "black", color: "#1a1a2e" },
    { id: 8, type: "red", color: "#dc2626" },
    { id: 9, type: "black", color: "#1a1a2e" },
    { id: 10, type: "red", color: "#dc2626" },
    { id: 11, type: "fire", color: "#f59e0b" },
    { id: 12, type: "black", color: "#1a1a2e" },
    { id: 13, type: "red", color: "#dc2626" },
  ];

  // Function to get cards arranged with selected card in center
  const getDisplayedCards = () => {
    const totalDisplayCards = 13;
    const centerIndex = Math.floor(totalDisplayCards / 2); // Index 6 is center
    const displayedCards = [];

    for (let i = 0; i < totalDisplayCards; i++) {
      const offset = i - centerIndex; // -6 to +6
      const cardIndex =
        (selectedCardIndex + offset + cards.length) % cards.length;
      displayedCards.push({
        ...cards[cardIndex],
        isCenter: i === centerIndex,
        displayIndex: i,
      });
    }

    return displayedCards;
  };

  const moveCards = () => {
    setIsMoving(true);

    // Simulate card movement with multiple steps - faster and more moves like a train
    let moveCount = 0;
    const totalMoves = 30 + Math.floor(Math.random() * 20); // 30-50 moves (more iterations)

    const moveInterval = setInterval(() => {
      moveCount++;
      const newIndex = (selectedCardIndex + 1) % cards.length;
      setSelectedCardIndex(newIndex);

      if (moveCount >= totalMoves) {
        clearInterval(moveInterval);
        setIsMoving(false);

        // Final random selection
        const finalIndex = Math.floor(Math.random() * cards.length);
        setSelectedCardIndex(finalIndex);

        // Add ONLY the final selection to history when animation stops
        setSelectionHistory((prev) => [
          ...prev,
          { color: cards[finalIndex].color },
        ]);
      }
    }, 50); // Much faster interval - 50ms instead of 120ms (like a fast train)
  };

  const increaseBet = () => {
    setBetAmount((prev) => Math.min(prev + 0.1, 999.99));
  };

  const decreaseBet = () => {
    setBetAmount((prev) => Math.max(prev - 0.1, 0.1));
  };

  const handleBetClick = (type: string, multiplier: number) => {
    if (isMoving) return; // Prevent clicking while moving

    console.log(`Betting on ${type} with multiplier x${multiplier}`);
    moveCards();
  };

  const selectedCard = cards[selectedCardIndex];
  const displayedCards = getDisplayedCards();

  return (
    <div className="app">
      {/* Main game area */}
      <div className="game-container">
        {/* Cards row */}
        <div className="cards-container">
          {/* Top arrow */}

          {/* Selected card indicator */}
          <div className="selected-indicator">
            {showResults ? (
              <>
                <div className="results-header">
                  <span className="results-label">LAST RESULTS</span>
                </div>
                <div className="results-inline">
                  {selectionHistory.slice(-10).map((result, index) => (
                    <div
                      key={index}
                      className="result-circle-inline"
                      style={{ backgroundColor: result.color }}
                    />
                  ))}
                  {selectionHistory.length === 0 && (
                    <span className="no-results">No results yet</span>
                  )}
                </div>
              </>
            ) : (
              <div className="indicator-dots">
                {Array.from({ length: 20 }, (_, index) => (
                  <div
                    key={index}
                    className={`indicator-dot ${
                      index < selectionHistory.length ? "filled" : "empty"
                    }`}
                    style={{
                      backgroundColor:
                        index < selectionHistory.length
                          ? selectionHistory[index].color
                          : "transparent",
                    }}
                  ></div>
                ))}
              </div>
            )}
            <button
              className="results-toggle-btn"
              onClick={() => setShowResults(!showResults)}
            >
              ↻<span className="dropdown-arrow">V</span>
            </button>
          </div>
          <div className="arrow arrow-top">▼</div>

          <div className={`cards-row ${isMoving ? "moving" : ""}`}>
            {displayedCards.map((card, index) => (
              <div
                key={`${card.id}-${index}`}
                className={`card ${card.type} ${
                  card.isCenter && !isMoving ? "selected" : ""
                }`}
              >
                <div
                  className="card-inner"
                  style={{ backgroundColor: card.color }}
                >
                  {card.type === "fire" && <div className="fire-icon">🔥</div>}
                  {card.type !== "fire" && <div className="card-dot"></div>}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom arrow */}
          <div className="arrow arrow-bottom">▲</div>
        </div>

        {/* High risk mode toggle */}
        <div className="risk-toggle">
          <span className="risk-icon">🎲</span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={isHighRisk}
              onChange={(e) => setIsHighRisk(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          <span className="risk-text">High risk mode</span>
        </div>

        {/* Betting controls */}
        <div className="betting-controls">
          {/* Bet amount section */}
          <div className="bet-section">
            <div className="bet-label">Bet USD</div>
            <div className="bet-input-container">
              <div className="bet-amount">{betAmount.toFixed(2)}</div>
            </div>
            <button className="bet-control minus" onClick={decreaseBet}>
              −
            </button>
            <button className="refresh-btn">≡</button>
            <button className="bet-control plus" onClick={increaseBet}>
              +
            </button>
          </div>

          {/* Betting buttons */}
          <div className="betting-buttons">
            <button
              className="bet-btn red"
              onClick={() => handleBetClick("red", 2)}
              disabled={isMoving}
            >
              RED
              <br />
              X2
            </button>
            <button
              className="bet-btn fire"
              onClick={() => handleBetClick("fire", 32)}
              disabled={isMoving}
            >
              🔥
              <br />
              X32
            </button>
            <button
              className="bet-btn black"
              onClick={() => handleBetClick("black", 2)}
              disabled={isMoving}
            >
              BLACK
              <br />
              X2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
