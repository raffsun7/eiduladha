document.addEventListener('DOMContentLoaded', function() {
    // Hide loading animation after 2 seconds
    setTimeout(() => {
      document.getElementById('loading').classList.add('hidden');
    }, 2000);
  
    // DOM Elements
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
  
    // Initialize app
    init();
  
    function init() {
      setupEventListeners();
    }
  
    function setupEventListeners() {
      // Character counter for message
      messageTextarea.addEventListener('input', updateCharCount);
      
      // Navigation buttons
      nextToDesignBtn.addEventListener('click', goToDesign);
      backToDetailsBtn.addEventListener('click', goBackToDetails);
      generateCardBtn.addEventListener('click', generateCard);
      createAnotherBtn.addEventListener('click', resetForm);
      
      // Card style selection
      document.querySelectorAll('.style-option').forEach(option => {
        option.addEventListener('click', selectCardStyle);
      });
      
      // Share functionality
      copyLinkBtn.addEventListener('click', copyLinkToClipboard);
      document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
        btn.addEventListener('click', shareOnPlatform);
      });
      
      // Native share API
      if (navigator.share) {
        nativeShareBtn.addEventListener('click', nativeShare);
      } else {
        nativeShareBtn.style.display = 'none';
      }
    }
  
    function updateCharCount() {
      charCount.textContent = this.value.length;
    }
  
    function goToDesign() {
      if (validateSection1()) {
        // Save form data
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
        // Save payment data if provided
        cardData.bkash = document.getElementById('bkashNumber').value.trim();
        cardData.nagad = document.getElementById('nagadNumber').value.trim();
        
        transitionToSection('section3');
        updateProgress(100, 'Step 3 of 3');
        
        // Generate the card and URL
        generateCardPreview();
        generateShareLink();
        
        // Trigger celebrations
        triggerCelebrations();
      }
    }
  
    function selectCardStyle() {
      document.querySelectorAll('.style-option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      cardData.style = this.dataset.style;
      this.classList.add('card-flip');
      setTimeout(() => {
        this.classList.remove('card-flip');
      }, 1000);
    }
  
    function generateCardPreview() {
      // Clear previous content
      cardPreview.className = 'card-preview';
      cardPreview.innerHTML = '';
      
      // Apply selected style
      if (cardData.style !== 'random') {
        cardPreview.classList.add(cardData.style);
      } else {
        // For random style, pick one from available options
        const styles = ['classic', 'modern', 'islamic', 'fun'];
        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        cardPreview.classList.add(randomStyle);
        cardData.style = randomStyle; // Update the selected style
      }
      
      // Create card content container
      const cardContent = document.createElement('div');
      cardContent.className = 'card-content';
      
      // Add header with Eid Mubarak
      const header = document.createElement('div');
      header.className = 'card-header';
      header.innerHTML = '<h3>Eid Mubarak!</h3>';
      cardContent.appendChild(header);
      
      // Add recipient
      const recipient = document.createElement('div');
      recipient.className = 'card-recipient';
      recipient.innerHTML = `<p>Dear <strong>${escapeHtml(cardData.recipient)}</strong>,</p>`;
      cardContent.appendChild(recipient);
      
      // Add message with preserved formatting
      const message = document.createElement('div');
      message.className = 'card-message';
      
      // Convert formatting for display
      let formattedMessage = escapeHtml(cardData.message)
        .replace(/\r?\n/g, '<br>') // Convert line breaks to <br>
        .replace(/ {2}/g, ' &nbsp;'); // Convert double spaces to &nbsp;
      
      message.innerHTML = `<p>${formattedMessage}</p>`;
      cardContent.appendChild(message);
      
      // Add sender
      const sender = document.createElement('div');
      sender.className = 'card-sender';
      sender.innerHTML = `<p>From <strong>${escapeHtml(cardData.sender)}</strong></p>`;
      cardContent.appendChild(sender);
      
      // Add payment info if provided
      if (cardData.bkash || cardData.nagad) {
        const paymentInfo = document.createElement('div');
        paymentInfo.className = 'card-payment';
        paymentInfo.innerHTML = '<h4>Eidi Gift:</h4>';
        
        if (cardData.bkash) {
          paymentInfo.innerHTML += `<p>bKash: ${formatPhoneNumber(cardData.bkash)}</p>`;
        }
        
        if (cardData.nagad) {
          paymentInfo.innerHTML += `<p>Nagad: ${formatPhoneNumber(cardData.nagad)}</p>`;
        }
        
        cardContent.appendChild(paymentInfo);
      }
      
      // Add decorative elements
      const decorations = document.createElement('div');
      decorations.className = 'card-decorations';
      decorations.innerHTML = `
        <div class="moon">🌙</div>
        <div class="lantern">🦋</div>
        <div class="stars">${Array(5).fill('⭐').join('')}</div>
      `;
      cardContent.appendChild(decorations);
      
      // Add to preview container
      cardPreview.appendChild(cardContent);
    }
  
    function generateShareLink() {
      // Create base URL
      const baseUrl = window.location.href.split('?')[0];
      
      // Preserve line breaks in message by replacing with \n before encoding
      const formattedMessage = cardData.message.replace(/\r?\n/g, '\n');

      const params = new URLSearchParams();
      params.append('sender', encodeURIComponent(cardData.sender));
      params.append('recipient', encodeURIComponent(cardData.recipient));
      params.append('message', encodeURIComponent(formattedMessage));

      if (cardData.bkash) params.append('bkash', cardData.bkash);
      if (cardData.nagad) params.append('nagad', cardData.nagad);

      // Use style in the path instead of query string
      const stylePath = cardData.style || 'random';
      const longUrl = `${baseUrl.replace(/\/$/, '')}/pages/${stylePath}/?${params.toString()}`;

      
      // Display the actual long URL
      generatedLink.value = longUrl;
      
      // Enable share buttons immediately
      document.querySelectorAll('.share-btn').forEach(btn => {
        btn.disabled = false;
      });
    }
  
    function triggerCelebrations() {
      // Play success sound (commented out as it requires user interaction)
      // const audio = new Audio('assets/audio/success.mp3');
      // audio.play().catch(e => console.log('Audio play failed:', e));
      
      // Trigger confetti
      launchConfetti();
      
      // Show success animation
      document.querySelector('.success-animation').classList.add('animate');
    }
  
    function launchConfetti() {
      const canvas = confettiCanvas;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      const particles = [];
      const colors = ['#F6C90E', '#FAD2E1', '#D8F3DC', '#A3D8F4', '#FFFFFF'];
      
      // Create particles
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
      
      // Animation loop
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation * Math.PI / 180);
          
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          
          // Draw different shapes randomly
          if (Math.random() > 0.5) {
            // Circle
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          } else {
            // Star
            drawStar(ctx, 0, 0, particle.size / 2, particle.size, 5);
          }
          
          ctx.fill();
          ctx.restore();
          
          // Update position
          particle.y += particle.speed;
          particle.rotation += particle.rotationSpeed;
          
          // Reset particles that go off screen
          if (particle.y > canvas.height) {
            particle.y = -particle.size;
            particle.x = Math.random() * canvas.width;
          }
        });
        
        requestAnimationFrame(animate);
      }
      
      // Start animation
      animate();
      
      // Stop after 5 seconds
      setTimeout(() => {
        canvas.style.opacity = '0';
        setTimeout(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 1000);
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
      
      // Show feedback
      copyFeedback.classList.add('show');
      setTimeout(() => {
        copyFeedback.classList.remove('show');
      }, 2000);
    }
  
    function shareOnPlatform() {
      const platform = this.dataset.platform;
      const url = encodeURIComponent(generatedLink.value);
      const text = encodeURIComponent(`Eid Mubarak ${cardData.recipient}! Check it out.😉`);
      
      let shareUrl = '';
      
      switch (platform) {
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${text} ${url}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
          break;
        case 'telegram':
          shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
          break;
      }
      
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  
    function nativeShare() {
      navigator.share({
        title: 'Eid Card',
        text: `Hey ${cardData.recipient}, Check it😗`,
        url: generatedLink.value
      }).catch(err => {
        console.log('Error sharing:', err);
      });
    }
  
    function resetForm() {
      // Reset form fields
      document.getElementById('senderName').value = '';
      document.getElementById('recipientName').value = '';
      document.getElementById('message').value = '';
      document.getElementById('bkashNumber').value = '';
      document.getElementById('nagadNumber').value = '';
      
      // Reset card data
      cardData = {
        sender: '',
        recipient: '',
        message: '',
        style: 'random',
        bkash: '',
        nagad: ''
      };
      
      // Reset UI
      document.querySelectorAll('.style-option').forEach(opt => opt.classList.remove('selected'));
      document.querySelector('.style-option[data-style="random"]').classList.add('selected');
      charCount.textContent = '0';
      generatedLink.value = '';
      confettiCanvas.style.opacity = '1';
      
      // Go back to first section
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
        setTimeout(() => {
          detailsForm.classList.remove('shake');
        }, 500);
      }
      
      return isValid;
    }
  
    function validateSection2() {
      // Validate payment numbers if they're provided
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
      
      // Create error message element if it doesn't exist
      if (!formGroup.querySelector('.error-message')) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#ff4757';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '0.5rem';
        formGroup.appendChild(errorElement);
      }
      
      formGroup.querySelector('.error-message').textContent = message;
      
      // Scroll to the error
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  
    function transitionToSection(sectionId) {
      // Hide all sections
      document.querySelectorAll('.card-section').forEach(section => {
        section.classList.remove('active');
      });
      
      // Show target section
      document.getElementById(sectionId).classList.add('active');
      
      // Scroll to top of new section
      document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    }
  
    function updateProgress(percent, label) {
      document.querySelector('.progress-bar').style.width = `${percent}%`;
      document.querySelector('.progress-label').textContent = label;
    }
  
    // Helper function to escape HTML
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  
    // Helper function to format phone numbers
    function formatPhoneNumber(number) {
      return number.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  });