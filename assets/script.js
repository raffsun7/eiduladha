document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    setTimeout(function() {
        document.querySelector('.loading-screen').classList.add('hidden');
        document.querySelector('.swiper-container').classList.add('loaded');
        initializeSwiper();
        parseURLParameters();
        setupLetterContent();
        setupVideoControls();
        setupCopyButtons();
        setupRippleEffects();
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
                document.querySelectorAll('.swipe-hint').forEach(hint => {
                    hint.style.opacity = '0';
                });
                document.querySelector('.swiper-slide-active .swipe-hint').style.opacity = '1';
            },
            slideChange: function() {
                document.querySelectorAll('.swipe-hint').forEach(hint => {
                    hint.style.opacity = '0';
                });
                document.querySelector('.swiper-slide-active .swipe-hint').style.opacity = '1';
            }
        }
    });
}

function parseURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Function to safely decode multiple levels of encoding
    const safeDecode = (str) => {
        if (!str) return str;
        let decoded = str;
        // Keep decoding until there are no more encoded characters
        while (/%[0-9A-Fa-f]{2}/.test(decoded)) {
            try {
                const newDecoded = decodeURIComponent(decoded);
                if (newDecoded === decoded) break; // No change after decoding
                decoded = newDecoded;
            } catch (e) {
                break; // Stop if decoding fails
            }
        }
        return decoded;
    };

    // Set sender and receiver names with proper decoding
    const sender = safeDecode(urlParams.get('sender')) || 'Sender';
    const receiver = safeDecode(urlParams.get('recipient')) || 'Friend';
    
    document.getElementById('sender-name').textContent = sender;
    document.getElementById('receiver-name').textContent = receiver;
    
    // Set letter body with proper decoding
    let letter = safeDecode(urlParams.get('message')) || 'Wishing you a blessed Eid filled with joy and prosperity!';
    
    // Wrap emojis with span for special styling
    letter = wrapEmojis(letter);
    
    // Detect language (simple detection for Bengali)
    const isBengali = /[\u0980-\u09FF]/.test(letter);
    if (isBengali) {
        document.getElementById('letter-body').lang = 'bn';
    }
    
    // Replace newlines with <br> tags and preserve multiple spaces
    letter = letter.replace(/\n/g, '<br>')
                  .replace(/ {2}/g, ' &nbsp;')
                  .replace(/\t/g, ' &nbsp;&nbsp;&nbsp;');
    
    document.getElementById('letter-body').innerHTML = letter;
    
    // Set payment options (no need to decode these)
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

// Helper function to wrap emojis with span tags
function wrapEmojis(text) {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
    return text.replace(emojiRegex, '<span class="emoji">$1</span>');
}
// Helper function to decode only once
function decodeURIComponentOnce(str) {
    try {
        // First replace %25 with a temporary placeholder
        const temp = str.replace(/%25/g, '___TEMP___');
        // Then decode normally
        const decoded = decodeURIComponent(temp);
        // Restore the original %25 if it was part of the actual content
        return decoded.replace(/___TEMP___/g, '%25');
    } catch (e) {
        return str;
    }
}

// Helper function to wrap emojis with span tags
function wrapEmojis(text) {
    const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
    return text.replace(emojiRegex, '<span class="emoji">$1</span>');
}

function setupLetterContent() {
    const letterBody = document.getElementById('letter-body');
    const readMoreBtn = document.getElementById('read-more');
    const maxLength = 900;
    
    // Check if content exceeds max length (textContent ignores HTML tags)
    if (letterBody.textContent.length > maxLength) {
        // Create temporary element to measure text with HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = letterBody.innerHTML;
        
        let charCount = 0;
        let truncatedHtml = '';
        let foundAllText = false;
        
        // Recursively process nodes
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
        
        // Preserve original content
        const fullHtml = letterBody.innerHTML;
        
        // Set truncated content
        letterBody.innerHTML = truncatedHtml + '...';
        readMoreBtn.style.display = 'block';
        
        // Toggle functionality
        readMoreBtn.addEventListener('click', function() {
            if (letterBody.innerHTML === fullHtml) {
                letterBody.innerHTML = truncatedHtml + '...';
            } else {
                letterBody.innerHTML = fullHtml;
            }
        });
    }
}

function setupVideoControls() {
    const video = document.querySelector('video');
    if (video) {
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(e => console.log('Video play failed:', e));
            } else {
                video.pause();
            }
        });
        
        // Ensure video plays when swiped to (iOS requirement)
        document.querySelector('.swiper-container').addEventListener('touchstart', function() {
            if (document.querySelector('.swiper-slide-active').classList.contains('video-card')) {
                video.play().catch(e => console.log('Video autoplay prevented:', e));
            }
        }, { passive: true });
    }
}

function setupCopyButtons() {
    // Attach click handlers to all copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const inputId = this.parentElement.querySelector('input').id;
            copyPaymentNumber(inputId);
        });
    });
    
    // Also allow clicking anywhere on the payment option to copy
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function(e) {
            // Only trigger if not clicking directly on the copy button
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
    
    // Select the text
    numberInput.select();
    numberInput.setSelectionRange(0, 99999); // For mobile devices
    
    // Try both copy methods for maximum compatibility
    try {
        // Older browsers
        const successful = document.execCommand('copy');
        
        // Modern browsers
        if (!successful) {
            navigator.clipboard.writeText(numberInput.value).then(() => {
                showCopyNotification(numberInput);
            }).catch(err => {
                console.error('Clipboard API failed:', err);
                showCopyNotification(numberInput, true);
            });
        } else {
            showCopyNotification(numberInput);
        }
    } catch (err) {
        // Fallback to modern API if execCommand fails
        navigator.clipboard.writeText(numberInput.value).then(() => {
            showCopyNotification(numberInput);
        }).catch(err => {
            console.error('Both copy methods failed:', err);
            showCopyNotification(numberInput, true);
        });
    }
}

function showCopyNotification(element, failed = false) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = failed ? 'Press Ctrl+C to copy' : 'Copied!';
    document.body.appendChild(notification);
    
    // Position near the copied element
    const rect = element.getBoundingClientRect();
    notification.style.left = `${rect.left + rect.width/2 - notification.offsetWidth/2}px`;
    notification.style.top = `${rect.top - 40}px`;
    
    // Animate out
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 1500);
}

function setupRippleEffects() {
    document.querySelectorAll('.payment-option, .send-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
}
