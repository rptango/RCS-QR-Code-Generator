(function () {
  const agentIdInput = document.getElementById('agent-id');
  const messageInput = document.getElementById('message');
  const logoInput = document.getElementById('logo');
  const clearLogoBtn = document.getElementById('clear-logo');
  const downloadBtn = document.getElementById('download-btn');
  const uriPreview = document.getElementById('uri-preview');
  const qrContainer = document.getElementById('qr-container');

  let logoDataUrl = null;

  const qrCode = new QRCodeStyling({
    width: 260,
    height: 260,
    type: 'canvas',
    data: ' ',
    margin: 8,
    dotsOptions: { color: '#211c1c', type: 'rounded' },
    cornersSquareOptions: { type: 'extra-rounded' },
    imageOptions: { crossOrigin: 'anonymous', margin: 6, imageSize: 0.4 },
    qrOptions: { errorCorrectionLevel: 'H' },
  });
  qrCode.append(qrContainer);

  function buildSmsUri(agentId, message) {
    const recipient = encodeURIComponent(agentId.trim());
    const body = encodeURIComponent(message);
    return `sms:${recipient}%40rbm.goog?body=${body}`;
  }

  function update() {
    const agentId = agentIdInput.value.trim();
    const message = messageInput.value;

    downloadBtn.disabled = !agentId;
    qrContainer.classList.toggle('empty', !agentId);

    if (!agentId) {
      uriPreview.textContent = 'Enter an RCS Agent ID to generate the QR code.';
      uriPreview.classList.add('error');
      qrCode.update({ data: ' ', image: null });
      return;
    }

    const uri = buildSmsUri(agentId, message);
    uriPreview.textContent = '';
    uriPreview.classList.remove('error');
    qrCode.update({ data: uri, image: logoDataUrl });
  }

  logoInput.onchange = () => {
    const file = logoInput.files[0];
    if (!file) {
      logoDataUrl = null;
      update();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      logoDataUrl = reader.result;
      update();
    };
    reader.readAsDataURL(file);
  };

  clearLogoBtn.onclick = () => {
    logoInput.value = '';
    logoDataUrl = null;
    update();
  };

  downloadBtn.onclick = () => {
    if (downloadBtn.disabled) return;
    qrCode.download({ name: 'rcs-qr-code', extension: 'png' });
  };

  agentIdInput.oninput = update;
  messageInput.oninput = update;

  update();
})();
