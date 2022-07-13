/* global document */
import isEmpty from 'lodash/isEmpty.js';
import i18nInstance from './init.js';

const render = (elements, path, value) => {
  const { feedback } = elements;
  const { field } = elements;
  const { form } = elements;
  const { feedsColumn } = elements;
  const { postsColumn } = elements;

  if (path === 'error' && !isEmpty(value)) {
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

  if (path === 'feeds') {
    feedsColumn.innerHTML = '';
    const ul = document.createElement('ul');
    value.forEach((feed) => {
      const li = document.createElement('li');
      li.innerHTML = `<h3>${feed.feedTitle}</h3><p>${feed.feedDescription}</p>`;
      ul.prepend(li);
    });
    feedsColumn.append(ul);
  }

  if (path === 'posts') {
    postsColumn.innerHTML = '';
    const ul = document.createElement('ul');
    value.forEach((post) => {
      const li = document.createElement('li');
      li.textContent = post.postTitle;
      ul.prepend(li);
    });
    postsColumn.prepend(ul);
  }
};

export default render;
