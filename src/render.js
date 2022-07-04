import isEmpty from 'lodash/isEmpty.js';

const render = (elements, path, value) => {
  const { feedback } = elements;
  const { field } = elements;
  const { form } = elements;

  if (path === 'form.error' && !isEmpty(value)) {
    feedback.textContent = '';
    const { website } = value;
    feedback.classList.add('text-danger');
    feedback.textContent = website.message;
  }

  if (path === 'form.uniqueLinks') {
    form.reset();
    field.focus();
    field.classList.remove('is-invalid');
    feedback.textContent = '';
    feedback.textContent = 'RSS успешно загружен';
    feedback.classList.remove('text-danger');
  }

  if (path === 'form.valid' && value === false) {
    field.classList.add('is-invalid');
  }
};

export default render;
