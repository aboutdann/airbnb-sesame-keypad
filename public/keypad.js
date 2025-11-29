class KeypadApp {
  constructor() {
    this.buffer = '';
    this.adminToken = null;
    this.initElements();
    this.buildKeypad();
    this.bindEvents();
  }

  initElements() {
    this.display = document.getElementById('display');
    this.statusEl = document.getElementById('status');
    this.keypadEl = document.getElementById('keypad');
    this.adminPanel = document.getElementById('admin-panel');
    
    this.refreshBtn = document.getElementById('refresh-pins');
    this.pinsList = document.getElementById('pins-list');
    this.createBtn = document.getElementById('create-pin');
    
    this.inputs = {
      code: document.getElementById('new-code'),
      type: document.getElementById('new-type'),
      start: document.getElementById('new-start'),
      end: document.getElementById('new-end'),
      label: document.getElementById('new-label'),
      phone: document.getElementById('new-phone')
    };
  }

  setStatus(msg, success = false) {
    this.statusEl.textContent = msg || '';
    this.statusEl.style.color = success ? '#4ade80' : '#ef4444';
  }

  renderDisplay() {
    const masked = this.buffer.replace(/./g, '●');
    this.display.textContent = masked || 'Enter PIN';
    this.display.style.borderColor = this.buffer ? '#4ade80' : 'rgba(74,222,128,0.3)';
  }

  appendDigit(digit) {
    if (this.buffer.length >= 8) return;
    this.buffer += digit;
    this.renderDisplay();
  }

  async submitCode() {
    if (!this.buffer) return;

    try {
      this.setStatus('Checking...', false);
      
      const res = await fetch('/api/check-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: this.buffer })
      });
      
      const data = await res.json();
      
      if (!data.ok) {
        this.setStatus(data.error || 'Invalid PIN', false);
        return;
      }
      
      if (data.mode === 'admin') {
        this.adminToken = this.buffer;
        this.setStatus('✅ Admin mode unlocked', true);
        this.adminPanel.classList.remove('hidden');
        await this.loadPins();
      } else {
        this.setStatus('✅ Door unlocked!', true);
        setTimeout(() => this.clearBuffer(), 3000);
      }
    } catch (e) {
      console.error(e);
      this.setStatus('❌ Network error', false);
    } finally {
      this.renderDisplay();
    }
  }

  clearBuffer() {
    this.buffer = '';
    this.renderDisplay();
    this.setStatus('', false);
  }

  buildKeypad() {
    const keys = ['1','2','3','4','5','6','7','8','9','⌫','0','✓'];
    
    keys.forEach(key => {
      const btn = document.createElement('button');
      btn.textContent = key;
      
      if (key === '⌫') {
        btn.onclick = () => this.clearBuffer();
      } else if (key === '✓') {
        btn.onclick = () => this.submitCode();
      } else {
        btn.onclick = () => this.appendDigit(key);
      }
      
      this.keypadEl.appendChild(btn);
    });
  }

  async loadPins() {
    if (!this.adminToken) return;
    
    try {
      const res = await fetch('/api/admin/pins', {
        headers: { 'x-admin-token': this.adminToken }
      });
      
      const data = await res.json();
      this.renderPins(data.pins || []);
    } catch (e) {
      this.pinsList.innerHTML = '<div style="color:#ef4444">Error loading pins</div>';
    }
  }

  renderPins(pins) {
    this.pinsList.innerHTML = pins.map(pin => `
      <div class="pin-item">
        <span>${pin.id}: ${pin.code} 
          <small style="opacity:0.7">(${pin.type}) ${pin.label || ''}</small>
        </span>
        <button class="pin-delete" onclick="app.deletePin(${pin.id})">🗑️</button>
      </div>
    `).join('') || '<div style="opacity:0.5">No pins</div>';
  }

  async deletePin(id) {
    if (!this.adminToken) return;
    
    try {
      await fetch(`/api/admin/pins/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': this.adminToken }
      });
      await this.loadPins();
    } catch (e) {
      console.error('Delete error:', e);
    }
  }

  async createPin() {
    if (!this.adminToken) return;

    const pinData = {
      code: this.inputs.code.value || '',
      type: this.inputs.type.value,
      starts_at: this.inputs.start.value ? new Date(this.inputs.start.value).getTime() : null,
      ends_at: this.inputs.end.value ? new Date(this.inputs.end.value).getTime() : null,
      label: this.inputs.label.value,
      phone: this.inputs.phone.value
    };

    try {
      const res = await fetch('/api/admin/pins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': this.adminToken
        },
        body: JSON.stringify(pinData)
      });
      
      const data = await res.json();
      if (data.ok) {
        this.setStatus('✅ PIN created!', true);
        this.inputs.code.value = '';
        this.inputs.label.value = '';
        this.inputs.phone.value = '';
        await this.loadPins();
      } else {
        this.setStatus(data.error || 'Create failed', false);
      }
    } catch (e) {
      this.setStatus('Network error', false);
    }
  }

  bindEvents() {
    this.refreshBtn.onclick = () => this.loadPins();
    this.createBtn.onclick = () => this.createPin();
    
    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key >= '0' && e.key <= '9') {
        this.appendDigit(e.key);
      } else if (e.key === 'Enter' || e.key === ' ') {
        this.submitCode();
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        this.clearBuffer();
      }
    });
  }
}

// Global app instance
const app = new KeypadApp();

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  deferredPrompt = e;
  // Could show install button
});
