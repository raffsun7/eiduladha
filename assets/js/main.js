document.addEventListener('DOMContentLoaded', function() {
    // Loading animation
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 3000);

    // DOM elements
    const detailsForm = document.getElementById('detailsForm');
    const nextToDesignBtn = document.getElementById('nextToDesign');
    const backToDetailsBtn = document.getElementById('backToDetails');
    const generateCardBtn = document.getElementById('generateCard');
    const createAnotherBtn = document.getElementById('createAnotherBtn');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const generatedLink = document.getElementById('generatedLink');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const copyFeedback = document.querySelector('.copy-feedback');
    const nativeShareBtn = document.getElementById('nativeShareBtn');
    const cardPreview = document.getElementById('cardPreview');
    const confettiCanvas = document.getElementById('confetti-canvas');
    
    // Card data
    let cardData = {
        sender: '',
        recipient: '',
        message: '',
        style: 'random',
        bkash: '',
        nagad: ''
    };

    // Initialize
    init();

    function init() {
        setupEventListeners();
    }

    function setupEventListeners() {
        messageTextarea.addEventListener('input', updateCharCount);
        nextToDesignBtn.addEventListener('click', goToDesign);
        backToDetailsBtn.addEventListener('click', goBackToDetails);
        generateCardBtn.addEventListener('click', generateCard);
        createAnotherBtn.addEventListener('click', resetForm);
        
        document.querySelectorAll('.style-option').forEach(option => {
            option.addEventListener('click', selectCardStyle);
        });
        
        copyLinkBtn.addEventListener('click', copyLinkToClipboard);
        document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
            btn.addEventListener('click', shareOnPlatform);
        });
        
        if (navigator.share) {
            nativeShareBtn.addEventListener('click', nativeShare);
        } else {
            nativeShareBtn.style.display = 'none';
        }
    }

    // YOURLS URL Shortener
    async function shortenWithYourls(longUrl) {
        const yourlsApi = 'https://adha.letter-box.xyz/url/yourls-api.php';
        const signature = 'f46dcd4268'; // Your YOURLS API key
        
        try {
            const response = await fetch(`${yourlsApi}?signature=${signature}&action=shorturl&url=${encodeURIComponent(longUrl)}&format=json`);
            const data = await response.json();
            return data.status === 'success' ? data.shorturl : longUrl;
        } catch (error) {
            console.error('URL shortening failed:', error);
            return longUrl;
        }
    }

    function updateCharCount() {
        charCount.textContent = this.value.length;
    }

    function goToDesign() {
        if (validateSection1()) {
            cardData.sender = document.getElementById('senderName').value.trim();
            cardData.recipient = document.getElementById('recipientName').value.trim();
            cardData.message = document.getElementById('message').value;
            transitionToSection('section2');
            updateProgress(66, 'Step 2 of 3');
        }
    }

    function goBackToDetails() {
        transitionToSection('section1');
        updateProgress(33, 'Step 1 of 3');
    }

    function generateCard() {
        if (validateSection2()) {
            cardData.bkash = document.getElementById('bkashNumber').value.trim();
            cardData.nagad = document.getElementById('nagadNumber').value.trim();
            transitionToSection('section3');
            updateProgress(100, 'Step 3 of 3');
            generateCardPreview();
            generateShareLink();
            triggerCelebrations();
        }
    }

    function selectCardStyle() {
        document.querySelectorAll('.style-option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        cardData.style = this.dataset.style;
        this.classList.add('card-flip');
        setTimeout(() => this.classList.remove('card-flip'), 1000);
    }

    function generateCardPreview() {
        cardPreview.className = 'card-preview';
        cardPreview.innerHTML = '';
        
        const style = cardData.style === 'random' 
            ? ['classic', 'modern', 'islamic', 'fun', 'elegant', 'simple'][Math.floor(Math.random() * 6)]
            : cardData.style;
        
        cardPreview.classList.add(style);
        cardData.style = style;

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        cardContent.innerHTML = `
            <div class="card-header"><h3>Eid Mubarak!</h3></div>
            <div class="card-recipient"><p>Dear <strong>${escapeHtml(cardData.recipient)}</strong>,</p></div>
            <div class="card-message"><p>${escapeHtml(cardData.message).replace(/\r?\n/g, '<br>').replace(/ {2}/g, ' &nbsp;')}</p></div>
            <div class="card-sender"><p>Yours <strong>${escapeHtml(cardData.sender)}</strong></p></div>
            ${cardData.bkash || cardData.nagad ? `
            <div class="card-payment">
                <h4>Eidi/Salami:</h4>
                ${cardData.bkash ? `<p>bKash: ${formatPhoneNumber(cardData.bkash)}</p>` : ''}
                ${cardData.nagad ? `<p>Nagad: ${formatPhoneNumber(cardData.nagad)}</p>` : ''}
            </div>` : ''}
            <div class="card-decorations">
                <div class="moon">🌙</div>
                <div class="lantern">🦋</div>
                <div class="stars">${'⭐'.repeat(5)}</div>
            </div>
        `;
        cardPreview.appendChild(cardContent);
    }

    async function generateShareLink() {
        const baseUrl = window.location.href.split('?')[0];
        const params = new URLSearchParams();
        params.append('sender', encodeURIComponent(cardData.sender));
        params.append('recipient', encodeURIComponent(cardData.recipient));
        params.append('message', encodeURIComponent(cardData.message.replace(/\r?\n/g, '\n')));
        if (cardData.bkash) params.append('bkash', cardData.bkash);
        if (cardData.nagad) params.append('nagad', cardData.nagad);

        const longUrl = `${baseUrl.replace(/\/$/, '')}/pages/${cardData.style}/?${params.toString()}`;
        generatedLink.value = "Generating short link...";
        
        try {
            generatedLink.value = await shortenWithYourls(longUrl);
        } catch (error) {
            generatedLink.value = longUrl;
            console.error("URL shortening failed:", error);
        }
        
        document.querySelectorAll('.share-btn').forEach(btn => btn.disabled = false);
    }

    function triggerCelebrations() {
        launchConfetti();
        document.querySelector('.success-animation').classList.add('animate');
    }

    function launchConfetti() {
        const canvas = confettiCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const colors = ['#F6C90E', '#FAD2E1', '#D8F3DC', '#A3D8F4', '#FFFFFF'];
        
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 5
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation * Math.PI / 180);
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                Math.random() > 0.5 
                    ? ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2)
                    : drawStar(ctx, 0, 0, particle.size / 2, particle.size, 5);
                ctx.fill();
                ctx.restore();
                particle.y += particle.speed;
                particle.rotation += particle.rotationSpeed;
                if (particle.y > canvas.height) {
                    particle.y = -particle.size;
                    particle.x = Math.random() * canvas.width;
                }
            });
            requestAnimationFrame(animate);
        }
        
        animate();
        setTimeout(() => {
            canvas.style.opacity = '0';
            setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 1000);
        }, 5000);
    }

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;
            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
    }

    function copyLinkToClipboard() {
        generatedLink.select();
        document.execCommand('copy');
        copyFeedback.classList.add('show');
        setTimeout(() => copyFeedback.classList.remove('show'), 2000);
    }

    function shareOnPlatform() {
        const platform = this.dataset.platform;
        const url = encodeURIComponent(generatedLink.value);
        const text = encodeURIComponent(`Eid Mubarak ${cardData.recipient}!`);
        let shareUrl = '';
        switch (platform) {
            case 'whatsapp': shareUrl = `https://wa.me/?text=${text} ${url}`; break;
            case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
            case 'telegram': shareUrl = `https://t.me/share/url?url=${url}&text=${text}`; break;
        }
        window.open(shareUrl, '_blank');
    }

    function nativeShare() {
        navigator.share({
            title: 'Eid Card',
            text: `For ${cardData.recipient}`,
            url: generatedLink.value
        }).catch(console.error);
    }

    function resetForm() {
        document.getElementById('senderName').value = '';
        document.getElementById('recipientName').value = '';
        document.getElementById('message').value = '';
        document.getElementById('bkashNumber').value = '';
        document.getElementById('nagadNumber').value = '';
        cardData = { sender: '', recipient: '', message: '', style: 'classic', bkash: '', nagad: '' };
        document.querySelectorAll('.style-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelector('.style-option[data-style="classic"]').classList.add('selected');
        charCount.textContent = '0';
        generatedLink.value = '';
        confettiCanvas.style.opacity = '1';
        transitionToSection('section1');
        updateProgress(33, 'Step 1 of 3');
    }

    function validateSection1() {
        let isValid = true;
        const inputs = detailsForm.querySelectorAll('input[required], textarea[required]');
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.parentElement.classList.add('error');
                isValid = false;
            } else {
                input.parentElement.classList.remove('error');
            }
        });
        if (!isValid) {
            detailsForm.classList.add('shake');
            setTimeout(() => detailsForm.classList.remove('shake'), 500);
        }
        return isValid;
    }

    function validateSection2() {
        const bkashNumber = document.getElementById('bkashNumber').value;
        const nagadNumber = document.getElementById('nagadNumber').value;
        if (bkashNumber && !/^\d{11}$/.test(bkashNumber)) {
            showError(document.getElementById('bkashNumber'), 'Please enter a valid 11-digit bKash number');
            return false;
        }
        if (nagadNumber && !/^\d{11}$/.test(nagadNumber)) {
            showError(document.getElementById('nagadNumber'), 'Please enter a valid 11-digit Nagad number');
            return false;
        }
        return true;
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        if (!formGroup.querySelector('.error-message')) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#ff4757';
            errorElement.style.fontSize = '0.8rem';
            errorElement.style.marginTop = '0.5rem';
            formGroup.appendChild(errorElement);
        }
        formGroup.querySelector('.error-message').textContent = message;
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function transitionToSection(sectionId) {
        document.querySelectorAll('.card-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    }

    function updateProgress(percent, label) {
        document.querySelector('.progress-bar').style.width = `${percent}%`;
        document.querySelector('.progress-label').textContent = label;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatPhoneNumber(number) {
        return number.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
    }
});