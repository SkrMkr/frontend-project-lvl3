import isEmpty from 'lodash/isEmpty.js';

const render = (elements, path, value) => {
  const { feedback } = elements;
  feedback.textContent = '';
  const { field } = elements;
  const { form } = elements;

  if (path === 'form.error' && !isEmpty(value)) {
    const { website } = value;
    const errorMessage = website.message;
    feedback.classList.add('text-danger');
    feedback.textContent = errorMessage;
  }
  if (path === 'form.valid') {
    if (value === true) {
      feedback.textContent = 'RSS успешно загружен';
      feedback.classList.remove('text-danger');
      form.reset();
      field.focus();
      field.classList.remove('is-invalid');
    } else {
      field.classList.add('is-invalid');
    }
  }
};

export default render;
