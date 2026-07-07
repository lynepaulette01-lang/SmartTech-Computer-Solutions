const statusMessages = {
  success: 'Thank you. Your message has been sent successfully.',
  missing: 'Please fill in all required fields.',
  'invalid-email': 'Please enter a valid email address.',
  error: 'Sorry, your message could not be sent. Please try again.'
};

const showStatus = (message, type = 'error') => {
  const statusBox = document.getElementById('form-status');

  if (!statusBox) {
    return;
  }

  statusBox.textContent = message;
  statusBox.className = `form-status ${type}`;
  statusBox.hidden = false;
};

const clearStatus = () => {
  const statusBox = document.getElementById('form-status');

  if (!statusBox) {
    return;
  }

  statusBox.textContent = '';
  statusBox.className = 'form-status';
  statusBox.hidden = true;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const markField = (field, hasError) => {
  field.classList.toggle('input-error', hasError);
  field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
};

const validateContactForm = (form) => {
  const requiredFields = [
    form.elements.name,
    form.elements.email,
    form.elements.service,
    form.elements.message
  ];

  let firstInvalidField = null;

  requiredFields.forEach((field) => {
    const hasError = field.value.trim() === '';
    markField(field, hasError);

    if (hasError && !firstInvalidField) {
      firstInvalidField = field;
    }
  });

  if (!firstInvalidField && !isValidEmail(form.elements.email.value.trim())) {
    firstInvalidField = form.elements.email;
    markField(form.elements.email, true);
    showStatus('Please enter a valid email address.');
    return false;
  }

  if (firstInvalidField) {
    showStatus('Please fill in all required fields.');
    firstInvalidField.focus();
    return false;
  }

  clearStatus();
  return true;
};

document.addEventListener('DOMContentLoaded', () => {
  const status = new URLSearchParams(window.location.search).get('status');

  if (status && statusMessages[status]) {
    showStatus(statusMessages[status], status === 'success' ? 'success' : 'error');
  }

  const contactForm = document.getElementById('contact-form');

  if (!contactForm) {
    return;
  }

  contactForm.addEventListener('input', (event) => {
    if (event.target.matches('input, textarea, select')) {
      markField(event.target, false);
    }
  });

  contactForm.addEventListener('submit', (event) => {
    if (!validateContactForm(contactForm)) {
      event.preventDefault();
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }
  });
});
