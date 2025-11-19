// DOM Elements
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.itens-carrinho');
const totalValueSpan = document.getElementById('valor-total');
const finalizePurchaseButton = document.getElementById('finalizar-compra');

// Variável para armazenar os itens do carrinho
let cart = [];

// --- Funções de Carrinho de Compras ---

// Função para renderizar o carrinho na tela
function renderCart() {
    cartItemsContainer.innerHTML = ''; // Limpa o conteúdo atual

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        totalValueSpan.textContent = '0,00';
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {
        const itemPrice = parseFloat(item.price);
        const itemTotal = itemPrice * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.classList.add('carrinho-item');
        
        itemElement.innerHTML = `
            <div class="carrinho-item-info">
                <strong>${item.name}</strong>
                <span>${item.quantity} x R$ ${itemPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            <button class="carrinho-item-remove" data-index="${index}">Remover</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    totalValueSpan.textContent = total.toFixed(2).replace('.', ',');
}

// Função para adicionar um item ao carrinho
function addItemToCart(e) {
    const button = e.target;
    const productId = button.getAttribute('data-id');
    const productName = button.getAttribute('data-name');
    const productPrice = button.getAttribute('data-price');

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    renderCart();
    showNotification(`${productName} adicionado ao carrinho!`, 'success');
}

// Função para remover um item do carrinho
function removeItemFromCart(e) {
    if (e.target.classList.contains('carrinho-item-remove')) {
        const index = e.target.getAttribute('data-index');
        const removedItemName = cart[index].name;
        cart.splice(index, 1);
        renderCart();
        showNotification(`${removedItemName} removido do carrinho.`, 'info');
    }
}

// Função para simular a finalização da compra
function handleFinalizePurchase() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio. Adicione produtos para finalizar a compra.', 'error');
        return;
    }

    const total = totalValueSpan.textContent;
    showNotification(`Compra finalizada! Total: R$ ${total}. Obrigado por comprar conosco!`, 'success');
    
    // Limpa o carrinho após a compra
    cart = [];
    renderCart();
}

// --- Funções de Interatividade do Portfólio (Adaptadas) ---

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Smooth scrolling for navigation links
function smoothScroll(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        closeMobileMenu();
    }
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (sectionId && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Header background on scroll
function updateHeaderBackground() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
}

// Intersection Observer for animations
function createIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card'); // Apenas cartões de produto
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Project cards hover effect enhancement
function enhanceProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Notification system (mantido do portfólio)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Initialize all functionality
function init() {
    // Event listeners do Menu e Scroll
    mobileMenu.addEventListener('click', toggleMobileMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        updateHeaderBackground();
    });
    
    // Event listeners do Carrinho
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addItemToCart);
    });

    cartItemsContainer.addEventListener('click', removeItemFromCart);
    finalizePurchaseButton.addEventListener('click', handleFinalizePurchase);

    // Inicializa funcionalidades visuais
    createIntersectionObserver();
    enhanceProjectCards();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Renderiza o carrinho inicial
    renderCart();
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
