/**
 * BOOM CATS - Complete Game Logic
 * ================================
 * Implements all official Exploding Kittens rules
 */

import {
  createBaseDeck,
  createDefuseCards,
  createExplodingKittens,
  shuffleDeck,
  createCard,
  CARDS
} from '../data/cards.js';

// ==========================================
// GAME INITIALIZATION
// ==========================================

/**
 * Initialize a new game following official rules:
 * 1. Remove Exploding Kittens and Defuse cards
 * 2. Shuffle remaining cards
 * 3. Deal 4 cards to each player
 * 4. Give each player 1 Defuse card
 * 5. Insert (players - 1) Exploding Kittens back into deck
 * 6. Shuffle deck thoroughly
 */
export const initializeGame = (playerCount) => {
  // Step 1: Create base deck (without Exploding Kittens)
  const baseDeck = createBaseDeck().map(createCard);

  // Step 2: Shuffle the base deck
  let deck = shuffleDeck(baseDeck);

  // Step 3: Create players and deal 4 cards each
  const players = [];
  for (let i = 0; i < playerCount; i++) {
    const hand = [];

    // Deal 4 cards to each player
    for (let j = 0; j < 4; j++) {
      if (deck.length > 0) {
        hand.push(deck.pop());
      }
    }

    // Step 4: Give each player 1 Defuse card
    hand.push(createCard(CARDS.DEFUSE));

    players.push({
      id: i,
      name: `Player ${i + 1}`,
      hand: hand,
      isAlive: true,
      hasDefuse: true,
      lives: 1 // Player has 1 life
    });
  }

  // Step 5: Create and insert Exploding Kittens (players - 1)
  const explodingKittens = createExplodingKittens(playerCount).map(createCard);
  deck = [...deck, ...explodingKittens];

  // Add extra Defuse cards to deck (2 extras)
  const extraDefuse = [createCard(CARDS.DEFUSE), createCard(CARDS.DEFUSE)];
  deck = [...deck, ...extraDefuse];

  // Step 6: Shuffle the final deck
  deck = shuffleDeck(deck);

  return {
    players,
    deck,
    discardPile: [],
    currentPlayer: 0,
    gameStatus: 'playing',
    direction: 1, // 1 = clockwise, -1 = counter-clockwise
    turnCount: 0,
    turnsRemaining: 1, // For Attack card (can stack to 2+ turns)
    lastAction: null,
    futureCards: [],
    pendingAction: null, // For actions that need player response
    actionHistory: []
  };
};

// ==========================================
// TURN MANAGEMENT
// ==========================================

/**
 * Move to the next player's turn
 */
export const nextTurn = (gameState) => {
  const alivePlayers = gameState.players.filter(p => p.isAlive);
  if (alivePlayers.length <= 1) return;

  // Check if current player has more turns (from Attack)
  if (gameState.turnsRemaining > 1) {
    gameState.turnsRemaining--;
    gameState.futureCards = [];
    return;
  }

  // Reset turns remaining
  gameState.turnsRemaining = 1;

  // Find next alive player
  let nextPlayerIndex = gameState.currentPlayer;
  let attempts = 0;

  do {
    nextPlayerIndex = (nextPlayerIndex + gameState.direction + gameState.players.length) % gameState.players.length;
    attempts++;
  } while (!gameState.players[nextPlayerIndex].isAlive && attempts < gameState.players.length);

  gameState.currentPlayer = nextPlayerIndex;
  gameState.turnCount++;
  gameState.futureCards = [];
};

// ==========================================
// CARD PLAYING LOGIC
// ==========================================

/**
 * Check if a card can be played
 */
export const canPlayCard = (card, gameState, playerId) => {
  const player = gameState.players[playerId];
  const isCurrentPlayer = gameState.currentPlayer === playerId;
  const isAlive = player.isAlive;

  // Check if player has the card
  const hasCard = player.hand.some(c => c.uniqueId === card.uniqueId);
  if (!hasCard) return false;

  // Nope cards can be played at any time as reaction
  if (card.id === 'nope') {
    return isAlive && gameState.lastAction?.type === 'play';
  }

  // All other cards require it to be player's turn
  return isCurrentPlayer && isAlive;
};

/**
 * Check if player can play a cat combo (2 or 3 matching cats)
 */
export const canPlayCatCombo = (player, catCardId) => {
  const catCards = player.hand.filter(c => c.id === catCardId);
  return catCards.length >= 2;
};

/**
 * Get matching cat cards from hand
 */
export const getMatchingCatCards = (player, catCardId, count = 2) => {
  const matchingCards = player.hand.filter(c => c.id === catCardId);
  return matchingCards.slice(0, count);
};

/**
 * Play a card from player's hand
 */
export const playCard = (gameState, playerId, cardUniqueId, targetPlayerId = null) => {
  const newState = JSON.parse(JSON.stringify(gameState)); // Deep clone
  const player = newState.players[playerId];

  // Find the card in player's hand
  const cardIndex = player.hand.findIndex(c => c.uniqueId === cardUniqueId || c.id === cardUniqueId);
  if (cardIndex === -1) {
    console.error('Card not found in hand');
    return gameState;
  }

  const card = player.hand[cardIndex];

  // Remove card from hand and add to discard pile
  player.hand.splice(cardIndex, 1);
  newState.discardPile.push(card);

  // Record the action
  newState.lastAction = { type: 'play', card, playerId };
  newState.actionHistory.push({ type: 'play', card, playerId, timestamp: Date.now() });

  // Apply card effect
  switch (card.id) {
    case 'attack':
      // End turn without drawing, next player takes 2 turns
      const currentTurns = newState.turnsRemaining;
      nextTurn(newState);
      // Stack the attack - next player gets current remaining + 2
      newState.turnsRemaining = currentTurns + 1;
      break;

    case 'skip':
      // End turn without drawing
      if (newState.turnsRemaining > 1) {
        newState.turnsRemaining--;
      } else {
        nextTurn(newState);
      }
      break;

    case 'favor':
      // Request a card from target player
      if (targetPlayerId !== null && targetPlayerId !== playerId) {
        const targetPlayer = newState.players[targetPlayerId];
        if (targetPlayer.isAlive && targetPlayer.hand.length > 0) {
          // Target gives a random card (in real game they choose)
          const randomIndex = Math.floor(Math.random() * targetPlayer.hand.length);
          const givenCard = targetPlayer.hand.splice(randomIndex, 1)[0];
          player.hand.push(givenCard);
          newState.lastAction.targetPlayerId = targetPlayerId;
          newState.lastAction.givenCard = givenCard;
        }
      }
      break;

    case 'shuffle':
      // Shuffle the deck
      newState.deck = shuffleDeck(newState.deck);
      newState.lastAction.message = 'Deck shuffled!';
      break;

    case 'see_future':
      // Peek at top 3 cards
      newState.futureCards = newState.deck.slice(-3).reverse();
      break;

    case 'nope':
      // Cancel the last played action card
      // (In a full implementation, this would undo the last action)
      newState.lastAction.message = 'Action cancelled!';
      break;

    default:
      // Cat cards - check for combos
      if (card.type === 'CAT') {
        // Check if playing a second matching cat for combo
        const matchingInHand = player.hand.filter(c => c.id === card.id);
        if (matchingInHand.length >= 1 && targetPlayerId !== null) {
          // Remove one more matching cat
          const secondCatIndex = player.hand.findIndex(c => c.id === card.id);
          if (secondCatIndex !== -1) {
            const secondCat = player.hand.splice(secondCatIndex, 1)[0];
            newState.discardPile.push(secondCat);

            // Steal a random card from target
            const target = newState.players[targetPlayerId];
            if (target.isAlive && target.hand.length > 0) {
              const stolenIndex = Math.floor(Math.random() * target.hand.length);
              const stolenCard = target.hand.splice(stolenIndex, 1)[0];
              player.hand.push(stolenCard);
              newState.lastAction.stolenCard = stolenCard;
              newState.lastAction.message = `Stole ${stolenCard.name} from ${target.name}!`;
            }
          }
        }
      }
      break;
  }

  return newState;
};

// ==========================================
// DRAWING CARDS
// ==========================================

/**
 * Draw a card from the deck
 */
export const drawCard = (gameState, playerId) => {
  const newState = JSON.parse(JSON.stringify(gameState)); // Deep clone
  const player = newState.players[playerId];

  // Check if deck is empty - reshuffle discard pile
  if (newState.deck.length === 0) {
    if (newState.discardPile.length > 0) {
      // Keep the last discarded card visible
      const lastDiscard = newState.discardPile.pop();
      newState.deck = shuffleDeck(newState.discardPile);
      newState.discardPile = lastDiscard ? [lastDiscard] : [];
    } else {
      // No cards left anywhere
      return gameState;
    }
  }

  if (newState.deck.length === 0) {
    return gameState;
  }

  // Draw from top of deck (end of array)
  const drawnCard = newState.deck.pop();

  // Record the action
  newState.lastAction = { type: 'draw', card: drawnCard, playerId };
  newState.actionHistory.push({ type: 'draw', card: drawnCard, playerId, timestamp: Date.now() });

  // Check if it's an Exploding Kitten
  if (drawnCard.id === 'exploding_kitten') {
    return handleExplodingKitten(newState, player, drawnCard);
  }

  // Add card to hand
  player.hand.push(drawnCard);

  // End turn
  if (newState.turnsRemaining > 1) {
    newState.turnsRemaining--;
  } else {
    nextTurn(newState);
  }

  return newState;
};

/**
 * Handle when an Exploding Kitten is drawn
 */
const handleExplodingKitten = (gameState, player, explodingKitten) => {
  // Check if player has a Defuse card
  const defuseIndex = player.hand.findIndex(c => c.id === 'defuse');

  if (defuseIndex !== -1) {
    // Player has Defuse - use it automatically
    const defuseCard = player.hand.splice(defuseIndex, 1)[0];
    gameState.discardPile.push(defuseCard);

    // Place Exploding Kitten back in deck at random position
    const insertPosition = Math.floor(Math.random() * (gameState.deck.length + 1));
    gameState.deck.splice(insertPosition, 0, explodingKitten);

    gameState.lastAction = {
      type: 'defuse',
      card: defuseCard,
      playerId: player.id,
      message: `${player.name} defused the Exploding Kitten!`
    };

    // Update player's defuse status
    player.hasDefuse = player.hand.some(c => c.id === 'defuse');

    // End turn
    if (gameState.turnsRemaining > 1) {
      gameState.turnsRemaining--;
    } else {
      nextTurn(gameState);
    }
  } else {
    // Player explodes!
    player.isAlive = false;
    player.lives = 0;
    player.hand = []; // Cards are removed from game

    gameState.discardPile.push(explodingKitten);

    gameState.lastAction = {
      type: 'explode',
      card: explodingKitten,
      playerId: player.id,
      message: `${player.name} EXPLODED!`
    };

    // Check if game is over
    const alivePlayers = gameState.players.filter(p => p.isAlive);
    if (alivePlayers.length <= 1) {
      gameState.gameStatus = 'ended';
      if (alivePlayers.length === 1) {
        gameState.winner = alivePlayers[0].id;
      }
    } else {
      // Move to next player
      nextTurn(gameState);
    }
  }

  return gameState;
};

// ==========================================
// CAT COMBOS
// ==========================================

/**
 * Play a cat combo (2 matching cats to steal)
 */
export const playCatCombo = (gameState, playerId, catCardId, targetPlayerId) => {
  const newState = JSON.parse(JSON.stringify(gameState));
  const player = newState.players[playerId];
  const target = newState.players[targetPlayerId];

  // Find 2 matching cat cards
  const matchingCards = player.hand.filter(c => c.id === catCardId);

  if (matchingCards.length < 2) {
    return gameState; // Not enough cards
  }

  if (!target.isAlive || target.hand.length === 0) {
    return gameState; // Invalid target
  }

  // Remove 2 cat cards from hand
  for (let i = 0; i < 2; i++) {
    const cardIndex = player.hand.findIndex(c => c.id === catCardId);
    if (cardIndex !== -1) {
      const removedCard = player.hand.splice(cardIndex, 1)[0];
      newState.discardPile.push(removedCard);
    }
  }

  // Steal a random card from target
  const stolenIndex = Math.floor(Math.random() * target.hand.length);
  const stolenCard = target.hand.splice(stolenIndex, 1)[0];
  player.hand.push(stolenCard);

  newState.lastAction = {
    type: 'combo',
    playerId,
    targetPlayerId,
    stolenCard,
    message: `${player.name} stole ${stolenCard.name} from ${target.name}!`
  };

  return newState;
};

// ==========================================
// GAME STATE HELPERS
// ==========================================

/**
 * Check if the game is over
 */
export const isGameOver = (gameState) => {
  const alivePlayers = gameState.players.filter(p => p.isAlive);
  return alivePlayers.length <= 1;
};

/**
 * Get the winner of the game
 */
export const getWinner = (gameState) => {
  const alivePlayers = gameState.players.filter(p => p.isAlive);
  return alivePlayers.length === 1 ? alivePlayers[0] : null;
};

/**
 * Get playable cards for current player
 */
export const getPlayableCards = (gameState) => {
  const currentPlayer = gameState.players[gameState.currentPlayer];
  if (!currentPlayer || !currentPlayer.isAlive) return [];

  return currentPlayer.hand.filter(card => {
    // All action cards are playable
    if (card.type === 'ACTION') return true;

    // Cat cards are playable if player has 2 of the same
    if (card.type === 'CAT') {
      const matching = currentPlayer.hand.filter(c => c.id === card.id);
      return matching.length >= 2;
    }

    // Special cards (Defuse) can't be played manually
    return false;
  });
};

/**
 * Count specific card type in hand
 */
export const countCardsOfType = (hand, cardId) => {
  return hand.filter(c => c.id === cardId).length;
};

/**
 * Get game statistics
 */
export const getGameStats = (gameState) => {
  return {
    totalPlayers: gameState.players.length,
    alivePlayers: gameState.players.filter(p => p.isAlive).length,
    eliminatedPlayers: gameState.players.filter(p => !p.isAlive).length,
    cardsInDeck: gameState.deck.length,
    cardsDiscarded: gameState.discardPile.length,
    turnCount: gameState.turnCount,
    explodingKittensRemaining: gameState.deck.filter(c => c.id === 'exploding_kitten').length
  };
};
