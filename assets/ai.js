// Array of 15+ Eid wishes
const eidWishes = [
  "Eid Mubarak! May this special day bring peace, happiness, and prosperity to you and your family. May Allah accept your good deeds, forgive your transgressions, and ease the suffering of all people around the globe.",
  
  "Wishing you and your family a blessed Eid filled with happiness, peace, and prosperity. May Allah's blessings be with you today and always. Eid Mubarak!",
  
  "On this joyous occasion of Eid, may Allah bless you with happiness and grace your home with warmth and peace. Eid Mubarak to you and your family!",
  
  "As we celebrate Eid, may our hearts be filled with forgiveness, our homes with joy, and our lives with endless happiness. Eid Mubarak!",
  
  "May the magic of this Eid bring lots of happiness in your life and may you celebrate it with all your close friends and family. Eid Mubarak!",
  
  "Eid Mubarak! May this day be as sweet as the sevaiyan you share, as bright as the clothes you wear, and as beautiful as the smiles you show.",
  
  "May Allah's blessings shine upon you and your family on this Eid and always. Wishing you a day filled with love, laughter, and happiness. Eid Mubarak!",
  
  "Eid Mubarak! May this holy day bring you countless blessings, good health, prosperity, and success in all your endeavors.",
  
  "Sending you warm wishes on Eid and wishing that it brings your way ever joys and happiness. Remember me in your prayers. Eid Mubarak!",
  
  "May the divine blessings of Allah bring you hope, faith, and joy on Eid ul-Fitr and forever. Happy Eid Mubarak to you and your family!",
  
  "Eid Mubarak! May your life be filled with happiness, your heart with love, your soul with spiritual, and your mind with wisdom.",
  
  "On this blessed occasion, may Allah fill your life with happiness, your heart with love, your soul with spirituality, and your mind with wisdom. Eid Mubarak!",
  
  "May the guidance and blessings of Allah be with you and your family on this Eid and always. Wishing you a very happy Eid Mubarak!",
  
  "Eid Mubarak! May Allah grant all your wishes on this special day and guide you on the right path always.",
  
  "As you celebrate this holy occasion, may you be blessed with joy, peace, and happiness. Eid Mubarak to you and your loved ones!",
  
  "May this Eid bring you the utmost in peace and prosperity. May Allah bless you today, tomorrow, and always. Eid Mubarak!",
  
  "Eid Mubarak! May your sacrifices and devotion be rewarded with happiness, peace, and prosperity. Have a blessed Eid!",
  
  "Wishing you a day filled with happiness and a year filled with joy. May Allah accept all your prayers and forgive all your faults. Eid Mubarak!"
];

// DOM elements
const generateBtn = document.getElementById('generateAI');
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');
const aiIcon = document.querySelector('.ai-icon');
const aiLoading = document.querySelector('.ai-loading');

// Generate random Eid wish
function generateEidWish() {
  return eidWishes[Math.floor(Math.random() * eidWishes.length)];
}

// Handle AI button click
generateBtn.addEventListener('click', function() {
  // Show loading state
  aiIcon.style.display = 'none';
  aiLoading.style.display = 'block';
  generateBtn.style.backgroundColor = '#6247aa';
  
  // Simulate AI thinking (delay for effect)
  setTimeout(() => {
    const wish = generateEidWish();
    messageTextarea.value = wish;
    charCount.textContent = wish.length;
    
    // Reset button
    aiLoading.style.display = 'none';
    aiIcon.style.display = 'block';
    generateBtn.style.backgroundColor = '#e1d2fa';
    
    // Trigger input event for any existing character count listeners
    messageTextarea.dispatchEvent(new Event('input'));
  }, 800);
});

// Add hover effects
generateBtn.addEventListener('mouseenter', function() {
  this.style.transform = 'scale(1.1)';
  this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
});

generateBtn.addEventListener('mouseleave', function() {
  this.style.transform = 'scale(1)';
  this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
});