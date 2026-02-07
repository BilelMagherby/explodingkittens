import React, { useState, useEffect, useCallback } from 'react';
import {
  initializeGame,
  playCard,
  drawCard,
  playCatCombo,
  getWinner,
  getPlayableCards,
  countCardsOfType,
  getGameStats
} from '../utils/gameLogic';
import GameOver from './GameOver';
import soundManager from '../utils/soundManager';
import './Game.css';

const Game = ({ playerCount, onBackToMenu, skins = { themeSkin: 'default', cardSkin: 'classic', playerSkin: 'cats' } }) => {
  const [gameState, setGameState] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedCards, setSelectedCards] = useState([]); // For cat combos
  const [showFuture, setShowFuture] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [timer, setTimer] = useState(0);
  const [embers, setEmbers] = useState([]);
  const [notification, setNotification] = useState(null);

  // Initialize music if needed
  useEffect(() => {
    const settings = soundManager.getSettings();
    if (settings.musicEnabled) {
      soundManager.startMusic();
    }
    return () => {
      // Don't stop music on unmount to keep it seamless, 
      // or stop it if you want music only in game
      // soundManager.stopMusic(); 
    };
  }, []);

  // Generate floating embers
  useEffect(() => {
    const newEmbers = [];
    for (let i = 0; i < 25; i++) {
      newEmbers.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2
      });
    }
    setEmbers(newEmbers);
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize game
  useEffect(() => {
    const initialState = initializeGame(playerCount);
    setGameState(initialState);
    soundManager.play('shuffle');
  }, [playerCount]);

  // Show notification
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Watch for game actions and play sounds
  useEffect(() => {
    if (gameState?.lastAction) {
      const action = gameState.lastAction;

      // Play appropriate sound based on action
      if (action.type === 'explode') {
        soundManager.play('explosion');
        showNotification(`💥 ${gameState.players[action.playerId]?.name} EXPLODED!`, 'danger');
      } else if (action.type === 'defuse') {
        soundManager.play('defuse');
        showNotification(`🛡️ ${gameState.players[action.playerId]?.name} defused the bomb!`, 'success');
      } else if (action.type === 'play') {
        // Special sounds for specific cards
        if (action.card.id === 'attack') soundManager.play('attack');
        else if (action.card.id === 'skip') soundManager.play('skip');
        else if (action.card.id === 'shuffle') soundManager.play('shuffle');
        else if (action.card.id === 'nope') soundManager.play('nope');
        else soundManager.play('cardPlay');

        if (action.message) showNotification(action.message, 'info');
      } else if (action.type === 'draw') {
        soundManager.play('cardDraw');
      } else if (action.message) {
        showNotification(action.message, 'info');
      }

      // Show future cards
      if (action.card?.id === 'see_future' && gameState.futureCards.length > 0) {
        setShowFuture(true);
        setTimeout(() => setShowFuture(false), 4000);
      }
    }
  }, [gameState?.lastAction, showNotification]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} `;
  };

  const getCardType = (card) => {
    const typeMap = {
      'attack': 'attack',
      'skip': 'skip',
      'nope': 'nope',
      'favor': 'favor',
      'shuffle': 'shuffle',
      'see_future': 'see-future',
      'exploding_kitten': 'exploding',
      'defuse': 'defuse'
    };
    return typeMap[card.id] || 'cat';
  };

  const getCardIcon = (cardId) => {
    const icons = {
      attack: '⚔️',
      skip: '⏭️',
      favor: '🤝',
      shuffle: '🔀',
      see_future: '👁️',
      nope: '🚫',
      exploding_kitten: '💣',
      defuse: '🛡️',
      bearded_cat: '🧔',
      watermelon_cat: '🍉',
      potato_cat: '🥔',
      rainbow_cat: '🌈',
      taco_cat: '🌮'
    };
    return icons[cardId] || '🐱';
  };

  // Handle card selection
  const handleCardSelect = (card) => {
    if (!gameState || gameState.currentPlayer !== gameState.players.findIndex(p => p.id === gameState.currentPlayer)) {
      return;
    }

    soundManager.play('cardSelect');

    // For cat cards, handle combo selection
    if (card.type === 'CAT') {
      const currentPlayer = gameState.players[gameState.currentPlayer];
      const matchCount = countCardsOfType(currentPlayer.hand, card.id);

      if (matchCount >= 2) {
        if (selectedCard?.id === card.id) {
          setSelectedCard(null);
        } else {
          setSelectedCard(card);
        }
      } else {
        showNotification('Need 2 of the same cat cards to play combo!', 'warning');
      }
    } else {
      if (selectedCard?.uniqueId === card.uniqueId) {
        setSelectedCard(null);
      } else {
        setSelectedCard(card);
      }
    }
  };

  // Handle playing a card
  const handlePlayCard = () => {
    if (!gameState || !selectedCard) return;

    soundManager.play('buttonClick');
    const currentPlayer = gameState.players[gameState.currentPlayer];

    // Cards that need a target
    if (selectedCard.id === 'favor' || selectedCard.type === 'CAT') {
      setPendingAction({ type: 'target', card: selectedCard });
      setShowTargetModal(true);
      return;
    }

    // Play the card
    const cardToPlay = selectedCard.uniqueId || selectedCard.id;
    const newState = playCard(gameState, gameState.currentPlayer, cardToPlay);
    setGameState(newState);
    setSelectedCard(null);

    // Show notification
    showNotification(`Played ${selectedCard.name} !`, 'info');
  };

  // Handle drawing a card
  const handleDrawCard = () => {
    if (!gameState) return;

    soundManager.play('buttonClick');

    // Animate draw
    const deck = document.querySelector('.main-deck');
    if (deck) {
      deck.style.transform = 'scale(0.95)';
      setTimeout(() => deck.style.transform = '', 100);
    }

    const newState = drawCard(gameState, gameState.currentPlayer);
    setGameState(newState);
    setSelectedCard(null);
  };

  // Handle target player selection
  const handleTargetSelect = (targetPlayerId) => {
    soundManager.play('buttonClick');
    if (!pendingAction || !selectedCard) {
      setShowTargetModal(false);
      return;
    }

    let newState;

    if (selectedCard.type === 'CAT') {
      // Cat combo - steal card
      newState = playCatCombo(gameState, gameState.currentPlayer, selectedCard.id, targetPlayerId);
    } else {
      // Regular targeted card
      const cardToPlay = selectedCard.uniqueId || selectedCard.id;
      newState = playCard(gameState, gameState.currentPlayer, cardToPlay, targetPlayerId);
    }

    setGameState(newState);
    setSelectedCard(null);
    setPendingAction(null);
    setShowTargetModal(false);
  };

  // Handle restart
  const handleRestart = () => {
    const initialState = initializeGame(playerCount);
    setGameState(initialState);
    setSelectedCard(null);
    setSelectedCards([]);
    setShowFuture(false);
    setShowTargetModal(false);
    setPendingAction(null);
    setTimer(0);
  };

  if (!gameState) {
    return (
      <div className="loading-container">
        <div className="loading-text">🐱 Loading Game...</div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayer];
  const otherPlayers = gameState.players.filter((_, index) => index !== gameState.currentPlayer);
  const isGameOverNow = gameState.gameStatus === 'ended' || gameState.players.filter(p => p.isAlive).length <= 1;
  const winner = isGameOverNow ? getWinner(gameState) : null;
  const stats = getGameStats(gameState);

  return (
    <div className={`game-container theme-${skins.themeSkin}`}>
      {/* Background */}
      <div className="game-bg">
        <img src="/explosion_bg.png" alt="" className="game-bg-image" />
        <div className="game-bg-gradient" />
        <div className="game-ground" />
      </div>

      {/* Floating Embers */}
      <div className="game-particles">
        {embers.map(ember => (
          <div
            key={ember.id}
            className="ember"
            style={{
              left: `${ember.x}% `,
              top: `${ember.y}% `,
              width: `${ember.size} px`,
              height: `${ember.size} px`,
              animationDelay: `${ember.delay} s`,
              animationDuration: `${ember.duration} s`
            }}
          />
        ))}
      </div>

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: notification.type === 'danger' ? 'linear-gradient(180deg, #e63946 0%, #c62828 100%)' :
            notification.type === 'success' ? 'linear-gradient(180deg, #4caf50 0%, #2e7d32 100%)' :
              'linear-gradient(180deg, #8b4513 0%, #5d3a1a 100%)',
          border: '3px solid #ffd60a',
          borderRadius: '15px',
          padding: '1rem 2rem',
          color: 'white',
          fontFamily: 'Bangers, cursive',
          fontSize: '1.3rem',
          letterSpacing: '2px',
          zIndex: 1000,
          boxShadow: '0 5px 30px rgba(0, 0, 0, 0.5)',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <div className="game-content">
        {/* Top Bar */}
        <div className="game-top-bar">
          <button onClick={onBackToMenu} className="back-btn">
            🏠 MENU
          </button>
          <div style={{
            background: 'linear-gradient(180deg, #8b4513 0%, #5d3a1a 100%)',
            border: '3px solid #cd853f',
            borderRadius: '10px',
            padding: '0.5rem 1rem',
            display: 'flex',
            gap: '1.5rem',
            color: 'white',
            fontFamily: 'Bangers, cursive',
            letterSpacing: '1px'
          }}>
            <span>💣 Bombs: {stats.explodingKittensRemaining}</span>
            <span>🎴 Deck: {stats.cardsInDeck}</span>
            <span>👥 Alive: {stats.alivePlayers}/{stats.totalPlayers}</span>
          </div>
        </div>

        {/* Players Row - Top */}
        <div className="players-row">
          {otherPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`player - info - card ${!player.isAlive ? 'eliminated' : ''} `}
            >
              {gameState.currentPlayer === player.id && <div className="current-player-glow" />}

              <div className="player-avatar">
                <img
                  src={index % 2 === 0 ? "/cat_cool.png" : "/cat_bomb.png"}
                  alt={player.name}
                />
              </div>

              <div className="player-name-plate">
                <div className="player-name">
                  {!player.isAlive && <span>💀</span>}
                  {player.name}
                  {player.hasDefuse && <span>🛡️</span>}
                </div>
                <div className="player-stats">
                  <div className="stat-hearts">
                    <span className={`heart ${!player.isAlive ? 'empty' : ''} `}>❤️</span>
                  </div>
                  <div className="stat-cards">
                    🃏 <span className="player-card-count">{player.hand.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Area */}
        <div className="game-center">
          {/* Main Deck */}
          <div className="deck-container">
            <div className="main-deck" onClick={handleDrawCard} style={{ cursor: 'pointer' }}>
              <div className="deck-glow" />
              <div className="deck-count-badge">{gameState.deck.length}</div>
              <div className="deck-stack">
                <div className="deck-card-back">
                  <span className="deck-icon">🎴</span>
                  <span className="deck-label">BOOM CATS</span>
                </div>
                <div className="deck-card-back">
                  <span className="deck-icon">🎴</span>
                  <span className="deck-label">BOOM CATS</span>
                </div>
                <div className="deck-card-back">
                  <span className="deck-icon">🎴</span>
                  <span className="deck-label">BOOM CATS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Turn Indicator */}
          <div className="turn-indicator">
            <div className="turn-text">
              {currentPlayer?.name?.toUpperCase() || 'PLAYER'}'S TURN
            </div>
            {gameState.turnsRemaining > 1 && (
              <div style={{
                fontFamily: 'Bangers, cursive',
                fontSize: '1.2rem',
                color: '#ff6b6b',
                letterSpacing: '2px',
                marginTop: '0.5rem'
              }}>
                ⚠️ {gameState.turnsRemaining} TURNS REMAINING!
              </div>
            )}
          </div>

          {/* See Future Preview */}
          {showFuture && gameState.futureCards && gameState.futureCards.length > 0 && (
            <div style={{
              background: 'linear-gradient(180deg, rgba(156, 39, 176, 0.95) 0%, rgba(106, 27, 154, 0.98) 100%)',
              border: '4px solid #ce93d8',
              borderRadius: '20px',
              padding: '1.5rem',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(156, 39, 176, 0.5)',
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{
                fontFamily: 'Bangers',
                color: '#f3e5f5',
                marginBottom: '1rem',
                letterSpacing: '3px',
                fontSize: '1.5rem'
              }}>
                👁️ NEXT {gameState.futureCards.length} CARDS
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                {gameState.futureCards.map((card, i) => (
                  <div key={i} style={{
                    background: 'white',
                    border: `4px solid ${card.color} `,
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'center',
                    minWidth: '80px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{getCardIcon(card.id)}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: card.color }}>{card.name}</div>
                    <div style={{
                      fontSize: '0.65rem',
                      color: '#666',
                      marginTop: '0.25rem'
                    }}>
                      #{i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Area - Player Hand */}
        <div className="game-bottom">
          {/* Side Decorations */}
          <img src="/cat_cool.png" alt="" className="corner-cat-left" />
          <img src="/cat_bomb.png" alt="" className="corner-cat-right" />

          {/* Draw Pile Info */}
          <div className="side-piles">
            <div className="draw-pile">
              <div className="pile-label">DRAW</div>
              <div className="draw-pile-stack" onClick={handleDrawCard}>
                <div className="draw-pile-card">
                  <span className="question-mark">❓</span>
                </div>
                <div className="draw-pile-card">
                  <span className="question-mark">❓</span>
                </div>
              </div>
              <div className="pile-count">{gameState.deck.length}</div>
            </div>

            {/* Discard Pile */}
            <div className="discard-pile-area">
              <div className="pile-label">DISCARD</div>
              <div className="discard-stack">
                {gameState.discardPile.length > 0 ? (
                  <>
                    <div className="discard-card" />
                    <div className="discard-card" />
                    <div className="discard-card" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      fontSize: '1.5rem'
                    }}>
                      {gameState.discardPile.length > 0 && getCardIcon(gameState.discardPile[gameState.discardPile.length - 1]?.id)}
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#666', fontSize: '0.8rem' }}>Empty</div>
                )}
              </div>
              <div className="pile-count">{gameState.discardPile.length}</div>
            </div>
          </div>

          {/* Timer */}
          <div className="game-timer">{formatTime(timer)}</div>

          {/* Current Player Info */}
          <div style={{
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              background: 'rgba(0, 0, 0, 0.6)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              color: '#ffd60a',
              fontFamily: 'Bangers, cursive',
              letterSpacing: '2px'
            }}>
              {currentPlayer?.hasDefuse && '🛡️ '}{currentPlayer?.name} - {currentPlayer?.hand.length} cards
            </span>
          </div>

          {/* Current Player's Hand */}
          <div className="player-hand-container">
            {/* Left Paw holding the cards */}
            <div className={`player-paw left-paw skin-${skins?.playerSkin || 'cats'}`}>
              <div className="paw-finger"></div>
              <div className="paw-finger"></div>
              <div className="paw-finger"></div>
              <div className="paw-pad"></div>
            </div>

            <div className="hand-cards">
              {currentPlayer?.hand.map((card, index) => {
                const isSelected = selectedCard?.uniqueId === card.uniqueId;
                const cardType = getCardType(card);
                const matchCount = card.type === 'CAT' ? countCardsOfType(currentPlayer.hand, card.id) : 0;

                // Get cat subtype class
                const getCatSubtype = (cardId) => {
                  if (cardId === 'bearded_cat') return 'bearded';
                  if (cardId === 'watermelon_cat') return 'watermelon';
                  if (cardId === 'potato_cat') return 'potato';
                  if (cardId === 'rainbow_cat') return 'rainbow';
                  if (cardId === 'taco_cat') return 'taco';
                  return '';
                };

                const catSubtype = card.type === 'CAT' ? getCatSubtype(card.id) : '';

                return (
                  <div
                    key={card.uniqueId}
                    className={`hand-card-wrapper ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCardSelect(card)}
                    style={{
                      transform: `rotate(${(index - (currentPlayer.hand.length - 1) / 2) * 5}deg)`,
                      zIndex: isSelected ? 100 : index
                    }}
                  >
                    <div className={`hand-card ${cardType} ${catSubtype} skin-${skins?.cardSkin || 'classic'}`}>
                      <div className="card-header">
                        {card.type}
                        {matchCount >= 2 && ` ×${matchCount}`}
                      </div>
                      <div className="card-icon-large">{getCardIcon(card.id)}</div>
                      <div className="card-name">{card.name}</div>
                      <div className="card-description">{card.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Paw holding the cards */}
            <div className={`player-paw right-paw skin-${skins?.playerSkin || 'cats'}`}>
              <div className="paw-finger"></div>
              <div className="paw-finger"></div>
              <div className="paw-finger"></div>
              <div className="paw-pad"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hand-actions">
            <button
              className="action-btn play"
              onClick={handlePlayCard}
              disabled={!selectedCard}
            >
              ⚔️ PLAY CARD
            </button>
            <button
              className="action-btn draw"
              onClick={handleDrawCard}
            >
              🎴 END TURN (DRAW)
            </button>
            <button
              className="action-btn cancel"
              onClick={() => setSelectedCard(null)}
              disabled={!selectedCard}
            >
              ❌ CANCEL
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="game-footer">
        <button className="footer-link">Turn #{gameState.turnCount + 1}</button>
        <span className="footer-divider">|</span>
        <button className="footer-link">Credits</button>
      </div>

      {/* Target Selection Modal */}
      {showTargetModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200
        }}>
          <div style={{
            background: 'linear-gradient(180deg, #5d3a1a 0%, #3d2415 100%)',
            border: '4px solid #cd853f',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)'
          }}>
            <h3 style={{
              fontFamily: 'Bangers',
              fontSize: '2rem',
              color: '#ffd60a',
              textAlign: 'center',
              letterSpacing: '3px',
              marginBottom: '0.5rem'
            }}>
              🎯 SELECT TARGET
            </h3>
            <p style={{ color: '#ddd', textAlign: 'center', marginBottom: '1.5rem' }}>
              {selectedCard?.type === 'CAT'
                ? `Play 2 ${selectedCard?.name}s to steal a card!`
                : `Choose who to use ${selectedCard?.name} on`}
            </p>
            {gameState.players
              .filter(p => p.id !== gameState.currentPlayer && p.isAlive && p.hand.length > 0)
              .map(player => (
                <button
                  key={player.id}
                  onClick={() => handleTargetSelect(player.id)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(180deg, #8b4513 0%, #5d3a1a 100%)',
                    border: '3px solid #cd853f',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '0.5rem',
                    color: 'white',
                    fontFamily: 'Bangers',
                    fontSize: '1.2rem',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  🎯 {player.name} ({player.hand.length} cards)
                </button>
              ))}
            <button
              onClick={() => {
                setShowTargetModal(false);
                setPendingAction(null);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(180deg, #757575 0%, #424242 100%)',
                border: '3px solid #9e9e9e',
                borderRadius: '10px',
                padding: '1rem',
                marginTop: '0.5rem',
                color: 'white',
                fontFamily: 'Bangers',
                fontSize: '1.2rem',
                letterSpacing: '2px',
                cursor: 'pointer'
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Game Over */}
      {isGameOverNow && winner && (
        <GameOver
          gameState={{ ...gameState, winner: winner.id }}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default Game;
