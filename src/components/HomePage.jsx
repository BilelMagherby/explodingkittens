import React, { useState, useEffect, useCallback } from 'react';
import './HomePage.css';
import soundManager from '../utils/soundManager';

const HomePage = ({ onStartGame, currentSkins = { themeSkin: 'default', cardSkin: 'classic', playerSkin: 'cats' }, onSkinChange = () => { } }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSkins, setShowSkins] = useState(false);
  const [activeSkinTab, setActiveSkinTab] = useState('cards'); // cards, players, theme

  const [hoveredButton, setHoveredButton] = useState('');
  const [sparks, setSparks] = useState([]);

  // Sound settings state
  const [soundSettings, setSoundSettings] = useState(soundManager.getSettings());
  const [soundInitialized, setSoundInitialized] = useState(false);

  // Initialize sound on first user interaction
  const initSound = useCallback(() => {
    if (!soundInitialized) {
      soundManager.init();
      setSoundInitialized(true);
      // Start background music
      if (soundSettings.musicEnabled) {
        soundManager.startMusic();
      }
    }
  }, [soundInitialized, soundSettings.musicEnabled]);

  // Handle any click to initialize audio (browser requirement)
  useEffect(() => {
    const handleFirstInteraction = () => {
      initSound();
      document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);
    return () => document.removeEventListener('click', handleFirstInteraction);
  }, [initSound]);

  // Generate random sparks/particles
  useEffect(() => {
    const generateSparks = () => {
      const newSparks = [];
      for (let i = 0; i < 20; i++) {
        newSparks.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 8 + 4,
          delay: Math.random() * 3,
          duration: Math.random() * 2 + 1
        });
      }
      setSparks(newSparks);
    };
    generateSparks();
  }, []);

  // Toggle music
  const handleToggleMusic = () => {
    const newState = soundManager.toggleMusic();
    setSoundSettings(prev => ({ ...prev, musicEnabled: newState }));
    soundManager.play('buttonClick');
  };

  // Toggle SFX
  const handleToggleSfx = () => {
    const newState = soundManager.toggleSfx();
    setSoundSettings(prev => ({ ...prev, sfxEnabled: newState }));
    if (newState) {
      soundManager.play('buttonClick');
    }
  };

  // Handle music volume change
  const handleMusicVolume = (e) => {
    const volume = parseFloat(e.target.value);
    soundManager.setMusicVolume(volume);
    setSoundSettings(prev => ({ ...prev, musicVolume: volume }));
  };

  // Handle SFX volume change
  const handleSfxVolume = (e) => {
    const volume = parseFloat(e.target.value);
    soundManager.setSfxVolume(volume);
    setSoundSettings(prev => ({ ...prev, sfxVolume: volume }));
    soundManager.play('buttonClick');
  };

  // Play button hover sound
  const handleButtonHover = (buttonName) => {
    setHoveredButton(buttonName);
    soundManager.play('buttonHover');
  };

  const handleStartGame = () => {
    soundManager.play('buttonClick');
    onStartGame(playerCount, currentSkins);
  };

  // How To Play Modal
  if (showHowToPlay) {
    return (
      <div className="game-screen how-to-play-screen">
        <div className="modal-backdrop" onClick={() => setShowHowToPlay(false)} />
        <div className="modal-content how-to-play-modal">
          <div className="modal-header">
            <h1 className="modal-title">
              <span className="icon">📘</span> HOW TO PLAY
            </h1>
          </div>

          <div className="modal-body">
            <section className="info-section">
              <h2><span className="icon">🎯</span> OBJECTIVE</h2>
              <p>Be the last player standing! Avoid exploding kittens and use your cards strategically to eliminate opponents.</p>
            </section>

            <section className="info-section">
              <h2><span className="icon">🎮</span> GAMEPLAY</h2>
              <ol className="gameplay-steps">
                <li><span className="step-number">1</span> Play action cards from your hand (optional)</li>
                <li><span className="step-number">2</span> Draw a card from the deck to end your turn</li>
                <li><span className="step-number">3</span> If you draw an Exploding Kitten, you must defuse it!</li>
                <li><span className="step-number">4</span> Use a Defuse card to survive, or you're eliminated</li>
                <li><span className="step-number">5</span> Last cat standing wins the game!</li>
              </ol>
            </section>

            <section className="info-section">
              <h2><span className="icon">🃏</span> CARD TYPES</h2>
              <div className="cards-grid">
                <div className="card-info attack">
                  <span className="card-icon">⚔️</span>
                  <div className="card-details">
                    <strong>ATTACK</strong>
                    <span>Force next player to take 2 turns</span>
                  </div>
                </div>
                <div className="card-info skip">
                  <span className="card-icon">⏭️</span>
                  <div className="card-details">
                    <strong>SKIP</strong>
                    <span>End turn without drawing</span>
                  </div>
                </div>
                <div className="card-info favor">
                  <span className="card-icon">🤝</span>
                  <div className="card-details">
                    <strong>FAVOR</strong>
                    <span>Steal a card from any player</span>
                  </div>
                </div>
                <div className="card-info shuffle">
                  <span className="card-icon">🔀</span>
                  <div className="card-details">
                    <strong>SHUFFLE</strong>
                    <span>Randomize the draw pile</span>
                  </div>
                </div>
                <div className="card-info see-future">
                  <span className="card-icon">👁️</span>
                  <div className="card-details">
                    <strong>SEE FUTURE</strong>
                    <span>Peek at top 3 cards</span>
                  </div>
                </div>
                <div className="card-info nope">
                  <span className="card-icon">🚫</span>
                  <div className="card-details">
                    <strong>NOPE</strong>
                    <span>Cancel any action card</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <button className="back-button" onClick={() => setShowHowToPlay(false)}>
            <span className="icon">🏠</span> BACK TO MENU
          </button>
        </div>
      </div>
    );
  }

  // Settings Modal
  if (showSettings) {
    return (
      <div className="game-screen settings-screen">
        <div className="modal-backdrop" onClick={() => setShowSettings(false)} />
        <div className="modal-content settings-modal">
          <div className="modal-header">
            <h1 className="modal-title">
              <span className="icon">⚙️</span> SETTINGS
            </h1>
          </div>

          <div className="modal-body">
            {/* Audio Settings */}
            <section className="info-section">
              <h2><span className="icon">🔊</span> AUDIO</h2>
              <div className="settings-list">
                {/* Music Toggle */}
                <div className="setting-item">
                  <span>🎵 Background Music</span>
                  <button
                    className={`toggle-btn ${soundSettings.musicEnabled ? 'active' : ''}`}
                    onClick={handleToggleMusic}
                  >
                    {soundSettings.musicEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Music Volume */}
                <div className="setting-item volume-control">
                  <span>Music Volume</span>
                  <div className="volume-slider-container">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={soundSettings.musicVolume}
                      onChange={handleMusicVolume}
                      className="volume-slider"
                      disabled={!soundSettings.musicEnabled}
                    />
                    <span className="volume-value">{Math.round(soundSettings.musicVolume * 100)}%</span>
                  </div>
                </div>

                {/* SFX Toggle */}
                <div className="setting-item">
                  <span>🔉 Sound Effects</span>
                  <button
                    className={`toggle-btn ${soundSettings.sfxEnabled ? 'active' : ''}`}
                    onClick={handleToggleSfx}
                  >
                    {soundSettings.sfxEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* SFX Volume */}
                <div className="setting-item volume-control">
                  <span>Effects Volume</span>
                  <div className="volume-slider-container">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={soundSettings.sfxVolume}
                      onChange={handleSfxVolume}
                      className="volume-slider"
                      disabled={!soundSettings.sfxEnabled}
                    />
                    <span className="volume-value">{Math.round(soundSettings.sfxVolume * 100)}%</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="info-section">
              <h2><span className="icon">ℹ️</span> GAME INFO</h2>
              <div className="settings-list">
                <div className="setting-item">
                  <span>Version</span>
                  <span className="setting-value">1.0.0</span>
                </div>
                <div className="setting-item">
                  <span>Language</span>
                  <span className="setting-value">English</span>
                </div>
                <div className="setting-item">
                  <span>Players</span>
                  <span className="setting-value">2-5</span>
                </div>
              </div>
            </section>

            <section className="info-section">
              <h2><span className="icon">✨</span> FEATURES</h2>
              <ul className="features-list">
                <li><span className="feature-icon">💥</span> Explosive gameplay</li>
                <li><span className="feature-icon">🐱</span> Chaotic cat characters</li>
                <li><span className="feature-icon">🎮</span> Local multiplayer (2-5 players)</li>
                <li><span className="feature-icon">🔊</span> Dark ambient soundtrack</li>
                <li><span className="feature-icon">🎨</span> Beautiful animations</li>
              </ul>
            </section>
          </div>

          <button className="back-button" onClick={() => setShowSettings(false)}>
            <span className="icon">🏠</span> BACK TO MENU
          </button>
        </div>
      </div>
    );
  }

  // Skins Page (Full Screen)
  if (showSkins) {
    return (
      <div className={`game-screen skins-screen theme-${currentSkins.themeSkin}`}>
        {/* Background Layer */}
        <div className="background-layer">
          {currentSkins.themeSkin === 'space' ? (
            <div className="bg-space" />
          ) : (
            <img src="/explosion_bg.png" alt="" className="bg-explosion" />
          )}
          <div className="bg-overlay" />
        </div>

        {/* Floating Particles (if needed for consistency) */}
        <div className="sparks-container">
          {sparks.map(spark => (
            <div key={spark.id} className="spark" style={{
              left: `${spark.x}%`, top: `${spark.y}%`,
              width: `${spark.size}px`, height: `${spark.size}px`,
              animationDelay: `${spark.delay}s`, animationDuration: `${spark.duration}s`
            }} />
          ))}
        </div>

        <div className="skins-page-content">
          <div className="page-header">
            <h1 className="page-title">
              <span className="icon">🎨</span> SKINS & THEMES
            </h1>
            <p className="page-subtitle">Customize your explosive experience!</p>
          </div>

          <div className="skin-tabs">
            <button
              className={`skin-tab ${activeSkinTab === 'cards' ? 'active' : ''}`}
              onClick={() => setActiveSkinTab('cards')}
            >
              🃏 CARDS
            </button>
            <button
              className={`skin-tab ${activeSkinTab === 'players' ? 'active' : ''}`}
              onClick={() => setActiveSkinTab('players')}
            >
              🐱 PLAYERS
            </button>
            <button
              className={`skin-tab ${activeSkinTab === 'theme' ? 'active' : ''}`}
              onClick={() => setActiveSkinTab('theme')}
            >
              🌍 THEME
            </button>
          </div>

          <div className="skins-body full-page-body">
            {activeSkinTab === 'cards' && (
              <div className="skins-grid">
                {/* Classic Card Skin */}
                <div
                  className={`skin-card ${currentSkins.cardSkin === 'classic' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, cardSkin: 'classic' })}
                >
                  <div className="skin-preview-box card-preview-classic">
                    <span className="preview-icon">🃏</span>
                  </div>
                  <div className="skin-info">
                    <h3>CLASSIC</h3>
                    <p>Original Explosive Style</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.cardSkin === 'classic' ? 'selected' : ''}`}>
                    {currentSkins.cardSkin === 'classic' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Minimal Skin */}
                <div
                  className={`skin-card ${currentSkins.cardSkin === 'minimal' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, cardSkin: 'minimal' })}
                >
                  <div className="skin-preview-box card-preview-minimal">
                    <span className="preview-icon">⬜</span>
                  </div>
                  <div className="skin-info">
                    <h3>MINIMAL</h3>
                    <p>Clean & Simple Lines</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.cardSkin === 'minimal' ? 'selected' : ''}`}>
                    {currentSkins.cardSkin === 'minimal' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Cyberpunk Skin */}
                <div
                  className={`skin-card ${currentSkins.cardSkin === 'cyber' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, cardSkin: 'cyber' })}
                >
                  <div className="skin-preview-box card-preview-cyber">
                    <span className="preview-icon">🤖</span>
                  </div>
                  <div className="skin-info">
                    <h3>CYBER</h3>
                    <p>Neon Future Vibes</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.cardSkin === 'cyber' ? 'selected' : ''}`}>
                    {currentSkins.cardSkin === 'cyber' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Gold Skin - NEW */}
                <div
                  className={`skin-card ${currentSkins.cardSkin === 'gold' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, cardSkin: 'gold' })}
                >
                  <div className="skin-preview-box card-preview-gold">
                    <span className="preview-icon">🏆</span>
                  </div>
                  <div className="skin-info">
                    <h3>GOLD</h3>
                    <p>Luxury & Riches</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.cardSkin === 'gold' ? 'selected' : ''}`}>
                    {currentSkins.cardSkin === 'gold' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Sketch Skin - NEW */}
                <div
                  className={`skin-card ${currentSkins.cardSkin === 'sketch' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, cardSkin: 'sketch' })}
                >
                  <div className="skin-preview-box card-preview-sketch">
                    <span className="preview-icon">✏️</span>
                  </div>
                  <div className="skin-info">
                    <h3>SKETCH</h3>
                    <p>Hand-Drawn Doodle</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.cardSkin === 'sketch' ? 'selected' : ''}`}>
                    {currentSkins.cardSkin === 'sketch' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Rainbow Skin - NEW */}
                <div
                  className={`skin-card ${currentSkins.cardSkin === 'rainbow' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, cardSkin: 'rainbow' })}
                >
                  <div className="skin-preview-box card-preview-rainbow">
                    <span className="preview-icon">🌈</span>
                  </div>
                  <div className="skin-info">
                    <h3>RAINBOW</h3>
                    <p>Prismatic Power</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.cardSkin === 'rainbow' ? 'selected' : ''}`}>
                    {currentSkins.cardSkin === 'rainbow' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>
              </div>
            )}

            {activeSkinTab === 'players' && (
              <div className="skins-grid">
                {/* Standard Cats */}
                <div
                  className={`skin-card ${currentSkins.playerSkin === 'cats' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, playerSkin: 'cats' })}
                >
                  <div className="skin-preview-box player-preview-cats">
                    <span className="preview-icon">🐱</span>
                  </div>
                  <div className="skin-info">
                    <h3>CATS</h3>
                    <p>Standard Furry Friends</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.playerSkin === 'cats' ? 'selected' : ''}`}>
                    {currentSkins.playerSkin === 'cats' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Doge Skin */}
                <div
                  className={`skin-card ${currentSkins.playerSkin === 'dogs' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, playerSkin: 'dogs' })}
                >
                  <div className="skin-preview-box player-preview-dogs">
                    <span className="preview-icon">🐶</span>
                  </div>
                  <div className="skin-info">
                    <h3>DOGGOS</h3>
                    <p>Good Boys Only</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.playerSkin === 'dogs' ? 'selected' : ''}`}>
                    {currentSkins.playerSkin === 'dogs' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Tiger Skin - NEW */}
                <div
                  className={`skin-card ${currentSkins.playerSkin === 'tiger' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, playerSkin: 'tiger' })}
                >
                  <div className="skin-preview-box player-preview-tiger">
                    <span className="preview-icon">🐯</span>
                  </div>
                  <div className="skin-info">
                    <h3>TIGER</h3>
                    <p>Wild & Striped</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.playerSkin === 'tiger' ? 'selected' : ''}`}>
                    {currentSkins.playerSkin === 'tiger' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Robot Skin - NEW */}
                <div
                  className={`skin-card ${currentSkins.playerSkin === 'robot' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, playerSkin: 'robot' })}
                >
                  <div className="skin-preview-box player-preview-robot">
                    <span className="preview-icon">🦾</span>
                  </div>
                  <div className="skin-info">
                    <h3>MECHA</h3>
                    <p>Steel Claws</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.playerSkin === 'robot' ? 'selected' : ''}`}>
                    {currentSkins.playerSkin === 'robot' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Skeleton Skin - NEW */}
                <div
                  className={`skin-card ${currentSkins.playerSkin === 'skeleton' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, playerSkin: 'skeleton' })}
                >
                  <div className="skin-preview-box player-preview-skeleton">
                    <span className="preview-icon">🦴</span>
                  </div>
                  <div className="skin-info">
                    <h3>BONES</h3>
                    <p>Spooky Skeleton Hands</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.playerSkin === 'skeleton' ? 'selected' : ''}`}>
                    {currentSkins.playerSkin === 'skeleton' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>
              </div>
            )}

            {activeSkinTab === 'theme' && (
              <div className="skins-grid">
                {/* Default Theme */}
                <div
                  className={`skin-card ${currentSkins.themeSkin === 'default' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, themeSkin: 'default' })}
                >
                  <div className="skin-preview-box theme-preview-default">
                    <span className="preview-icon">🔥</span>
                  </div>
                  <div className="skin-info">
                    <h3>EXPLOSION</h3>
                    <p>Fiery Destruction</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.themeSkin === 'default' ? 'selected' : ''}`}>
                    {currentSkins.themeSkin === 'default' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Space Theme */}
                <div
                  className={`skin-card ${currentSkins.themeSkin === 'space' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, themeSkin: 'space' })}
                >
                  <div className="skin-preview-box theme-preview-space">
                    <span className="preview-icon">🚀</span>
                  </div>
                  <div className="skin-info">
                    <h3>SPACE</h3>
                    <p>Cosmic Catastrophe</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.themeSkin === 'space' ? 'selected' : ''}`}>
                    {currentSkins.themeSkin === 'space' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Forest Theme - NEW */}
                <div
                  className={`skin-card ${currentSkins.themeSkin === 'forest' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, themeSkin: 'forest' })}
                >
                  <div className="skin-preview-box theme-preview-forest">
                    <span className="preview-icon">🌲</span>
                  </div>
                  <div className="skin-info">
                    <h3>FOREST</h3>
                    <p>Nature's Wrath</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.themeSkin === 'forest' ? 'selected' : ''}`}>
                    {currentSkins.themeSkin === 'forest' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Volcano Theme - NEW */}
                <div
                  className={`skin-card ${currentSkins.themeSkin === 'volcano' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, themeSkin: 'volcano' })}
                >
                  <div className="skin-preview-box theme-preview-volcano">
                    <span className="preview-icon">🌋</span>
                  </div>
                  <div className="skin-info">
                    <h3>VOLCANO</h3>
                    <p>Magma & Ash</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.themeSkin === 'volcano' ? 'selected' : ''}`}>
                    {currentSkins.themeSkin === 'volcano' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Underwater Theme - NEW */}
                <div
                  className={`skin-card ${currentSkins.themeSkin === 'underwater' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, themeSkin: 'underwater' })}
                >
                  <div className="skin-preview-box theme-preview-underwater">
                    <span className="preview-icon">🌊</span>
                  </div>
                  <div className="skin-info">
                    <h3>OCEAN</h3>
                    <p>Deep Blue</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.themeSkin === 'underwater' ? 'selected' : ''}`}>
                    {currentSkins.themeSkin === 'underwater' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>

                {/* Retro Theme - NEW */}
                <div
                  className={`skin-card ${currentSkins.themeSkin === 'retro' ? 'active' : ''}`}
                  onClick={() => onSkinChange({ ...currentSkins, themeSkin: 'retro' })}
                >
                  <div className="skin-preview-box theme-preview-retro">
                    <span className="preview-icon">👾</span>
                  </div>
                  <div className="skin-info">
                    <h3>RETRO</h3>
                    <p>8-Bit Classic</p>
                  </div>
                  <button className={`skin-select-btn ${currentSkins.themeSkin === 'retro' ? 'selected' : ''}`}>
                    {currentSkins.themeSkin === 'retro' ? 'SELECTED' : 'SELECT'}
                  </button>
                </div>
              </div>
            )}

            <p className="coming-soon-text">More options coming soon!</p>
          </div>

          <button className="back-button fixed-bottom" onClick={() => setShowSkins(false)}>
            <span className="icon">🏠</span> BACK TO MENU
          </button>
        </div>
      </div>
    );
  }

  // Main Home Screen
  return (
    <div className={`game-screen home-screen theme-${currentSkins.themeSkin}`}>
      {/* Explosion Background */}
      <div className="background-layer">
        <img src="/explosion_bg.png" alt="" className="bg-explosion" />
        <div className="bg-overlay" />
      </div>

      {/* Animated Sparks */}
      <div className="sparks-container">
        {sparks.map(spark => (
          <div
            key={spark.id}
            className="spark"
            style={{
              left: `${spark.x}%`,
              top: `${spark.y}%`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              animationDelay: `${spark.delay}s`,
              animationDuration: `${spark.duration}s`
            }}
          />
        ))}
      </div>

      {/* Smoke Clouds */}
      <div className="smoke-container">
        <div className="smoke smoke-1" />
        <div className="smoke smoke-2" />
        <div className="smoke smoke-3" />
      </div>

      {/* Paw Print Patterns */}
      <div className="paw-pattern">
        <span className="paw paw-1">🐾</span>
        <span className="paw paw-2">🐾</span>
        <span className="paw paw-3">🐾</span>
        <span className="paw paw-4">🐾</span>
        <span className="paw paw-5">🐾</span>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Logo Section */}
        <header className="logo-section">
          <div className="logo-container">
            <img src="/boom_cats_logo.png" alt="BOOM CATS" className="game-logo" />
          </div>
          <p className="tagline">The Explosive Card Game of Chaotic Cats!</p>
        </header>

        {/* Menu Buttons */}
        <nav className="menu-section">
          {/* Player Count Selector */}
          <div className="player-selector">
            <label className="player-label">
              <span className="label-icon">👥</span>
              PLAYERS: <span className="player-count">{playerCount}</span>
            </label>
            <div className="player-slider-container">
              <input
                type="range"
                min="2"
                max="5"
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                className="player-slider"
              />
              <div className="slider-marks">
                {[2, 3, 4, 5].map(num => (
                  <span
                    key={num}
                    className={`mark ${playerCount === num ? 'active' : ''}`}
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Start Game Button */}
          <button
            className={`menu-button start-button ${hoveredButton === 'start' ? 'hovered' : ''}`}
            onClick={handleStartGame}
            onMouseEnter={() => setHoveredButton('start')}
            onMouseLeave={() => setHoveredButton('')}
          >
            <span className="button-icon">🎮</span>
            <span className="button-text">START PLAYING</span>
            <div className="button-glow" />
          </button>

          {/* Skins Button */}
          <button
            className={`menu-button skins-button ${hoveredButton === 'skins' ? 'hovered' : ''}`}
            onClick={() => setShowSkins(true)}
            onMouseEnter={() => setHoveredButton('skins')}
            onMouseLeave={() => setHoveredButton('')}
          >
            <span className="button-icon">🎨</span>
            <span className="button-text">SKINS</span>
            <div className="button-glow" />
          </button>

          {/* How To Play Button */}
          <button
            className={`menu-button howto-button ${hoveredButton === 'howto' ? 'hovered' : ''}`}
            onClick={() => setShowHowToPlay(true)}
            onMouseEnter={() => setHoveredButton('howto')}
            onMouseLeave={() => setHoveredButton('')}
          >
            <span className="button-icon">❓</span>
            <span className="button-text">HOW TO PLAY</span>
            <div className="button-glow" />
          </button>

          {/* Settings Button */}
          <button
            className={`menu-button settings-button ${hoveredButton === 'settings' ? 'hovered' : ''}`}
            onClick={() => setShowSettings(true)}
            onMouseEnter={() => setHoveredButton('settings')}
            onMouseLeave={() => setHoveredButton('')}
          >
            <span className="button-icon">⚙️</span>
            <span className="button-text">SETTINGS</span>
            <div className="button-glow" />
          </button>
        </nav>

        {/* Corner Cats */}
        <div className="corner-cats">
          <img src="/cat_cool.png" alt="Cool Cat" className="corner-cat cat-top-left" />
          <img src="/cat_bomb.png" alt="Bomb Cat" className="corner-cat cat-top-right" />
          <img src="/cat_cool.png" alt="Cool Cat" className="corner-cat cat-bottom-left" />
          <img src="/cat_bomb.png" alt="Bomb Cat" className="corner-cat cat-bottom-right" />
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <button className="footer-button">Credits</button>
          <span className="footer-divider">•</span>
          <button className="footer-button">About</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
