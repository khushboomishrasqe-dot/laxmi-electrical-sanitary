/* ==========================================================================
   Laxmi Electrical & Sanitary - Interactive Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- State Initialization ---
  let cart = [];
  const WHATSAPP_NUMBER = '919848022338'; // Target business number (Telangana country code + number)
  
  // --- DOM Elements ---
  const body = document.body;
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-links a');
  
  const cartIconBtn = document.getElementById('cart-icon-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartBadge = document.getElementById('cart-badge');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartCheckoutForm = document.getElementById('cart-checkout-form');
  
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productGrids = document.querySelectorAll('.products-grid');
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  
  const faqItems = document.querySelectorAll('.faq-item');
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  const shopStatusContainer = document.getElementById('shop-status');
  
  const quoteForm = document.getElementById('quote-form');

  /* ==========================================================================
     1. Theme Toggle Logic (Light / Dark Mode)
     ========================================================================== */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }
  };
  
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Smooth transition pop effect for theme button
    themeToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
      themeToggle.style.transform = 'scale(1)';
    }, 150);
  });
  
  initTheme();

  /* ==========================================================================
     2. Mobile Responsive Menu
     ========================================================================== */
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Change menu icon between burger and close
    const icon = menuToggle.querySelector('svg');
    if (navLinks.classList.contains('active')) {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
    } else {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
    }
  });

  // Close mobile menu when a nav link is clicked
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = menuToggle.querySelector('svg');
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
      
      // Update active nav class
      navLinkItems.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  /* ==========================================================================
     3. Active Navigation Highlighting on Scroll
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120; // offset

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
          link.classList.add('active');
        }
      });
    }
  });

  /* ==========================================================================
     4. Dynamic Business Hours & Shop Status
     ========================================================================== */
  const checkShopStatus = () => {
    const now = new Date();
    // Adjusting to Indian Standard Time (IST) if client system is in different timezone
    // Using UTC offsets to compute exact local time in Hyderabad
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffset = 5.5; // IST is UTC + 5:30
    const localTime = new Date(utc + (3600000 * istOffset));
    
    const day = localTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hours = localTime.getHours();
    const minutes = localTime.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    
    // Store Hours: Monday to Saturday, 9:00 AM to 8:30 PM (20:30)
    const openTime = 9 * 60; // 9:00 AM -> 540 minutes
    const closeTime = 20 * 60 + 30; // 8:30 PM -> 1230 minutes
    
    if (!shopStatusContainer) return;
    
    if (day === 0) {
      // Sunday Closed
      shopStatusContainer.innerHTML = `
        <span class="status-badge closed">
          <span class="status-dot"></span>Closed Now (Opens Monday 9:00 AM)
        </span>
      `;
    } else if (currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime) {
      // Open
      shopStatusContainer.innerHTML = `
        <span class="status-badge open">
          <span class="status-dot"></span>Open Now (Closes at 8:30 PM)
        </span>
      `;
    } else {
      // Closed on weekdays outside hours
      const nextOpenText = (day === 6) ? 'Monday 9:00 AM' : 'Tomorrow 9:00 AM';
      shopStatusContainer.innerHTML = `
        <span class="status-badge closed">
          <span class="status-dot"></span>Closed Now (Opens ${nextOpenText})
        </span>
      `;
    }
  };
  
  checkShopStatus();
  // Refresh status check every minute
  setInterval(checkShopStatus, 60000);

  /* ==========================================================================
     5. Category Tab Switching
     ========================================================================== */
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetCategory = button.getAttribute('data-category');
      
      // Update active tab buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active product grids
      productGrids.forEach(grid => {
        if (grid.id === `${targetCategory}-grid`) {
          grid.classList.add('active');
        } else {
          grid.classList.remove('active');
        }
      });
    });
  });

  /* ==========================================================================
     6. Enquiry Cart Logic (State, UI, & Add/Remove/Qty)
     ========================================================================== */
  const toggleCartDrawer = () => {
    cartDrawerOverlay.classList.toggle('open');
  };
  
  cartIconBtn.addEventListener('click', toggleCartDrawer);
  cartCloseBtn.addEventListener('click', toggleCartDrawer);
  cartDrawerOverlay.addEventListener('click', (e) => {
    if (e.target === cartDrawerOverlay) toggleCartDrawer();
  });

  const updateCartBadge = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    if (totalItems > 0) {
      cartBadge.classList.add('has-items');
      // Bounce effect on change
      cartBadge.style.transform = 'scale(1.2)';
      setTimeout(() => {
        cartBadge.style.transform = 'scale(1)';
      }, 200);
    } else {
      cartBadge.classList.remove('has-items');
    }
  };

  const showToast = (message) => {
    // Create temporary toast notification
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.backgroundColor = 'var(--primary)';
    toast.style.color = 'var(--text-white)';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.zIndex = '2000';
    toast.style.fontSize = '0.95rem';
    toast.style.fontWeight = '600';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    
    // Add WhatsApp icon svg in toast if suitable, or check icon
    toast.innerHTML = `
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
      <span>${message}</span>
    `;
    
    body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 50);
    
    // Remove toast
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  const renderCart = () => {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
          <p style="font-weight:600; font-size:1.1rem; color:var(--text-main);">Your quote list is empty</p>
          <p style="font-size:0.875rem;">Select from our premium items to get custom wholesale rates.</p>
        </div>
      `;
      cartCheckoutForm.style.display = 'none';
      return;
    }

    cartCheckoutForm.style.display = 'flex';
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p style="color: var(--secondary); font-weight: 600; font-size:0.8rem; text-transform: uppercase;">${item.category}</p>
          <div class="cart-item-qty">
            <button class="qty-btn dec-qty" data-id="${item.id}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn inc-qty" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-remove" data-id="${item.id}">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    // Qty Adjustments event bindings
    document.querySelectorAll('.dec-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          cart = cart.filter(i => i.id !== id);
        }
        renderCart();
        updateCartBadge();
      });
    });

    document.querySelectorAll('.inc-qty').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = cart.find(i => i.id === id);
        item.quantity += 1;
        renderCart();
        updateCartBadge();
      });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        cart = cart.filter(i => i.id !== id);
        renderCart();
        updateCartBadge();
        showToast('Item removed from quote list.');
      });
    });
  };

  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        quantity: 1
      });
    }
    renderCart();
    updateCartBadge();
    showToast(`"${product.name}" added to quote list!`);
  };

  // Wire product card "Add to Quote" buttons
  document.querySelectorAll('.add-to-enquiry').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const product = {
        id: card.getAttribute('data-id'),
        name: card.querySelector('h3').textContent,
        category: card.getAttribute('data-category')
      };
      
      // Pop scale effect on product card
      card.style.transform = 'scale(0.98) translateY(-4px)';
      setTimeout(() => {
        card.style.transform = 'translateY(-6px)';
      }, 150);

      addToCart(product);
    });
  });

  /* ==========================================================================
     7. WhatsApp Quote Compilation & Redirection
     ========================================================================== */
  cartCheckoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('checkout-name').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const msg = document.getElementById('checkout-msg').value.trim();

    if (!name || !phone) {
      alert('Please enter your Name and Phone Number to request a quote.');
      return;
    }

    // Build the message
    let messageText = `*Wholesale Enquiry - Laxmi Electrical & Sanitary*%0A%0A`;
    messageText += `*Customer Details:*%0A`;
    messageText += `• *Name:* ${name}%0A`;
    messageText += `• *Phone:* ${phone}%0A`;
    if (msg) messageText += `• *Note:* ${msg}%0A`;
    messageText += `%0A*Items Requested:*%0A`;

    cart.forEach((item, index) => {
      messageText += `${index + 1}. *${item.name}* (Category: ${item.category}) - *Qty: ${item.quantity}*%0A`;
    });

    messageText += `%0APlease share your best wholesale prices, availability, and delivery options for Hyderabad. Thank you!`;

    // Construct WhatsApp Link
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${messageText}`;

    // Clear cart and close drawer
    cart = [];
    renderCart();
    updateCartBadge();
    toggleCartDrawer();

    // Redirect to WhatsApp
    window.open(waUrl, '_blank');
  });

  /* ==========================================================================
     8. Main Enquiry Form (Traditional Form Submission)
     ========================================================================== */
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('quote-name').value.trim();
      const phone = document.getElementById('quote-phone').value.trim();
      const requirements = document.getElementById('quote-requirement').value;
      const notes = document.getElementById('quote-message').value.trim();

      if (!name || !phone) {
        alert('Please enter your name and phone number.');
        return;
      }

      // Traditional checkout compiles cart if cart has items, otherwise raw form
      let messageText = `*Wholesale Price Enquiry - Laxmi Electrical & Sanitary*%0A%0A`;
      messageText += `*Customer Details:*%0A`;
      messageText += `• *Name:* ${name}%0A`;
      messageText += `• *Phone:* ${phone}%0A`;
      messageText += `• *Requirement:* ${requirements}%0A`;
      if (notes) messageText += `• *Message:* ${notes}%0A`;
      
      messageText += `%0APlease share your wholesale catalogue and prices.`;

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${messageText}`;
      
      quoteForm.reset();
      showToast('Enquiry request prepared! Redirecting to WhatsApp...');
      
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1000);
    });
  }

  /* ==========================================================================
     9. Interactive Image Gallery Lightbox
     ========================================================================== */
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const captionText = item.querySelector('.gallery-overlay h4').textContent;
      const categoryText = item.querySelector('.gallery-overlay p').textContent;
      
      lightboxImage.src = img.src;
      lightboxCaption.textContent = `${captionText} (${categoryText})`;
      lightboxModal.classList.add('open');
    });
  });

  const closeLightbox = () => {
    lightboxModal.classList.remove('open');
    // Clear src to prevent flash of old image next time
    setTimeout(() => {
      lightboxImage.src = '';
    }, 250);
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });
  
  // Close on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });

  /* ==========================================================================
     10. Toggle FAQs Accordion
     ========================================================================== */
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all open FAQs
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     11. Scroll To Top Button
     ========================================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Initial renders
  renderCart();
});
