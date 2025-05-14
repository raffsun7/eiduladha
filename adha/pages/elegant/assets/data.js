// Default Eid message
const defaultMessage = `Eid Mubarak! 🌙✨ May this special day bring peace, happiness, and prosperity to your life. As the moon of Eid rises, may it guide your path to success and bring joy to your heart. Wishing you and your loved ones a beautiful celebration filled with sweet moments and cherished memories. Let's take a moment to thank Allah for all the blessings we’ve received and share kindness and love with those around us. Enjoy the feasts, wear your best, and make this Eid unforgettable. 🌸🕌💫`;

// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  // Grab parameters, decode if needed
  const sender = decodeURIComponent(urlParams.get('sender') || 'Someone Special');
  const recipient = decodeURIComponent(urlParams.get('recipient') || 'Friend');
  const rawMessage = urlParams.get('message') || defaultMessage;
  const message = decodeURIComponent(decodeURIComponent(rawMessage));

  // Target correct HTML elements
  const receiverEl = document.getElementById("receiver"); // FIXED: correct ID
  const senderEl = document.getElementById("sender");
  const messageEl = document.getElementById("eidMessage");

  // Inject content
  if (receiverEl) receiverEl.textContent = `Dear ${recipient},`;
  if (senderEl) senderEl.textContent = `Your ${sender}`;
  if (messageEl) {
    const formatted = message
      .split(/\n+/)
      .map(p => `<span>&emsp; ${p.trim()}</span><br><br>`)
      .join('');
    messageEl.innerHTML = formatted;
  }
});
