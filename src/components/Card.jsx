import React from 'react';

const Card = ({ card, onClick, isPlayable = false, isSelected = false, isSmall = false, showBack = false }) => {
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
    return icons[cardId] || '🃏';
  };

  const getCardBackground = (card) => {
    if (card.type === 'SPECIAL') {
      if (card.id === 'exploding_kitten') {
        return 'linear-gradient(135deg, #ff6b6b 0%, #e63946 50%, #c62828 100%)';
      } else if (card.id === 'defuse') {
        return 'linear-gradient(135deg, #74b9ff 0%, #4285f4 50%, #1565c0 100%)';
      }
    } else if (card.type === 'ACTION') {
      return `linear-gradient(135deg, #ffffff 0%, ${card.color}25 100%)`;
    } else if (card.type === 'CAT') {
      return `linear-gradient(135deg, #ffffff 0%, ${card.color}30 100%)`;
    }
    return 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)';
  };

  const cardWidth = isSmall ? '65px' : '95px';
  const cardHeight = isSmall ? '95px' : '130px';
  const iconSize = isSmall ? '1.8rem' : '2.5rem';
  const fontSize = isSmall ? '0.65rem' : '0.8rem';

  if (showBack) {
    return (
      <div
        onClick={onClick}
        style={{
          width: cardWidth,
          height: cardHeight,
          background: 'linear-gradient(135deg, #2d1810 0%, #1a0a0a 100%)',
          border: '3px solid #ffd60a',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 214, 10, 0.2)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        {/* Card back pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.15,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(6, 1fr)'
        }}>
          {[...Array(24)].map((_, i) => (
            <div key={i} style={{ border: '1px solid #ffd60a' }} />
          ))}
        </div>

        {/* Card back content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: isSmall ? '1.8rem' : '2.5rem', marginBottom: '0.25rem' }}>🐱</div>
          <div style={{
            fontFamily: 'Bangers, cursive',
            fontSize: isSmall ? '0.55rem' : '0.7rem',
            color: '#ffd60a',
            letterSpacing: '1px',
            textAlign: 'center',
            lineHeight: '1.2'
          }}>
            BOOM<br />CATS
          </div>
        </div>

        {/* Corner markers */}
        <div style={{
          position: 'absolute',
          top: '3px',
          right: '5px',
          color: '#ffd60a',
          fontSize: isSmall ? '0.5rem' : '0.65rem'
        }}>🐱</div>
        <div style={{
          position: 'absolute',
          bottom: '3px',
          left: '5px',
          color: '#ffd60a',
          fontSize: isSmall ? '0.5rem' : '0.65rem',
          transform: 'rotate(180deg)'
        }}>🐱</div>
      </div>
    );
  }

  return (
    <div
      onClick={isPlayable ? onClick : undefined}
      style={{
        width: cardWidth,
        height: cardHeight,
        background: getCardBackground(card),
        border: `3px solid ${card.color || '#333'}`,
        borderRadius: '12px',
        boxShadow: isSelected
          ? `0 0 25px ${card.color || '#ffd60a'}, 0 8px 20px rgba(0, 0, 0, 0.4)`
          : '0 4px 15px rgba(0, 0, 0, 0.3)',
        cursor: isPlayable ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isSmall ? '0.4rem' : '0.6rem',
        transition: 'all 0.2s ease',
        transform: isSelected ? 'translateY(-5px) scale(1.05)' : isPlayable ? 'scale(1)' : 'scale(1)',
        outline: isSelected ? `3px solid #ffd60a` : 'none',
        outlineOffset: '2px'
      }}
      onMouseEnter={(e) => {
        if (isPlayable && !isSelected) {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
          e.currentTarget.style.boxShadow = `0 0 20px ${card.color || '#ffd60a'}, 0 10px 25px rgba(0, 0, 0, 0.4)`;
        }
      }}
      onMouseLeave={(e) => {
        if (isPlayable && !isSelected) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        }
      }}
    >
      {/* Corner markers */}
      <div style={{
        position: 'absolute',
        top: '3px',
        right: '5px',
        fontSize: isSmall ? '0.6rem' : '0.75rem',
        color: card.color
      }}>
        {getCardIcon(card.id)}
      </div>
      <div style={{
        position: 'absolute',
        bottom: '3px',
        left: '5px',
        fontSize: isSmall ? '0.6rem' : '0.75rem',
        color: card.color,
        transform: 'rotate(180deg)'
      }}>
        {getCardIcon(card.id)}
      </div>

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        textAlign: 'center'
      }}>
        {/* Icon */}
        <div style={{ fontSize: iconSize, marginBottom: '0.3rem' }}>
          {getCardIcon(card.id)}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: 'Fredoka, sans-serif',
          fontWeight: 'bold',
          fontSize: fontSize,
          color: card.color || '#333',
          lineHeight: '1.2',
          padding: '0 0.2rem'
        }}>
          {card.name}
        </div>

        {/* Type indicator */}
        {!isSmall && (
          <div style={{ fontSize: '0.7rem', marginTop: '0.25rem', opacity: 0.7 }}>
            {card.type === 'ACTION' && '⚡'}
            {card.type === 'SPECIAL' && '⭐'}
            {card.type === 'CAT' && '🐱'}
          </div>
        )}
      </div>

      {/* Card type stripe */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: card.color || '#333',
        opacity: 0.4
      }} />

      {/* Selected glow overlay */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${card.color}30 0%, transparent 70%)`,
          animation: 'pulse 1.5s infinite',
          pointerEvents: 'none'
        }} />
      )}
    </div>
  );
};

export default Card;
