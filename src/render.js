import isEmpty from 'lodash/isEmpty.js';
import i18nInstance from './init.js';

const makeReadLinks = (links, countainer) => {
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
    const container = document.createElement('div');
    container.classList.add('card', 'border-0');
    const containerForTitle = document.createElement('div');
    containerForTitle.classList.add('card-body');
    const title = document.createElement('h2');
    title.classList.add('card-title', 'h4');
    title.textContent = i18nInstance.t('title_for_feed_container');
    containerForTitle.append(title);
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'rounded-0', 'border-0');
    value.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      li.innerHTML = `<h3 class="h6 m-0">${feed.feedTitle}</h3><p class="m-0 small text-black-50"s>${feed.feedDescription}</p>`;
      ul.prepend(li);
    });
    container.prepend(containerForTitle);
    container.append(ul);
    feedsColumn.prepend(container);
  }

  if (path === 'posts') {
    postsColumn.innerHTML = '';
    const containerPosts = document.createElement('div');
    containerPosts.classList.add('border-0', 'card');

    const containerTitlePost = document.createElement('div');
    containerTitlePost.classList.add('card-body');
    const titlePosts = document.createElement('h4');
    titlePosts.classList.add('card-title', 'h4');
    titlePosts.textContent = i18nInstance.t('title_for_post_container');
    containerTitlePost.append(titlePosts);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'rounded-0', 'border-0');
    value.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const a = document.createElement('a');
      const button = document.createElement('button');
      button.setAttribute('data-id', post.id);
      button.textContent = i18nInstance.t('watching');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'pull-right', 'modal-button');
      a.setAttribute('href', post.postLink);
      a.setAttribute('target', '_blank');
      a.textContent = post.postTitle;
      a.classList.add('fw-bold');
      li.append(a);
      li.append(button);
      ul.prepend(li);
    });
    containerPosts.prepend(containerTitlePost);
    containerPosts.append(ul);
    postsColumn.append(containerPosts);
    if (state.uiState.readPosts.length !== 0) {
      makeReadLinks(state.uiState.readPosts, postsColumn);
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
    makeReadLinks(value, postsColumn);
  }
};

export default render;
