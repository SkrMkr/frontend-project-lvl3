/* global document */
import onChange from 'on-change';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import keyBy from 'lodash/keyBy.js';
// import fs from 'fs';

// const { promises: fsp } = fs;

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

const render = (state, elements, path, value) => {
  if (path === 'form.valid') {
    if (value === false) {
      let { feedback } = elements;
      feedback.textContent = state.form.error;
      console.log(feedback);
    }
  }
};

const eventHandler = () => {
  const elements = {
    form: document.querySelector('form'),
    field: document.querySelector('form > input'),
    button: document.querySelector('form > button'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      link: {
        website: '',
      },
      valid: true,
      error: '',
    },
  };

  const watchedState = onChange(state, (path, value) => render(state, elements, path, value));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const userLink = e.target.querySelector('input').value;
    watchedState.form.link.website = userLink;
    const objectAfterValidation = validate(state.form.link);
    const error = objectAfterValidation.website.message;
    console.log(error);
    if (!isEmpty(error)) {
      watchedState.form.valid = false;
      watchedState.form.error = error;
    } else {
      watchedState.form.valid = true;
      watchedState.form.error = '';
    }
  });
};

eventHandler();
