const textInputDe = document.getElementById('input-decrypt');
const textOutputDe = document.getElementById('output-decrypt');
const submitBtnDe  = document.getElementById('submit-button-decrypt');

submitBtnDe.addEventListener('click', (e) => {
  const cipherData = { cipher: textInputDe.value };

  const deReq = new Request('/decrypt', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify( cipherData ),
  });

  fetch(deReq)
    .then(response => response.json())
    .then(data => {
      textOutputDe.textContent = data.plaintext;
    });
});
