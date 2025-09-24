// Smooth scrolling for navigation links (versão corrigida)
document.querySelectorAll('.nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Carrossel de Portfólio (NOVA VERSÃO COM LÓGICA DE PÁGINAS)
document.addEventListener('DOMContentLoaded', function() {
    const portfolioData = [
        { id: 1, image: "images/1.png", title: "Convite Clássico Premium" },
        { id: 2, image: "images/2.png", title: "Design Luxo Dourado" },
        { id: 3, image: "images/3.png", title: "Acabamento Premium" },
        { id: 4, image: "images/4.png", title: "Convite Elegante" },
        { id: 5, image: "images/5.png", title: "Papelaria Premium" },
        { id: 6, image: "images/6.png", title: "Tema Formatura" },
    ];

    if (document.getElementById('portfolio')) {
        new PortfolioCarousel('portfolio', portfolioData);
    }
});

class PortfolioCarousel {
    constructor(containerId, data) {
        this.container = document.getElementById(containerId).querySelector('.container');
        if (!this.container) return;

        this.originalData = data;
        this.originalDataLength = this.originalData.length;
        this.currentItemIndex = 0;
        this.isTransitioning = false;

        this.init();
        window.addEventListener('resize', this.debounce(() => this.rebuild(), 250));
    }

    init() {
        this.itemsPerPage = this.getItemsPerPage();
        
        
        this.data = [...this.originalData, ...this.originalData, ...this.originalData];
        
        this.currentItemIndex = this.originalDataLength;

        this.render();
        this.bindEvents();
        this.updatePosition(false); 
        this.startAutoPlay();
    }
    
    rebuild() {
        this.stopAutoPlay();
        this.init();
    }

    getItemsPerPage() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    render() {
        const carouselHTML = `
            <div class="section-title">
                <h2>Confira alguns dos convites que já fizemos</h2>
            </div>
            <div class="portfolio-carousel-container" id="portfolio-viewport">
                <div class="portfolio-carousel" id="portfolioCarousel">
                    ${this.data.map((item, index) => `
                        <div class="portfolio-item" data-id="${item.id}-${index}">
                            <div class="portfolio-image">
                                <img src="${item.image}" alt="${item.title}" class="portfolio-img" loading="lazy">
                            </div>
                            <div class="portfolio-content">
                                <h3 class="portfolio-title">${item.title}</h3>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="portfolio-nav">
                    <button class="nav-btn" id="prevBtn" aria-label="Slide anterior">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"></polyline></svg>
                    </button>
                    <div class="nav-dots" id="navDots">
                        ${this.originalData.map((_, index) => `<button class="nav-dot" data-index="${index}" aria-label="Ir para slide ${index + 1}"></button>`).join('')}
                    </div>
                    <button class="nav-btn" id="nextBtn" aria-label="Próximo slide">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"></polyline></svg>
                    </button>
                </div>
            </div>`;
        this.container.innerHTML = carouselHTML;

        this.carousel = document.getElementById('portfolioCarousel');
        this.viewport = document.getElementById('portfolio-viewport');
        this.dots = this.container.querySelectorAll('.nav-dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.moveSlide('prev'));
        this.nextBtn.addEventListener('click', () => this.moveSlide('next'));
        
        this.carousel.addEventListener('transitionend', () => this.handleTransitionEnd());

        this.dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            });
        });

        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    handleTransitionEnd() {
        this.isTransitioning = false;
        // Se chegamos no bloco de clones do fim, pulamos para o item correspondente no bloco do meio.
        if (this.currentItemIndex >= this.originalDataLength * 2) {
            this.currentItemIndex -= this.originalDataLength;
            this.updatePosition(false);
        }
        // Se chegamos no bloco de clones do início, pulamos para o item correspondente no bloco do meio.
        if (this.currentItemIndex < this.originalDataLength) {
            this.currentItemIndex += this.originalDataLength;
            this.updatePosition(false);
        }
    }

    updateDots() {
        const activeDotIndex = this.currentItemIndex % this.originalDataLength;
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeDotIndex);
        });
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        this.currentItemIndex = index + this.originalDataLength;
        this.updatePosition();
        this.resetAutoPlay();
    }

    moveSlide(direction) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentItemIndex += direction === 'next' ? 1 : -1;
        this.updatePosition();
        this.resetAutoPlay();
    }

    autoAdvance() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentItemIndex++;
        this.updatePosition();
    }

    updatePosition(animate = true) {
        const itemWidth = this.viewport.offsetWidth / this.itemsPerPage;
        const shiftInPixels = this.currentItemIndex * itemWidth;

        this.carousel.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
        this.carousel.style.transform = `translateX(-${shiftInPixels}px)`;
        
        this.updateDots();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.autoAdvance(), 2500);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.cta-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário

            // 1. Defina o número de WhatsApp da sua loja aqui (somente números, com código do país e DDD)
            const numeroWhatsAppLoja = '553125518401'; // Exemplo: 55 para Brasil, 31 para DDD

            // 2. Captura os dados dos campos do formulário usando os IDs que adicionamos
            const nome = document.getElementById('form-nome').value;
            const email = document.getElementById('form-email').value;
            const whatsapp = document.getElementById('form-whatsapp').value;
            const quantidade = document.getElementById('form-quantidade').value;
            const curso = document.getElementById('form-curso').value;
            const universidade = document.getElementById('form-universidade').value;
            const data = document.getElementById('form-data').value;
            const mensagemAdicional = document.getElementById('form-mensagem').value;

            // 3. Monta a mensagem formatada para enviar no WhatsApp
            const mensagem = `Olá! Gostaria de solicitar um orçamento.

*Nome:* ${nome}
*E-mail:* ${email}
*WhatsApp:* ${whatsapp}
*Curso:* ${curso}ss
*Universidade:* ${universidade}
*Quantidade Estimada:* ${quantidade}
*Data da Formatura:* ${data || 'Não informada'}

*Mensagem Adicional:*
${mensagemAdicional || 'Nenhuma'}
`;

            // 4. Codifica a mensagem para ser usada em uma URL e cria o link final
            const mensagemCodificada = encodeURIComponent(mensagem);
            const urlWhatsApp = `https://wa.me/${numeroWhatsAppLoja}?text=${mensagemCodificada}`;

            // 5. Abre a conversa do WhatsApp em uma nova janela
            window.open(urlWhatsApp, '_blank');
            
            // Opcional: Limpa o formulário após o envio
            form.reset();
        });
    }
});




document.addEventListener('DOMContentLoaded', function() {
    const whatsappBtn = document.getElementById('whatsapp-float-btn');
    if (whatsappBtn) {
        const numeroWhatsApp = '553125518401';
        const mensagemPadrao = 'Olá! Gostaria de mais informações sobre os convites de formatura.';

        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagemPadrao)}`;

        whatsappBtn.setAttribute('href', url);
    }
});