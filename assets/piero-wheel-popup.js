/**
 * Piero Premium - Interactive Spin Wheel Popup
 * Adapted for Kadın Pijama & Sleepwear
 */
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('piero-wheel-popup');
  if (!popup || !(popup instanceof HTMLDialogElement)) return;
  if (window.Shopify && window.Shopify.designMode) return;

  const storageKey = 'piero-wheel-popup-dismissed';

  const close = () => {
    if (popup.open) popup.close();
    sessionStorage.setItem(storageKey, 'true');
  };

  // Show after 1.8 seconds if not dismissed
  if (!sessionStorage.getItem(storageKey)) {
    window.setTimeout(() => {
      try {
        popup.showModal();
      } catch (e) {
        // Fallback if showModal fails
        popup.setAttribute('open', '');
      }
    }, 1800);
  }

  // Close handlers
  popup.querySelector('[data-wheel-close]')?.addEventListener('click', close);
  popup.addEventListener('close', () => sessionStorage.setItem(storageKey, 'true'));
  popup.addEventListener('click', (event) => {
    if (event.target === popup) close();
  });

  // Copy code handler
  popup.addEventListener('click', async (event) => {
    const copyButton = event.target.closest('[data-wheel-copy]');
    if (!copyButton || !(copyButton instanceof HTMLButtonElement)) return;
    const code = copyButton.dataset.wheelCopy;
    if (!code) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        throw new Error('Fallback clipboard');
      }
      copyButton.textContent = 'KOPYALANDI!';
      copyButton.classList.add('is-copied');
    } catch (e) {
      const fallback = document.createElement('textarea');
      fallback.value = code;
      fallback.setAttribute('readonly', '');
      fallback.style.position = 'fixed';
      fallback.style.opacity = '0';
      document.body.append(fallback);
      fallback.select();
      document.execCommand('copy');
      fallback.remove();
      copyButton.textContent = 'KOPYALANDI!';
      copyButton.classList.add('is-copied');
    }
  });

  // Spin handler
  popup.querySelector('[data-wheel-spin]')?.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const wheel = popup.querySelector('[data-wheel]');
    const result = popup.querySelector('[data-wheel-result]');
    if (!button || !wheel || !result || button.disabled) return;

    const prizes = [
      { label: '%5 indirim', code: 'PIJAMA5', rotation: 324 },
      { label: '%10 indirim', code: 'PIJAMA10', rotation: 252 },
      { label: '%15 indirim', code: 'PIJAMA15', rotation: 180 },
      { label: '200 TL indirim', code: 'PIJAMA200', rotation: 108 },
      { label: '100 TL indirim', code: 'PIJAMA100', rotation: 36 }
    ];

    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    button.disabled = true;
    button.textContent = 'ÇEVRİLİYOR...';

    // 6 full spins + target rotation
    const totalRotation = 2160 + prize.rotation;
    wheel.style.transform = `rotate(${totalRotation}deg)`;

    window.setTimeout(() => {
      popup.dataset.spun = 'true';
      button.style.display = 'none';
      result.innerHTML = `
        <span class="piero-wheel-popup__code">
          <strong>${prize.code}</strong>
          <button type="button" data-wheel-copy="${prize.code}" aria-label="${prize.code} indirim kodunu kopyala">KODU KOPYALA</button>
        </span>
        <small>Tebrikler! ${prize.label} kazandınız. Sepette kullanabilirsiniz.</small>
      `;
    }, 2400);
  });
});
