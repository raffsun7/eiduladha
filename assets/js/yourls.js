document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    const section3 = document.getElementById('section3');
    const nextToDesignBtn = document.getElementById('next-to-design');
    const backToDetailsBtn = document.getElementById('back-to-details');
    const generateCardBtn = document.getElementById('generate-card');
    const createAnotherBtn = document.getElementById('create-another');
    const previewCardBtn = document.getElementById('preview-card');
    const copyLinkBtn = document.getElementById('copy-link');
    const generatedLink = document.getElementById('generated-link');
    const progressSteps = document.querySelectorAll('.progress-step');
    const styleOptions = document.querySelectorAll('.style-option');
    const toggleBkash = document.getElementById('toggle-bkash');
    const toggleNagad = document.getElementById('toggle-nagad');
    const bkashContainer = document.getElementById('bkash-container');
    const nagadContainer = document.getElementById('nagad-container');
    const whatsappBtn = document.querySelector('.share-btn.whatsapp');
    const messengerBtn = document.querySelector('.share-btn.messenger');
    const telegramBtn = document.querySelector('.share-btn.telegram');
    const genericBtn = document.querySelector('.share-btn.generic');
    
    // Form data
    let formData = {
        senderName: '',
        recipientName: '',
        message: '',
        layout: 'modern',
        bkashNumber: '',
        nagadNumber: ''
    };
    
    // Initialize
    updateProgressBar(1);
    initToggleStates(); // Initialize toggle states

    // Event Listeners
    nextToDesignBtn.addEventListener('click', function() {
        if (validateSection1()) {
            collectSection1Data();
            showSection(2);
            updateProgressBar(2);
        }
    });
    
    backToDetailsBtn.addEventListener('click', function() {
        showSection(1);
        updateProgressBar(1);
    });
    
    generateCardBtn.addEventListener('click', function() {
        collectSection2Data();
        generateEidCard();
    });
    
    createAnotherBtn.addEventListener('click', function() {
        resetForm();
        showSection(1);
        updateProgressBar(1);
    });
    
    copyLinkBtn.addEventListener('click', function() {
        copyToClipboard(generatedLink.value);
        showToast('Link copied to clipboard!');
    });
    
    // Fixed toggle functionality with proper event listeners
    toggleBkash.addEventListener('change', function() {
        bkashContainer.classList.toggle('hidden', !this.checked);
        if (!this.checked) {
            document.getElementById('bkash-number').value = '';
        }
    });
    
    toggleNagad.addEventListener('change', function() {
        nagadContainer.classList.toggle('hidden', !this.checked);
        if (!this.checked) {
            document.getElementById('nagad-number').value = '';
        }
    });
    
    // Share buttons functionality
    whatsappBtn.addEventListener('click', shareViaWhatsApp);
    messengerBtn.addEventListener('click', shareViaMessenger);
    telegramBtn.addEventListener('click', shareViaTelegram);
    genericBtn.addEventListener('click', shareViaBrowser);

    styleOptions.forEach(option => {
        option.addEventListener('click', function() {
            styleOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            formData.layout = this.dataset.style;
        });
    });
    
    // Functions
    function initToggleStates() {
        // Set initial state of toggles and containers
        bkashContainer.classList.toggle('hidden', !toggleBkash.checked);
        nagadContainer.classList.toggle('hidden', !toggleNagad.checked);
    }

    function validateSection1() {
        const senderName = document.getElementById('sender-name').value.trim();
        const recipientName = document.getElementById('recipient-name').value.trim();
        const message = document.getElementById('personal-message').value.trim();
        
        if (!senderName || !recipientName || !message) {
            showToast('Please fill in all required fields');
            return false;
        }
        
        if (message.length > 600) {
            showToast('Message should be less than 600 characters');
            return false;
        }
        
        return true;
    }
    
    function collectSection1Data() {
        formData.senderName = document.getElementById('sender-name').value.trim();
        formData.recipientName = document.getElementById('recipient-name').value.trim();
        formData.message = document.getElementById('personal-message').value.trim();
    }
    
    function collectSection2Data() {
        formData.bkashNumber = document.getElementById('bkash-number').value.trim();
        formData.nagadNumber = document.getElementById('nagad-number').value.trim();
    }
    
    function showSection(sectionNumber) {
        section1.classList.remove('active-section');
        section2.classList.remove('active-section');
        section3.classList.remove('active-section');
        
        if (sectionNumber === 1) {
            section1.classList.add('active-section');
        } else if (sectionNumber === 2) {
            section2.classList.add('active-section');
        } else if (sectionNumber === 3) {
            section3.classList.add('active-section');
        }
    }
    
    function updateProgressBar(activeStep) {
        progressSteps.forEach(step => {
            if (parseInt(step.dataset.step) <= activeStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    function generateEidCard() {
        // Build the long URL
        let params = new URLSearchParams();
        params.append('sender', encodeURIComponent(formData.senderName));
        params.append('receiver', encodeURIComponent(formData.recipientName));
        params.append('message', encodeURIComponent(formData.message));
        
        if (formData.bkashNumber) {
            params.append('bkash', formData.bkashNumber);
        }
        
        if (formData.nagadNumber) {
            params.append('nagad', formData.nagadNumber);
        }
        
        const longUrl = `http://eidcard.link/${formData.layout}/?${params.toString()}`;
        
        generatedLink.value = longUrl;
        previewCardBtn.href = longUrl;
        
        // Show celebration effects
        showCelebration();
        showSection(3);
        updateProgressBar(3);
    }
    
    function showCelebration() {
        // Create confetti
        for (let i = 0; i < 50; i++) {
            createConfetti();
        }
    }
    
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random position
        const left = Math.random() * 100;
        confetti.style.left = `${left}%`;
        
        // Random color
        const colors = ['#F6C90E', '#FAD2E1', '#A3D8F4', '#6247AA'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = randomColor;
        
        // Random size
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Random animation duration
        const duration = Math.random() * 3 + 2;
        confetti.style.animationDuration = `${duration}s`;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
    
    function resetForm() {
        document.getElementById('details-form').reset();
        document.getElementById('bkash-number').value = '';
        document.getElementById('nagad-number').value = '';
        toggleBkash.checked = false;
        toggleNagad.checked = false;
        bkashContainer.classList.add('hidden');
        nagadContainer.classList.add('hidden');
        styleOptions[0].classList.add('active');
        formData = {
            senderName: '',
            recipientName: '',
            message: '',
            layout: 'modern',
            bkashNumber: '',
            nagadNumber: ''
        };
    }
    
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Share functions
    function shareViaWhatsApp() {
        const text = `Eid Mubarak! Check out this personalized Eid card for you: ${generatedLink.value}`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
    
    function shareViaMessenger() {
        // Fallback solution since proper Messenger sharing requires app_id
        const text = `Eid Mubarak! Check out this personalized Eid card for you: ${generatedLink.value}`;
        const url = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(generatedLink.value)}&redirect_uri=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank');
    }
    
    function shareViaTelegram() {
        const text = `Eid Mubarak! Check out this personalized Eid card for you: ${generatedLink.value}`;
        const url = `https://t.me/share/url?url=${encodeURIComponent(generatedLink.value)}&text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    }
    
    function shareViaBrowser() {
        if (navigator.share) {
            navigator.share({
                title: 'Eid Mubarak Greeting',
                text: 'Someone sent you a personalized Eid card!',
                url: generatedLink.value
            }).catch(err => {
                console.log('Error using native share:', err);
                // Fallback to copying the link
                copyToClipboard(generatedLink.value);
                showToast('Link copied to clipboard!');
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            copyToClipboard(generatedLink.value);
            showToast('Link copied to clipboard!');
        }
    }
});