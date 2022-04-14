const textInputEnc = document.getElementById('input-encrypt');
const textOutputEnc = document.getElementById('output-encrypt');
const submitBtnEnc = document.getElementById('submit-button-encrypt');

submitBtnEnc.addEventListener('click', (e) => {
  const plainData = { plaintext: textInputEnc.value };

  const encReq = new Request('/encrypt', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( plainData ),
  });

  fetch(encReq)
    .then(response => response.json())
    .then(data => {
      textOutputEnc.textContent = data.encryptedMessage;
    });
});
