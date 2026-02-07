import React from 'react';
import Card from './Card';

const Deck = ({
  deck,
  onDrawCard,
  isCurrentPlayer,
  gameState,
  futureCards = [],
  showFuture = false
}) => {
  const handleDrawCard = () => {
    if (isCurrentPlayer && deck.length > 0) {
      onDrawCard();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Main Deck */}
      <div style={{ position: 'relative' }}>
        <div
          onClick={handleDrawCard}
          style={{
            position: 'relative',
            cursor: isCurrentPlayer && deck.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s ease',
            transform: isCurrentPlayer && deck.length > 0 ? 'scale(1)' : 'scale(0.95)',
            opacity: isCurrentPlayer && deck.length > 0 ? 1 : 0.7
          }}
          onMouseEnter={(e) => {
            if (isCurrentPlayer && deck.length > 0) {
              e.currentTarget.style.transform = 'scale(1.08) rotate(2deg)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = isCurrentPlayer && deck.length > 0 ? 'scale(1)' : 'scale(0.95)';
          }}
        >
          {/* Stack effect with multiple cards */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #2d1810 0%, #0d0505 100%)',
            borderRadius: '15px',
            transform: 'translateY(8px) translateX(8px)',
            opacity: 0.4,
            border: '2px solid #6b4423'
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #3d2415 0%, #1a0a0a 100%)',
            borderRadius: '15px',
            transform: 'translateY(4px) translateX(4px)',
            opacity: 0.6,
            border: '2px solid #8b5a2b'
          }} />

          {/* Top card */}
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #2d1810 0%, #1a0a0a 100%)',
            borderRadius: '15px',
            boxShadow: '0 0 40px rgba(255, 214, 10, 0.3), 0 10px 30px rgba(0, 0, 0, 0.5)',
            border: '4px solid #ffd60a',
            padding: '1.5rem 1.25rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎴</div>
            <div style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '1.1rem',
              color: '#ffd60a',
              letterSpacing: '2px',
              lineHeight: '1.3'
            }}>
              BOOM<br />CATS
            </div>

            {/* Card count badge */}
            <div style={{
              position: 'absolute',
              top: '-12px',
              right: '-12px',
              background: 'linear-gradient(135deg, #e63946 0%, #c62828 100%)',
              color: 'white',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Bangers, cursive',
              fontSize: '1.1rem',
              border: '3px solid #ffd60a',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.4)'
            }}>
              {deck.length}
            </div>
          </div>
        </div>

        {/* Draw button overlay */}
        {isCurrentPlayer && deck.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10
          }}>
            <button
              onClick={handleDrawCard}
              style={{
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                color: 'white',
                padding: '0.6rem 1.5rem',
                borderRadius: '25px',
                fontFamily: 'Bangers, cursive',
                fontSize: '1rem',
                letterSpacing: '2px',
                border: '3px solid #81c784',
                cursor: 'pointer',
                boxShadow: '0 4px 0 rgba(0, 0, 0, 0.3), 0 8px 20px rgba(76, 175, 80, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 0 rgba(0, 0, 0, 0.3), 0 12px 25px rgba(76, 175, 80, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 0 rgba(0, 0, 0, 0.3), 0 8px 20px rgba(76, 175, 80, 0.4)';
              }}
            >
              🎯 DRAW CARD
            </button>
          </div>
        )}

        {/* Glow effect for current player */}
        {isCurrentPlayer && deck.length > 0 && (
          <div style={{
            position: 'absolute',
            inset: '-5px',
            borderRadius: '20px',
            background: 'rgba(255, 214, 10, 0.15)',
            animation: 'pulse 2s infinite',
            pointerEvents: 'none'
          }} />
        )}
      </div>

      {/* Future cards preview */}
      {showFuture && futureCards.length > 0 && (
        <div style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.85) 0%, rgba(106, 27, 154, 0.9) 100%)',
          border: '4px solid #ce93d8',
          borderRadius: '20px',
          padding: '1.25rem',
          maxWidth: '300px',
          boxShadow: '0 0 30px rgba(156, 39, 176, 0.4)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <h4 style={{
            fontFamily: 'Bangers, cursive',
            color: '#f3e5f5',
            marginBottom: '1rem',
            letterSpacing: '2px',
            fontSize: '1.3rem'
          }}>
            👁️ SEE THE FUTURE
          </h4>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.75rem' }}>
            {futureCards.map((card, index) => (
              <div key={index} style={{ position: 'relative', transition: 'transform 0.2s' }}>
                <Card
                  card={card}
                  isSmall={true}
                />
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'Bangers, cursive',
                  fontSize: '0.9rem',
                  border: '2px solid #ce93d8'
                }}>
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: '#e1bee7', fontSize: '0.85rem', textAlign: 'center' }}>
            Next cards in the deck
          </p>
        </div>
      )}

      {/* Empty deck warning */}
      {deck.length === 0 && (
        <div style={{
          marginTop: '1.5rem',
          background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.85) 0%, rgba(139, 0, 0, 0.9) 100%)',
          border: '3px solid #e63946',
          borderRadius: '15px',
          padding: '1rem',
          maxWidth: '250px',
          textAlign: 'center',
          boxShadow: '0 0 25px rgba(230, 57, 70, 0.4)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
          <p style={{ color: '#ffcdd2', fontFamily: 'Bangers, cursive', letterSpacing: '1px', marginBottom: '0.25rem' }}>
            DECK EMPTY!
          </p>
          <p style={{ color: '#ef9a9a', fontSize: '0.8rem' }}>
            Reshuffling discard pile...
          </p>
        </div>
      )}

      {/* Instructions */}
      {isCurrentPlayer && deck.length > 0 && (
        <div style={{
          marginTop: '2rem',
          background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.2) 0%, rgba(33, 150, 243, 0.3) 100%)',
          border: '2px solid #4285f4',
          borderRadius: '15px',
          padding: '0.75rem 1rem',
          maxWidth: '250px'
        }}>
          <p style={{ color: '#90caf9', fontSize: '0.85rem', textAlign: 'center' }}>
            💡 Click the deck to draw a card
          </p>
        </div>
      )}

      {/* Deck statistics */}
      <div style={{
        marginTop: '1rem',
        background: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '10px',
        padding: '0.5rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#ffd60a', fontFamily: 'Bangers, cursive', letterSpacing: '1px' }}>
          📊 {deck.length} cards remaining
        </div>
      </div>
    </div>
  );
};

export default Deck;
