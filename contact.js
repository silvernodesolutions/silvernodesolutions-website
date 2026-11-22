// Silvernode Solutions — contact form (Formspree, submitted in-page)

(function () {
  var form = document.getElementById('snContactForm');
  if (!form) return;

  var statusEl = document.getElementById('snFormStatus');
  var submitBtn = document.getElementById('snSubmit');
  var label = submitBtn.querySelector('.sn-submit-label');
  var defaultLabel = label.innerHTML;

  function setStatus(type, message) {
    statusEl.className = 'sn-form-status is-' + type;
    statusEl.textContent = message;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation with friendly message
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      setStatus('error', 'Please fill in your name, a valid email, and a message.');
      return;
    }

    submitBtn.disabled = true;
    label.textContent = 'Sending…';
    setStatus('', '');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          form.classList.remove('was-validated');
          setStatus('success', "Thanks — your message has been sent. We'll be in touch soon.");
        } else {
          return response.json().then(function (data) {
            var msg = data && data.errors
              ? data.errors.map(function (er) { return er.message; }).join(', ')
              : 'Something went wrong. Please try again.';
            setStatus('error', msg);
          });
        }
      })
      .catch(function () {
        setStatus('error', 'We couldn\'t send your message. Please check your connection and try again.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        label.innerHTML = defaultLabel;
      });
  });
})();
