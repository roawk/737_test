/* ==========================================================================
   Main Application Entry Point (ES6 Module)
   ========================================================================== */

import { FORTUNE_DATABASE } from './data/fortunes.js';
import { SoundEngine } from './audio/soundEngine.js';
import { ParticleSystem } from './effects/particleSystem.js';
import { generateLuckyNumbers, copyToClipboard, downloadCardCanvas } from './utils/helpers.js';
import { StorageManager } from './utils/storage.js';

class FortuneApp {
  constructor() {
    this.sound = new SoundEngine();
    this.currentCategory = 'all';
    this.currentFortune = null;
    this.isCracked = false;
    this.history = StorageManager.loadHistory();
    this.themes = ['midnight', 'golden', 'sakura', 'mystic'];
    this.currentThemeIdx = 0;

    this.initDOM();
    this.initEvents();
    this.updateHistoryBadge();
    this.particleSys = new ParticleSystem(this.dom.particleCanvas);
  }

  initDOM() {
    this.dom = {
      cookieWrapper: document.getElementById('cookieWrapper'),
      fortuneCookie: document.getElementById('fortuneCookie'),
      paperSlip: document.getElementById('paperSlip'),
      actionArea: document.getElementById('actionArea'),
      resetCookieBtn: document.getElementById('resetCookieBtn'),
      
      fortuneCardModal: document.getElementById('fortuneCardModal'),
      closeModalBackdrop: document.getElementById('closeModalBackdrop'),
      closeCardBtn: document.getElementById('closeCardBtn'),
      cardCategoryBadge: document.getElementById('cardCategoryBadge'),
      cardDateStr: document.getElementById('cardDateStr'),
      quoteText: document.getElementById('quoteText'),
      quoteAuthor: document.getElementById('quoteAuthor'),
      luckyNumbers: document.getElementById('luckyNumbers'),
      luckyColorSwatch: document.getElementById('luckyColorSwatch'),
      luckyColorName: document.getElementById('luckyColorName'),
      luckyAdvice: document.getElementById('luckyAdvice'),
      
      copyQuoteBtn: document.getElementById('copyQuoteBtn'),
      downloadCardBtn: document.getElementById('downloadCardBtn'),
      saveFavoriteBtn: document.getElementById('saveFavoriteBtn'),
      
      bgmToggleBtn: document.getElementById('bgmToggleBtn'),
      sfxToggleBtn: document.getElementById('sfxToggleBtn'),
      themeToggleBtn: document.getElementById('themeToggleBtn'),
      historyBtn: document.getElementById('historyBtn'),
      historyBadge: document.getElementById('historyBadge'),
      
      historyModal: document.getElementById('historyModal'),
      closeHistoryBtn: document.getElementById('closeHistoryBtn'),
      closeHistoryOverlay: document.getElementById('closeHistoryOverlay'),
      historyList: document.getElementById('historyList'),
      clearHistoryBtn: document.getElementById('clearHistoryBtn'),
      
      particleCanvas: document.getElementById('particleCanvas'),
      toast: document.getElementById('toast'),
      toastMsg: document.getElementById('toastMsg')
    };
  }

  initEvents() {
    // Cookie Crack click / keypress
    this.dom.cookieWrapper.addEventListener('click', () => this.crackCookie());
    this.dom.cookieWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.crackCookie();
      }
    });

    // Reset / Draw another
    this.dom.resetCookieBtn.addEventListener('click', () => this.resetCookie());

    // Category Selector chips
    document.querySelectorAll('.cat-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        this.currentCategory = e.target.dataset.category;
      });
    });

    // Card Modal Buttons
    this.dom.closeCardBtn.addEventListener('click', () => this.hideCardModal());
    this.dom.closeModalBackdrop.addEventListener('click', () => this.hideCardModal());
    this.dom.copyQuoteBtn.addEventListener('click', () => this.handleCopyQuote());
    this.dom.downloadCardBtn.addEventListener('click', () => downloadCardCanvas(this.currentFortune));
    this.dom.saveFavoriteBtn.addEventListener('click', () => this.saveToHistory(this.currentFortune));

    // Audio & Theme Toggles
    this.dom.sfxToggleBtn.addEventListener('click', () => {
      this.sound.sfxEnabled = !this.sound.sfxEnabled;
      this.dom.sfxToggleBtn.classList.toggle('active', this.sound.sfxEnabled);
      this.showToast(this.sound.sfxEnabled ? '효과음이 켜졌습니다 🔊' : '효과음이 꺼졌습니다 🔇');
    });

    this.dom.bgmToggleBtn.addEventListener('click', () => {
      const isBgmOn = this.sound.toggleBGM();
      this.dom.bgmToggleBtn.classList.toggle('active', isBgmOn);
      this.showToast(isBgmOn ? '잔잔한 배경 음악 켜짐 🎵' : '배경 음악 꺼짐 🔇');
    });

    this.dom.themeToggleBtn.addEventListener('click', () => {
      this.currentThemeIdx = (this.currentThemeIdx + 1) % this.themes.length;
      const theme = this.themes[this.currentThemeIdx];
      document.body.setAttribute('data-theme', theme);
      this.showToast(`테마 변경: ${theme.toUpperCase()} ✨`);
    });

    // History Modal
    this.dom.historyBtn.addEventListener('click', () => this.openHistoryModal());
    this.dom.closeHistoryBtn.addEventListener('click', () => this.closeHistoryModal());
    this.dom.closeHistoryOverlay.addEventListener('click', () => this.closeHistoryModal());
    this.dom.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
  }

  // --- Crack Cookie Interaction ---
  crackCookie() {
    if (this.isCracked) {
      this.showFortuneCard(this.currentFortune);
      return;
    }

    this.isCracked = true;

    // Pick random fortune
    let pool = FORTUNE_DATABASE;
    if (this.currentCategory !== 'all') {
      pool = FORTUNE_DATABASE.filter(f => f.category === this.currentCategory);
    }
    this.currentFortune = pool[Math.floor(Math.random() * pool.length)];
    this.currentFortune.luckyNums = generateLuckyNumbers();

    // 1. Play SFX & Burst Particles
    this.sound.playCrackSound();
    const rect = this.dom.cookieWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    this.particleSys.createBurst(centerX, centerY);

    // 2. Trigger CSS Crack Transform
    this.dom.cookieWrapper.classList.add('cracked');

    // 3. Play paper unroll sound and reveal card modal
    setTimeout(() => {
      this.sound.playPaperSound();
    }, 300);

    setTimeout(() => {
      this.sound.playChimeSound();
      this.showFortuneCard(this.currentFortune);
      this.saveToHistory(this.currentFortune);
      this.dom.actionArea.classList.remove('hidden');
    }, 1200);
  }

  resetCookie() {
    this.isCracked = false;
    this.dom.cookieWrapper.classList.remove('cracked');
    this.dom.actionArea.classList.add('hidden');
    this.hideCardModal();
  }

  showFortuneCard(fortune) {
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    this.dom.cardCategoryBadge.textContent = fortune.categoryName;
    this.dom.cardDateStr.textContent = dateStr;
    this.dom.quoteText.textContent = fortune.quote;
    this.dom.quoteAuthor.textContent = `- ${fortune.author}`;

    // Render Lucky Numbers
    this.dom.luckyNumbers.innerHTML = fortune.luckyNums
      .map(num => `<span class="num-chip">${num}</span>`)
      .join('');

    // Color Swatch
    this.dom.luckyColorSwatch.style.backgroundColor = fortune.luckyColor;
    this.dom.luckyColorName.textContent = fortune.colorName;
    this.dom.luckyAdvice.textContent = fortune.advice;

    this.dom.fortuneCardModal.classList.remove('hidden');
  }

  hideCardModal() {
    this.dom.fortuneCardModal.classList.add('hidden');
  }

  async handleCopyQuote() {
    if (!this.currentFortune) return;
    const text = `🥠 [오늘의 포춘쿠키]\n"${this.currentFortune.quote}"\n- ${this.currentFortune.author}\n\n🍀 행운의 번호: ${this.currentFortune.luckyNums.join(', ')}`;
    const success = await copyToClipboard(text);
    if (success) {
      this.showToast('명언과 행운의 번호가 복사되었습니다! 📋');
    }
  }

  saveToHistory(fortune) {
    this.history = StorageManager.saveFortune(fortune, this.history);
    this.updateHistoryBadge();
  }

  updateHistoryBadge() {
    this.dom.historyBadge.textContent = this.history.length;
  }

  openHistoryModal() {
    this.renderHistoryList();
    this.dom.historyModal.classList.remove('hidden');
  }

  closeHistoryModal() {
    this.dom.historyModal.classList.add('hidden');
  }

  renderHistoryList() {
    if (this.history.length === 0) {
      this.dom.historyList.innerHTML = `
        <div style="text-align: center; color: var(--text-sub); padding: 3rem 1rem;">
          <i class="fa-solid fa-cookie" style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.5;"></i>
          <p>보관된 포춘 명언이 없습니다.<br>포춘쿠키를 깨뜨려 첫 명언을 보관해 보세요!</p>
        </div>
      `;
      return;
    }

    this.dom.historyList.innerHTML = this.history.map(item => `
      <div class="history-item">
        <span class="h-date">${item.timestamp} · ${item.categoryName}</span>
        <p class="h-quote">"${item.quote}"</p>
        <p class="h-author">- ${item.author}</p>
      </div>
    `).join('');
  }

  clearHistory() {
    if (confirm('보관함의 모든 포춘 명언을 삭제하시겠습니까?')) {
      this.history = StorageManager.clearHistory();
      this.updateHistoryBadge();
      this.renderHistoryList();
      this.showToast('보관함이 비워졌습니다.');
    }
  }

  showToast(msg) {
    this.dom.toastMsg.textContent = msg;
    this.dom.toast.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.dom.toast.classList.add('hidden');
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new FortuneApp();
});
