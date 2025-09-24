// Smooth scrolling for navigation links 
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


document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.portfolio-swiper')) {
        const swiper = new Swiper('.portfolio-swiper', {
            loop: true,
            centeredSlides: true,

            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },

            slidesPerView: 1,
            spaceBetween: 10,
            
           
            grabCursor: true,

            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    
                   
                    simulateTouch: false, 
                    grabCursor: false,    
                }
            },

            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },

            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }
});

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