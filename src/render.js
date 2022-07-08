import isEmpty from 'lodash/isEmpty.js';
import i18nInstance from './init.js';

const render = (elements, path, value) => {
  const { feedback } = elements;
  const { field } = elements;
  const { form } = elements;

  if (path === 'form.error' && !isEmpty(value)) {
    feedback.textContent = '';
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t(value);
  }

  if (path === 'form.uniqueLinks') {
    form.reset();
    field.focus();
    field.classList.remove('is-invalid');
    feedback.textContent = '';
    feedback.textContent = i18nInstance.t('success');
    feedback.classList.remove('text-danger');
  }

  if (path === 'form.valid' && value === false) {
    field.classList.add('is-invalid');
  }
};

export default render;
