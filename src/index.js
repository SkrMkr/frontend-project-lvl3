/* global document */
import onChange from 'on-change';
import * as yup from 'yup';
import { setLocale } from 'yup';
import render from './render';

setLocale({
  string: {
    url: { key: 'not_url' },
  },
  mixed: {
    notOneOf: { key: 'not_uniq' },
  },
});

const validate = (fields, uniqueLinks) => {
  const schema = yup.object().shape({
    website: yup.string().url().nullable().notOneOf(uniqueLinks),
  });
  return schema.validate(fields, { abortEarly: false });
};

const eventHandler = () => {
  const elements = {
    form: document.querySelector('form'),
    field: document.querySelector('form input'),
    button: document.querySelector('form button'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      link: {
        website: '',
      },
      uniqueLinks: [],
      valid: '',
      error: '',
    },
  };

  const watchedState = onChange(state, (path, value) => render(elements, path, value));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userLink = e.target.querySelector('input').value;
    state.form.link.website = userLink;
    validate(state.form.link, state.form.uniqueLinks)
      .then(() => {
        watchedState.form.error = {};
        watchedState.form.valid = true;
        watchedState.form.uniqueLinks.push(userLink);
      })
      .catch((error) => {
        watchedState.form.error = error.message.key;
        watchedState.form.valid = false;
      });
  });
};

eventHandler();
