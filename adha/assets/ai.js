document.addEventListener("DOMContentLoaded", () => {
  const aiBtn = document.getElementById("generateAI");
  const messageBox = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  aiBtn?.addEventListener("click", async () => {
    const lang = confirm("Generate in Bengali? Click OK for Bengali, Cancel for English");
    messageBox.value = "Generating your Eid wish... ⏳";
    charCount.textContent = messageBox.value.length;

    try {
      const res = await fetch("https://letter-box.xyz/adha/ai/generate-wish.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: lang ? "bn" : "en" })
      });

      const data = await res.json();
      messageBox.value = data.message || "❌ No message returned.";
      charCount.textContent = messageBox.value.length;
    } catch (err) {
      messageBox.value = "⚠️ Error generating message. Try again.";
      charCount.textContent = messageBox.value.length;
    }
  });
});
