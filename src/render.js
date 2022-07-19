/* global document */
import isEmpty from 'lodash/isEmpty.js';
import i18nInstance from './init.js';

const makeReadedLinks = (links, countainer) => {
  links.forEach((link) => {
    const linkElement = countainer.querySelector(`a[href="${link}"]`);
    linkElement.classList.remove('fw-bold');
    linkElement.classList.add('fw-normal', 'link-secondary');
  });
};

const render = (state, elements, path, value) => {
  const { feedback } = elements;
  const { field } = elements;
  const { form } = elements;
  const { feedsColumn } = elements;
  const { postsColumn } = elements;
  const { modalWindow } = elements;

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
      li.classList.add('d-flex', 'justify-content-between', 'align-items-start');
      const a = document.createElement('a');
      const button = document.createElement('button');
      button.setAttribute('data-id', post.id);
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.textContent = i18nInstance.t('watching');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'pull-right');
      a.setAttribute('href', post.postLink);
      a.setAttribute('target', '_blank');
      a.textContent = post.postTitle;
      a.classList.add('fw-bold');
      li.append(a);
      li.append(button);
      ul.prepend(li);
    });
    postsColumn.prepend(ul);
    if (state.uiState.readPosts.length !== 0) {
      makeReadedLinks(state.uiState.readPosts, postsColumn);
    }
  }

  if (path === 'uiState.selectedPost') {
    const { title, body, linkBtn } = modalWindow;
    title.textContent = value.postTitle;
    body.textContent = value.postDescription;
    linkBtn.setAttribute('href', value.postLink);
    linkBtn.innerHTML = i18nInstance.t('read_full');
  }

  if (path === 'uiState.readPosts') {
    makeReadedLinks(value, postsColumn);
  }
};

export default render;
