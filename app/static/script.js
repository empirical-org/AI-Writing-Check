'use strict';

window.addEventListener('load', function () {

  const textBox = document.getElementById('js-textBox');
  const form = document.getElementById('js-form');
  const submitButton = document.getElementById('js-submitButton');
  const wordCountField = document.getElementById('js-wordCount');
  const countersBox = document.getElementById('js-counters');

  const feedbackBoxes = document.getElementsByClassName("js-feedback");
  const warningBox = document.getElementById('js-warning');
  const processingBox = document.getElementById('js-processing');
  const humanBox = document.getElementById('js-human');
  const aiBox = document.getElementById('js-ai');

  const minWords = 100;
  const maxWords = 400;
  const endpoint = '/classify'
  const errorClass = 'errorBox';
  const validClass = 'validBox';
  const hideClass = 'hide';
  const humanLabel = 'Real';
  const aiLabel = 'Fake';
  const eventSubmit = 'submit_form';
  const eventAIResult = 'ai_result';
  const eventHumanResult = 'human_result';
  const eventErrorResult = 'error_result';

  form.addEventListener('submit', handleSubmit);
  textBox.addEventListener('input', handleTyping);

  function handleSubmit(event) {
    event.preventDefault();

    const count = wordCount();

    if (!countValid(count)) {
      markInvalid();
      return
    }

    markValid();
    showBox(processingBox);
    track(eventSubmit);
    fetchAndUpdate(textBox.value);
  }

  function handleTyping(event) {

    const count = wordCount();

    wordCountField.innerHTML = count;

    if (count >= maxWords) {
      markInvalid()
      return;
    }

    if (countValid(count)) {
      markValid();
      return;
    }
  }

  function countValid(count) {
    return (count >= minWords && count <= maxWords);
  }

  function wordCount() {
    return textBox.value.split(" ").length;
  }

  function markValid() {
    countersBox.classList.remove(errorClass);
    countersBox.classList.add(validClass);
    submitButton.disabled = false;
  }

  function markInvalid() {
    countersBox.classList.add(errorClass);
    countersBox.classList.remove(validClass);
    submitButton.disabled = true;
  }

  function fetchAndUpdate(words) {
    postData(endpoint, { "instances": [{"data": words}]})
      .then((data) => {
        const label = data.label;

        if (label == humanLabel) {
          showBox(humanBox);
          track(eventHumanResult);
        }

        if (label == aiLabel) {
          showBox(aiBox);
          track(eventAIResult);
        }
      })
      .catch((error) => {
        track(eventErrorResult);
        showBox(warningBox);
      });
  }

  function hideAllBoxes() {
    Array.from(feedbackBoxes).forEach((el) => {
      el.classList.add(hideClass);
    })
  }

  function showBox(box) {
    hideAllBoxes();
    box.classList.remove(hideClass)
  }

  async function track(event, params = {}) {
    try {
      gtag('event', event, params)
    } catch(e) {

    }
  }

  async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
});

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('js-textBox').focus();
});

