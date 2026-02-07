import React from 'react';

const GameOver = ({ gameState, onRestart }) => {
  const winner = gameState.players.find(p => p.id === gameState.winner);
  const alivePlayers = gameState.players.filter(p => p.isAlive);
  const eliminatedPlayers = gameState.players.filter(p => !p.isAlive);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.92)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 300
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #5d3a1a 0%, #3d2415 100%)',
        borderRadius: '30px',
        boxShadow: '0 0 80px rgba(255, 214, 10, 0.4)',
        padding: '2.5rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '5px solid #ffd60a'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 1s infinite' }}>
            🏆
          </div>
          <h1 style={{
            fontFamily: 'Bangers, cursive',
            fontSize: '3.5rem',
            color: '#ffd60a',
            letterSpacing: '6px',
            marginBottom: '0.5rem',
            textShadow: '0 4px 0 #8b4513, 0 8px 20px rgba(0, 0, 0, 0.5)'
          }}>
            GAME OVER!
          </h1>
        </div>

        {/* Winner Section */}
        {winner && (
          <div style={{
            background: 'linear-gradient(180deg, rgba(76, 175, 80, 0.3) 0%, rgba(46, 125, 50, 0.4) 100%)',
            border: '4px solid #4caf50',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '1.5rem',
            boxShadow: '0 0 30px rgba(76, 175, 80, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐱👑</div>
            <h2 style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '2.5rem',
              color: '#81c784',
              letterSpacing: '4px',
              marginBottom: '0.5rem'
            }}>
              {winner.name} WINS!
            </h2>
            <p style={{ color: '#a5d6a7', fontSize: '1.1rem' }}>
              The last cat standing! 🎉
            </p>
            <div style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                color: '#c8e6c9'
              }}>
                🃏 Cards: {winner.hand?.length || 0}
              </div>
              {winner.hasDefuse && (
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '0.5rem 1rem',
                  borderRadius: '10px',
                  color: '#c8e6c9'
                }}>
                  🛡️ Has Defuse
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          {/* Eliminated Players */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(230, 57, 70, 0.3) 0%, rgba(139, 0, 0, 0.4) 100%)',
            border: '3px solid #e63946',
            borderRadius: '15px',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '1.3rem',
              color: '#ff6b6b',
              letterSpacing: '2px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              💀 EXPLODED
            </h3>
            {eliminatedPlayers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {eliminatedPlayers.map(player => (
                  <div key={player.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '8px',
                    padding: '0.5rem 0.75rem',
                    color: '#ffcdd2'
                  }}>
                    <span>💥</span>
                    <span style={{ fontFamily: 'Bangers', letterSpacing: '1px' }}>{player.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9e9e9e', textAlign: 'center' }}>No one exploded!</p>
            )}
          </div>

          {/* Game Stats */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(66, 133, 244, 0.3) 0%, rgba(33, 150, 243, 0.4) 100%)',
            border: '3px solid #4285f4',
            borderRadius: '15px',
            padding: '1.5rem'
          }}>
            <h3 style={{
              fontFamily: 'Bangers, cursive',
              fontSize: '1.3rem',
              color: '#64b5f6',
              letterSpacing: '2px',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              📊 STATS
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#bbdefb'
              }}>
                <span>Total Turns</span>
                <span style={{ fontFamily: 'Bangers', color: '#64b5f6' }}>{gameState.turnCount}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#bbdefb'
              }}>
                <span>Players</span>
                <span style={{ fontFamily: 'Bangers', color: '#64b5f6' }}>{gameState.players.length}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#bbdefb'
              }}>
                <span>Cards Left</span>
                <span style={{ fontFamily: 'Bangers', color: '#64b5f6' }}>{gameState.deck.length}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#bbdefb'
              }}>
                <span>Discarded</span>
                <span style={{ fontFamily: 'Bangers', color: '#64b5f6' }}>{gameState.discardPile.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onRestart}
            style={{
              background: 'linear-gradient(180deg, #4caf50 0%, #2e7d32 100%)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '15px',
              fontFamily: 'Bangers, cursive',
              fontSize: '1.3rem',
              letterSpacing: '3px',
              border: '4px solid #81c784',
              cursor: 'pointer',
              boxShadow: '0 5px 0 #1b5e20, 0 8px 25px rgba(76, 175, 80, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 0 #1b5e20, 0 12px 30px rgba(76, 175, 80, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 5px 0 #1b5e20, 0 8px 25px rgba(76, 175, 80, 0.4)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🔄</span>
            PLAY AGAIN
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(180deg, #8b4513 0%, #5d3a1a 100%)',
              color: 'white',
              padding: '1rem 2.5rem',
              borderRadius: '15px',
              fontFamily: 'Bangers, cursive',
              fontSize: '1.3rem',
              letterSpacing: '3px',
              border: '4px solid #cd853f',
              cursor: 'pointer',
              boxShadow: '0 5px 0 #3d2415, 0 8px 25px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>🏠</span>
            MAIN MENU
          </button>
        </div>

        {/* Thank You Message */}
        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          paddingTop: '1.5rem',
          borderTop: '2px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{
            color: '#ffd60a',
            fontFamily: 'Bangers, cursive',
            fontSize: '1.5rem',
            letterSpacing: '3px',
            marginBottom: '0.5rem'
          }}>
            🐱💣 THANKS FOR PLAYING!
          </p>
          <p style={{ color: '#9e9e9e', fontSize: '0.9rem' }}>
            BOOM CATS - The Explosive Card Game
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
