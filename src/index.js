/* global document */
import onChange from 'on-change';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import keyBy from 'lodash/keyBy.js';
import render from './render';

const schema = yup.object().shape({
  website: yup.string().url().nullable(),
});

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
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

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userLink = e.target.querySelector('input').value;
    state.form.link.website = userLink;
    const objectAfterValidation = await validate(state.form.link);
    watchedState.form.error = objectAfterValidation;
    watchedState.form.valid = isEmpty(objectAfterValidation);
    if (isEmpty(objectAfterValidation)) {
      if (state.form.uniqueLinks.includes(userLink)) {
        watchedState.form.valid = false;
        watchedState.form.error = 'RSS уже существует';
      } else {
        state.form.uniqueLinks.push(userLink);
        watchedState.form.valid = true;
      }
    }
  });
};

eventHandler();
