// BOOM CATS - Card Definitions
// ================================

export const CARD_TYPES = {
  ACTION: 'ACTION',
  SPECIAL: 'SPECIAL',
  CAT: 'CAT'
};

export const CARDS = {
  // ==================
  // ACTION CARDS
  // ==================
  ATTACK: {
    id: 'attack',
    type: CARD_TYPES.ACTION,
    name: 'Attack',
    description: 'End your turn without drawing. Next player takes 2 turns.',
    color: '#ef4444'
  },
  SKIP: {
    id: 'skip',
    type: CARD_TYPES.ACTION,
    name: 'Skip',
    description: 'End your turn without drawing a card.',
    color: '#3b82f6'
  },
  FAVOR: {
    id: 'favor',
    type: CARD_TYPES.ACTION,
    name: 'Favor',
    description: 'Choose a player to give you 1 card of their choice.',
    color: '#8b5cf6'
  },
  SHUFFLE: {
    id: 'shuffle',
    type: CARD_TYPES.ACTION,
    name: 'Shuffle',
    description: 'Shuffle the draw pile.',
    color: '#06b6d4'
  },
  SEE_FUTURE: {
    id: 'see_future',
    type: CARD_TYPES.ACTION,
    name: 'See Future',
    description: 'Peek at the top 3 cards of the deck.',
    color: '#10b981'
  },
  NOPE: {
    id: 'nope',
    type: CARD_TYPES.ACTION,
    name: 'Nope',
    description: 'Cancel another player\'s action card. Cannot cancel Exploding Kittens or Defuse.',
    color: '#f59e0b'
  },

  // ==================
  // SPECIAL CARDS
  // ==================
  EXPLODING_KITTEN: {
    id: 'exploding_kitten',
    type: CARD_TYPES.SPECIAL,
    name: 'Exploding Kitten',
    description: 'You explode unless you have a Defuse card!',
    color: '#dc2626'
  },
  DEFUSE: {
    id: 'defuse',
    type: CARD_TYPES.SPECIAL,
    name: 'Defuse',
    description: 'Defuse an Exploding Kitten. Place it back in the deck anywhere.',
    color: '#16a34a'
  },

  // ==================
  // CAT CARDS (Combo Cards)
  // Collect 2 or 3 of the same to steal cards
  // ==================
  BEARDED_CAT: {
    id: 'bearded_cat',
    type: CARD_TYPES.CAT,
    name: 'Beard Cat',
    description: 'Collect 2 of the same to steal a random card from another player.',
    color: '#6366f1'
  },
  WATERMELON_CAT: {
    id: 'watermelon_cat',
    type: CARD_TYPES.CAT,
    name: 'Melon Cat',
    description: 'Collect 2 of the same to steal a random card from another player.',
    color: '#ec4899'
  },
  POTATO_CAT: {
    id: 'potato_cat',
    type: CARD_TYPES.CAT,
    name: 'Potato Cat',
    description: 'Collect 2 of the same to steal a random card from another player.',
    color: '#f97316'
  },
  RAINBOW_CAT: {
    id: 'rainbow_cat',
    type: CARD_TYPES.CAT,
    name: 'Rainbow Cat',
    description: 'Collect 2 of the same to steal a random card from another player.',
    color: '#a855f7'
  },
  TACO_CAT: {
    id: 'taco_cat',
    type: CARD_TYPES.CAT,
    name: 'Taco Cat',
    description: 'Collect 2 of the same to steal a random card from another player.',
    color: '#84cc16'
  }
};

/**
 * Create a deck following official rules:
 * - Remove Exploding Kittens and Defuse cards first
 * - Standard deck has action and cat cards only initially
 */
export const createBaseDeck = () => {
  const deck = [];

  // Action Cards (4 of each, except See Future and Nope have 5)
  for (let i = 0; i < 4; i++) {
    deck.push({ ...CARDS.ATTACK });
    deck.push({ ...CARDS.SKIP });
    deck.push({ ...CARDS.FAVOR });
    deck.push({ ...CARDS.SHUFFLE });
  }

  // See Future - 5 cards
  for (let i = 0; i < 5; i++) {
    deck.push({ ...CARDS.SEE_FUTURE });
  }

  // Nope - 5 cards
  for (let i = 0; i < 5; i++) {
    deck.push({ ...CARDS.NOPE });
  }

  // Cat Cards - 4 of each type
  for (let i = 0; i < 4; i++) {
    deck.push({ ...CARDS.BEARDED_CAT });
    deck.push({ ...CARDS.WATERMELON_CAT });
    deck.push({ ...CARDS.POTATO_CAT });
    deck.push({ ...CARDS.RAINBOW_CAT });
    deck.push({ ...CARDS.TACO_CAT });
  }

  return deck;
};

/**
 * Create Defuse cards (6 total in original game, 1 per player + extras)
 */
export const createDefuseCards = (playerCount) => {
  const defuseCards = [];
  // Give each player 1 defuse + some extras in deck
  const totalDefuse = Math.max(playerCount + 2, 6);
  for (let i = 0; i < totalDefuse; i++) {
    defuseCards.push({ ...CARDS.DEFUSE });
  }
  return defuseCards;
};

/**
 * Create Exploding Kitten cards (players - 1)
 */
export const createExplodingKittens = (playerCount) => {
  const explodingKittens = [];
  // Always 1 less than player count so there's always a winner
  for (let i = 0; i < playerCount - 1; i++) {
    explodingKittens.push({ ...CARDS.EXPLODING_KITTEN });
  }
  return explodingKittens;
};

/**
 * Shuffle a deck using Fisher-Yates algorithm
 */
export const shuffleDeck = (deck) => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Create a card with unique ID
 */
export const createCard = (cardTemplate) => {
  return {
    ...cardTemplate,
    uniqueId: `${cardTemplate.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
};

/**
 * Get the base card ID from card (removes unique suffix)
 */
export const getBaseCardId = (card) => {
  return card.id;
};

/**
 * Legacy function for backwards compatibility
 */
export const createDeck = (playerCount) => {
  const baseDeck = createBaseDeck();
  const explodingKittens = createExplodingKittens(playerCount);
  return [...baseDeck, ...explodingKittens];
};
