import React from 'react';

const TurnIndicator = ({ gameState, currentPlayer }) => {
  const current = gameState.players[gameState.currentPlayer];
  const alivePlayers = gameState.players.filter(p => p.isAlive);

  const getTurnPhase = () => {
    if (gameState.lastAction) {
      switch (gameState.lastAction.type) {
        case 'play':
          return 'Card Played';
        case 'draw':
          return gameState.lastAction.card.id === 'exploding_kitten' ? 'Exploding Kitten Drawn!' : 'Card Drawn';
        case 'defuse':
          return 'Defuse Used';
        case 'explode':
          return 'EXPLOSION!';
        default:
          return 'Playing...';
      }
    }
    return 'Waiting for Action';
  };

  const getActionIcon = () => {
    if (gameState.lastAction) {
      switch (gameState.lastAction.type) {
        case 'play':
          return '🃏';
        case 'draw':
          return gameState.lastAction.card.id === 'exploding_kitten' ? '💥' : '📥';
        case 'defuse':
          return '🛡️';
        case 'explode':
          return '☠️';
        default:
          return '🎮';
      }
    }
    return '⏳';
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Current Player */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{
          fontFamily: 'Bangers, cursive',
          fontSize: '1.8rem',
          color: '#ffd60a',
          letterSpacing: '3px',
          marginBottom: '0.5rem',
          textShadow: '0 0 15px rgba(255, 214, 10, 0.5)'
        }}>
          {current?.name || 'Player'}
        </h2>
        <div style={{ color: '#adb5bd', fontFamily: 'Fredoka, sans-serif' }}>
          Player {gameState.currentPlayer + 1} of {gameState.players.length}
        </div>
      </div>

      {/* Turn Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
        background: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '15px',
        padding: '0.75rem'
      }}>
        <span style={{ fontSize: '2rem' }}>{getActionIcon()}</span>
        <span style={{
          color: '#ffd60a',
          fontFamily: 'Bangers, cursive',
          fontSize: '1.2rem',
          letterSpacing: '2px'
        }}>
          {getTurnPhase()}
        </span>
      </div>

      {/* Game Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.5rem',
        fontSize: '0.85rem'
      }}>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '10px',
          padding: '0.75rem',
          border: '2px solid #ffd60a'
        }}>
          <div style={{ color: '#ffd60a', marginBottom: '0.25rem', fontFamily: 'Fredoka, sans-serif' }}>Turn</div>
          <div style={{ fontFamily: 'Bangers, cursive', color: '#ffd60a', fontSize: '1.3rem', letterSpacing: '1px' }}>
            #{gameState.turnCount + 1}
          </div>
        </div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '10px',
          padding: '0.75rem',
          border: '2px solid #4caf50'
        }}>
          <div style={{ color: '#4caf50', marginBottom: '0.25rem', fontFamily: 'Fredoka, sans-serif' }}>Alive</div>
          <div style={{ fontFamily: 'Bangers, cursive', color: '#81c784', fontSize: '1.3rem', letterSpacing: '1px' }}>
            {alivePlayers.length}
          </div>
        </div>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '10px',
          padding: '0.75rem',
          border: '2px solid #4285f4'
        }}>
          <div style={{ color: '#4285f4', marginBottom: '0.25rem', fontFamily: 'Fredoka, sans-serif' }}>Deck</div>
          <div style={{ fontFamily: 'Bangers, cursive', color: '#64b5f6', fontSize: '1.3rem', letterSpacing: '1px' }}>
            {gameState.deck.length}
          </div>
        </div>
      </div>

      {/* Last Action Details */}
      {gameState.lastAction && gameState.lastAction.card && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '10px',
          padding: '0.75rem',
          border: '2px solid #9c27b0'
        }}>
          <div style={{ color: '#ce93d8', marginBottom: '0.5rem', fontFamily: 'Bangers, cursive', letterSpacing: '1px' }}>
            Last Action:
          </div>
          <div style={{ fontFamily: 'Bangers, cursive', fontSize: '1.1rem', color: gameState.lastAction.card.color, letterSpacing: '1px' }}>
            {gameState.lastAction.card.name}
          </div>
          {gameState.lastAction.playerId !== undefined && (
            <div style={{ color: '#9e9e9e', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              by: {gameState.players[gameState.lastAction.playerId]?.name}
            </div>
          )}
        </div>
      )}

      {/* Attack Warning */}
      {gameState.turnCount > 0 && gameState.turnCount % 2 === 1 && (
        <div style={{
          marginTop: '0.75rem',
          background: 'linear-gradient(135deg, rgba(230, 57, 70, 0.3) 0%, rgba(139, 0, 0, 0.4) 100%)',
          border: '2px solid #e63946',
          borderRadius: '10px',
          padding: '0.75rem',
          animation: 'pulse 1.5s infinite'
        }}>
          <div style={{ color: '#ff6b6b', fontFamily: 'Bangers, cursive', letterSpacing: '1px' }}>⚠️ DOUBLE ATTACK!</div>
          <div style={{ color: '#ff8a8a', fontSize: '0.8rem' }}>Current player takes two turns</div>
        </div>
      )}

      {/* Direction Indicator */}
      <div style={{
        marginTop: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: '#9e9e9e',
        fontSize: '0.9rem'
      }}>
        <span>Direction:</span>
        <span style={{
          fontFamily: 'Bangers, cursive',
          color: gameState.direction > 0 ? '#ffd60a' : '#ff6b35',
          letterSpacing: '1px'
        }}>
          {gameState.direction > 0 ? '↔️ Normal' : '🔄 Reversed'}
        </span>
      </div>
    </div>
  );
};

export default TurnIndicator;
