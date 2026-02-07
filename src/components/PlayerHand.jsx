import React from 'react';
import Card from './Card';

const PlayerHand = ({
  player,
  isCurrentPlayer,
  onPlayCard,
  onCardSelect,
  selectedCard,
  gameState,
  showAllCards = false
}) => {
  const canPlayCard = (card) => {
    if (!isCurrentPlayer || !player.isAlive) return false;

    // Check if the card can be played according to the rules
    if (card.id === 'nope') {
      return true; // "Nope" cards can always be played
    }

    return true; // For simplicity, all other cards can be played during the player's turn
  };

  const handleCardClick = (card) => {
    if (canPlayCard(card)) {
      if (selectedCard?.id === card.id) {
        onCardSelect(null); // Deselect
      } else {
        onCardSelect(card); // Select
      }
    }
  };

  const handlePlayCard = () => {
    if (selectedCard && canPlayCard(selectedCard)) {
      onPlayCard(selectedCard);
      onCardSelect(null);
    }
  };

  if (!player.isAlive) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.3) 0%, rgba(139, 0, 0, 0.4) 100%)',
          border: '3px solid #e63946',
          borderRadius: '15px',
          padding: '1rem',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h3 style={{ fontFamily: 'Bangers, cursive', color: '#ff6b6b', letterSpacing: '2px' }}>{player.name}</h3>
          <div style={{ fontSize: '1.5rem' }}>💀</div>
        </div>
        <p style={{ color: '#ff8a8a', fontFamily: 'Bangers, cursive', letterSpacing: '1px' }}>EXPLODED!</p>
        <div style={{ marginTop: '0.5rem', color: '#ff6b6b', fontSize: '0.8rem' }}>Out of the game</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: isCurrentPlayer
          ? 'linear-gradient(135deg, rgba(40, 40, 60, 0.9) 0%, rgba(20, 20, 35, 0.95) 100%)'
          : 'linear-gradient(135deg, rgba(30, 30, 45, 0.8) 0%, rgba(15, 15, 25, 0.85) 100%)',
        border: isCurrentPlayer ? '3px solid #ffd60a' : '3px solid #4285f4',
        borderRadius: '15px',
        padding: '1rem',
        boxShadow: isCurrentPlayer
          ? '0 0 25px rgba(255, 214, 10, 0.3)'
          : '0 0 15px rgba(66, 133, 244, 0.2)',
        transition: 'all 0.3s ease',
        transform: isCurrentPlayer ? 'scale(1)' : 'scale(0.95)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <h3 style={{
          fontFamily: 'Bangers, cursive',
          color: isCurrentPlayer ? '#ffd60a' : '#4285f4',
          letterSpacing: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {player.name}
          {isCurrentPlayer && <span style={{ animation: 'pulse 1.5s infinite' }}>🎯</span>}
        </h3>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          color: 'white',
          fontFamily: 'Bangers, cursive',
          letterSpacing: '1px'
        }}>
          {player.hand.length} 🃏
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        minHeight: '100px',
        justifyContent: 'center'
      }}>
        {player.hand.map((card) => {
          const isSelected = selectedCard?.id === card.id;
          const isPlayable = canPlayCard(card);
          const showCard = showAllCards || isCurrentPlayer;

          return (
            <div
              key={card.id}
              style={{
                animation: isSelected ? 'bounce 0.5s ease infinite' : 'none',
                transform: isSelected ? 'translateY(-5px)' : 'none'
              }}
            >
              <Card
                card={card}
                onClick={() => handleCardClick(card)}
                isPlayable={isPlayable}
                isSelected={isSelected}
                isSmall={true}
                showBack={!showCard}
              />
            </div>
          );
        })}
      </div>

      {/* Action buttons for current player */}
      {isCurrentPlayer && (
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={handlePlayCard}
            disabled={!selectedCard}
            style={{
              background: selectedCard
                ? 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
                : 'linear-gradient(135deg, #555 0%, #333 100%)',
              border: selectedCard ? '3px solid #81c784' : '3px solid #666',
              color: selectedCard ? 'white' : '#888',
              fontFamily: 'Bangers, cursive',
              fontSize: '1.1rem',
              letterSpacing: '2px',
              padding: '0.6rem 1.5rem',
              borderRadius: '15px',
              cursor: selectedCard ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: selectedCard ? '0 4px 0 rgba(0, 0, 0, 0.3)' : 'none',
              opacity: selectedCard ? 1 : 0.6
            }}
          >
            ⚔️ PLAY CARD
          </button>

          <button
            onClick={() => onCardSelect(null)}
            disabled={!selectedCard}
            style={{
              background: selectedCard
                ? 'linear-gradient(135deg, #757575 0%, #424242 100%)'
                : 'linear-gradient(135deg, #444 0%, #222 100%)',
              border: selectedCard ? '3px solid #9e9e9e' : '3px solid #555',
              color: selectedCard ? 'white' : '#666',
              fontFamily: 'Bangers, cursive',
              fontSize: '1.1rem',
              letterSpacing: '2px',
              padding: '0.6rem 1.5rem',
              borderRadius: '15px',
              cursor: selectedCard ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity: selectedCard ? 1 : 0.6
            }}
          >
            ❌ CANCEL
          </button>
        </div>
      )}

      {/* Special status */}
      {player.hasDefuse && (
        <div style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.2) 0%, rgba(33, 150, 243, 0.3) 100%)',
          border: '2px solid #4285f4',
          borderRadius: '10px',
          padding: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ color: '#64b5f6', fontFamily: 'Bangers, cursive', letterSpacing: '1px', fontSize: '0.9rem' }}>
            🛡️ HAS DEFUSE
          </div>
        </div>
      )}

      {/* Player status indicator */}
      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: isCurrentPlayer ? '#ffd60a' : '#666',
          boxShadow: isCurrentPlayer ? '0 0 10px #ffd60a' : 'none',
          animation: isCurrentPlayer ? 'pulse 1.5s infinite' : 'none'
        }} />
      </div>
    </div>
  );
};

export default PlayerHand;
