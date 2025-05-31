document.addEventListener('DOMContentLoaded', function() {
    // Initialize with loading screen
    setTimeout(function() {
        document.querySelector('.loading-screen').classList.add('hidden');
        document.querySelector('.swiper-container').classList.add('loaded');
        
        // Initialize components
        initializeSwiper();
        parseURLParameters();
        setupLetterContent();
        setupVideoControls();
        setupCopyButtons();
        setupCurrentYear();
        
        // Start with muted video (to comply with autoplay policies)
        const video = document.getElementById('mainVideo');
        video.muted = true;
        attemptAutoplay(video);
    }, 1500);
});

function initializeSwiper() {
    const swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        slidesPerView: 1,
        spaceBetween: 0,
        resistance: true,
        resistanceRatio: 0.7,
        grabCursor: true,
        effect: 'creative',
        creativeEffect: {
            prev: {
                shadow: false,
                translate: ['-120%', 0, -500],
            },
            next: {
                translate: ['120%', 0, 0],
            },
        },
        speed: 800,
        touchRatio: 1,
        simulateTouch: true,
        shortSwipes: false,
        longSwipesRatio: 0.3,
        followFinger: true,
        on: {
            init: function() {
                updateSwipeHints();
            },
            slideChange: function() {
                updateSwipeHints();
                
                // Handle video when swiped to video slide
                if (this.activeIndex === 0) {
                    const video = document.getElementById('mainVideo');
                    video.play().catch(e => {
                        console.log('Video play failed:', e);
                        document.getElementById('playPauseBtn').style.display = 'flex';
                    });
                } else {
                    // Pause video when leaving video slide
                    const video = document.getElementById('mainVideo');
                    video.pause();
                }
            }
        }
    });
}

function updateSwipeHints() {
    document.querySelectorAll('.swipe-hint').forEach(hint => {
        hint.style.opacity = '0';
    });
    const activeHint = document.querySelector('.swiper-slide-active .swipe-hint');
    if (activeHint) activeHint.style.opacity = '1';
}

function attemptAutoplay(video) {
    // First try to play with sound
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            // Autoplay worked, try unmuting
            video.muted = false;
        })
        .catch(error => {
            // Autoplay with sound failed, try muted autoplay
            video.muted = true;
            video.play().catch(e => {
                console.log('Muted autoplay failed:', e);
                // Show play button if both attempts fail
                document.getElementById('playPauseBtn').style.display = 'flex';
            });
        });
    }
}

function setupVideoControls() {
    const video = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    
    if (!video) return;
    
    // Play/Pause toggle
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Mute/Unmute toggle
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    });
    
    // Update button states based on video events
    video.addEventListener('play', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
    
    video.addEventListener('pause', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    
    video.addEventListener('volumechange', () => {
        muteBtn.innerHTML = video.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    });
    
    // Fallback if video fails to load
    video.addEventListener('error', () => {
        console.error('Video loading error');
        // You could show a fallback image or message here
    });
}

function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const safeDecode = (str) => {
        if (!str) return str;
        let decoded = str;
        while (/%[0-9A-Fa-f]{2}/.test(decoded)) {
            try {
                const newDecoded = decodeURIComponent(decoded);
                if (newDecoded === decoded) break;
                decoded = newDecoded;
            } catch (e) {
                break;
            }
        }
        return decoded;
    };

    // Set sender and receiver names
    const sender = safeDecode(urlParams.get('sender')) || 'Someone Special';
    const receiver = safeDecode(urlParams.get('recipient')) || 'Dear Friend';
    
    document.getElementById('sender-name').textContent = sender;
    document.getElementById('receiver-name').textContent = receiver;
    
    // Set letter body with emoji support
    let letter = safeDecode(urlParams.get('message')) || 
        'Wishing you a blessed Eid filled with joy and prosperity!';
    
    // Wrap emojis with span for special styling
    letter = wrapEmojis(letter);
    
    // Detect language (simple detection for Bengali)
    const isBengali = /[\u0980-\u09FF]/.test(letter);
    if (isBengali) {
        document.getElementById('letter-body').lang = 'bn';
    }
    
    // Format the letter content
    letter = letter.replace(/\n/g, '<br>')
                  .replace(/ {2}/g, ' &nbsp;')
                  .replace(/\t/g, ' &nbsp;&nbsp;&nbsp;');
    
    document.getElementById('letter-body').innerHTML = letter;
    
    // Set payment options
    const bkash = urlParams.get('bkash');
    const nagad = urlParams.get('nagad');
    
    if (bkash) {
        document.getElementById('bkash-number').value = bkash;
    } else {
        document.getElementById('bkash-option').style.display = 'none';
    }
    
    if (nagad) {
        document.getElementById('nagad-number').value = nagad;
    } else {
        document.getElementById('nagad-option').style.display = 'none';
    }
    
    if (!bkash && !nagad) {
        document.querySelector('.payment-options').style.display = 'none';
    }
}

function wrapEmojis(text) {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
    return text.replace(emojiRegex, '<span class="emoji">$1</span>');
}

function setupLetterContent() {
    const letterBody = document.getElementById('letter-body');
    const readMoreBtn = document.getElementById('read-more');
    const maxLength = 900;
    
    if (letterBody.textContent.length > maxLength) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = letterBody.innerHTML;
        
        let charCount = 0;
        let truncatedHtml = '';
        let foundAllText = false;
        
        function processNodes(nodes) {
            for (const node of nodes) {
                if (foundAllText) break;
                
                if (node.nodeType === Node.TEXT_NODE) {
                    const remainingChars = maxLength - charCount;
                    if (node.textContent.length > remainingChars) {
                        truncatedHtml += node.textContent.substring(0, remainingChars);
                        charCount = maxLength;
                        foundAllText = true;
                    } else {
                        truncatedHtml += node.textContent;
                        charCount += node.textContent.length;
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const tagName = node.tagName.toLowerCase();
                    truncatedHtml += `<${tagName}>`;
                    processNodes(node.childNodes);
                    truncatedHtml += `</${tagName}>`;
                }
            }
        }
        
        processNodes(tempDiv.childNodes);
        
        const fullHtml = letterBody.innerHTML;
        letterBody.innerHTML = truncatedHtml + '...';
        readMoreBtn.style.display = 'block';
        
        readMoreBtn.addEventListener('click', function() {
            if (letterBody.innerHTML === fullHtml) {
                letterBody.innerHTML = truncatedHtml + '...';
                readMoreBtn.textContent = '...read more';
            } else {
                letterBody.innerHTML = fullHtml;
                readMoreBtn.textContent = '...read less';
            }
        });
    }
}

function setupCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const inputId = this.parentElement.querySelector('input').id;
            copyPaymentNumber(inputId);
        });
    });
    
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function(e) {
            if (!e.target.classList.contains('copy-btn')) {
                const input = this.querySelector('input');
                if (input) {
                    copyPaymentNumber(input.id);
                }
            }
        });
    });
}

function copyPaymentNumber(inputId) {
    const numberInput = document.getElementById(inputId);
    numberInput.select();
    numberInput.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(numberInput.value).then(() => {
        showCopyNotification(numberInput);
    }).catch(err => {
        console.error('Copy failed:', err);
        showCopyNotification(numberInput, true);
    });
}

function showCopyNotification(element, failed = false) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = failed ? 'Press Ctrl+C to copy' : 'Copied!';
    document.body.appendChild(notification);
    
    const rect = element.getBoundingClientRect();
    notification.style.left = `${rect.left + rect.width/2 - notification.offsetWidth/2}px`;
    notification.style.top = `${rect.top - 50}px`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 1500);
}

function setupCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}




//DOMContentLoaded

document.addEventListener('DOMContentLoaded', function () {
    const video = document.getElementById('mainVideo');
    const muteBtn = document.getElementById('muteBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');

    let userInteracted = false;

    function enableSoundPlayback() {
        if (!userInteracted) {
            userInteracted = true;
            video.muted = false;
            video.play().catch(console.error);
            playPauseBtn.style.display = 'none';
        }
    }

    // Show play button for interaction
    playPauseBtn.style.display = 'block';
    playPauseBtn.addEventListener('click', enableSoundPlayback);
    video.addEventListener('click', enableSoundPlayback);

    // Mute/unmute toggle
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted
            ? '<i class="fas fa-volume-mute"></i>'
            : '<i class="fas fa-volume-up"></i>';
    });

    // Fallback autoplay
    video.play().catch(() => {
        playPauseBtn.style.display = 'block';
    });
});
