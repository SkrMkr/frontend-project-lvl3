import isEmpty from 'lodash/isEmpty.js';
import i18n from 'i18next';

const renderFeedsList = (feeds) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const containerForTitle = document.createElement('div');
  containerForTitle.classList.add('card-body');
  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18n.t('title_for_feed_container');
  containerForTitle.append(title);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'rounded-0', 'border-0');
  feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    li.innerHTML = `<h3 class="h6 m-0">${feed.feedTitle}</h3><p class="m-0 small text-black-50"s>${feed.feedDescription}</p>`;
    ul.prepend(li);
  });
  container.prepend(containerForTitle);
  container.append(ul);
  return container;
};

const renderPostsColumn = (posts) => {
  const containerPosts = document.createElement('div');
  containerPosts.classList.add('border-0', 'card');

  const containerTitlePost = document.createElement('div');
  containerTitlePost.classList.add('card-body');
  const titlePosts = document.createElement('h4');
  titlePosts.classList.add('card-title', 'h4');
  titlePosts.textContent = i18n.t('title_for_post_container');
  containerTitlePost.append(titlePosts);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'rounded-0', 'border-0');
  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    const button = document.createElement('button');
    button.setAttribute('data-id', post.id);
    button.textContent = i18n.t('watching');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'pull-right', 'modal-button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#modal');
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
  return containerPosts;
};

const makeReadLinks = (links, countainer) => {
  links.forEach((link) => {
    const linkElement = countainer.querySelector(`a[href="${link}"]`);
    linkElement.classList.remove('fw-bold');
    linkElement.classList.add('fw-normal', 'link-secondary');
  });
};

const render = (state, elements, path, value) => {
  const {
    feedback,
    field,
    form,
    feedsColumn,
    postsColumn,
    modalWindow,
  } = elements;

  switch (path) {
    case 'error':
      if (!isEmpty(value)) {
        feedback.textContent = '';
        feedback.classList.add('text-danger');
        feedback.textContent = i18n.t(value);
      }
      break;

    case 'form.uniqueLinks':
      form.reset();
      field.focus();
      field.classList.remove('is-invalid');
      feedback.textContent = '';
      feedback.textContent = i18n.t('success');
      feedback.classList.remove('text-danger');
      break;

    case 'form.valid':
      if (value === false) {
        field.classList.add('is-invalid');
      }
      break;

    case 'feeds':
      feedsColumn.innerHTML = '';
      feedsColumn.prepend(renderFeedsList(value));
      break;

    case 'posts':
      postsColumn.innerHTML = '';
      postsColumn.append(renderPostsColumn(value));
      if (state.uiState.readPosts.length !== 0) {
        const idReadPosts = Array.from(state.uiState.readPosts);
        const links = value
          .filter(({ id }) => idReadPosts.includes(id))
          .map((post) => post.postLink);
        makeReadLinks(links, postsColumn);
      }
      break;

    case 'uiState.selectedPostId': {
      const { title, body, linkBtn } = modalWindow;
      const selectedPost = state.posts.find((post) => post.id === value);
      title.textContent = selectedPost.postTitle;
      body.textContent = selectedPost.postDescription;
      linkBtn.setAttribute('href', selectedPost.postLink);
      linkBtn.innerHTML = i18n.t('read_full');
      break;
    }

    case 'uiState.readPosts': {
      const idPosts = Array.from(value);
      const links = state.posts
        .filter(({ id }) => idPosts.includes(id))
        .map((post) => post.postLink);
      makeReadLinks(links, postsColumn);
      break;
    }

    default:
      feedback.textContent = '';
      feedback.classList.add('text-danger');
      feedback.textContent = i18n.t('default_error');
  }
};

export default render;
