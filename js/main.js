// ===== WTFLinsurance Main JS =====

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
  }
});

// Toast notifications
function showToast(message, type = '') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type ? 'toast-' + type : ''}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Simple form validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(input => {
    input.style.borderColor = '';
    if (!input.value.trim()) {
      input.style.borderColor = '#ef4444';
      valid = false;
    }
    if (input.type === 'email' && input.value && !validateEmail(input.value)) {
      input.style.borderColor = '#ef4444';
      valid = false;
    }
  });
  return valid;
}

// User account system (localStorage-based for demo)
const UserAuth = {
  STORAGE_KEY: 'wtfl_users',
  SESSION_KEY: 'wtfl_session',

  getUsers() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  },

  saveUsers(users) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  },

  register(data) {
    const users = this.getUsers();
    if (users.find(u => u.email === data.email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const user = {
      id: Date.now().toString(36),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || '',
      zipCode: data.zipCode || '',
      insuranceInterests: data.insuranceInterests || [],
      password: data.password,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    this.saveUsers(users);
    this.setSession(user);
    return { success: true, user };
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    this.setSession(user);
    return { success: true, user };
  },

  setSession(user) {
    const session = { ...user };
    delete session.password;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  },

  getSession() {
    const data = localStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  isLoggedIn() {
    return !!this.getSession();
  }
};

// Update header based on auth state
document.addEventListener('DOMContentLoaded', () => {
  const actions = document.querySelector('.header-actions');
  if (!actions) return;

  if (UserAuth.isLoggedIn()) {
    const user = UserAuth.getSession();
    actions.innerHTML = `
      <span class="nav-link" style="font-weight:600;">Hi, ${user.firstName}</span>
      <a href="#" class="btn btn-outline btn-sm" id="logoutBtn">Log Out</a>
    `;
    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      UserAuth.logout();
      window.location.href = '/';
    });
  }
});

// Newsletter signup
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && validateEmail(input.value)) {
        showToast('Thanks for subscribing!', 'success');
        input.value = '';
      } else {
        showToast('Please enter a valid email.', 'error');
      }
    });
  });
});

// Knowledge base search filter
document.addEventListener('DOMContentLoaded', () => {
  const kbSearch = document.getElementById('kbSearch');
  if (kbSearch) {
    kbSearch.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.kb-category li').forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }
});

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
