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


  const minWords = 5;
  const maxWords = 400;
  const endpoint = 'https://us-central1-aiplatform.googleapis.com/v1/projects/gpt-experiments-373801/locations/us-central1/endpoints/2125791383095607296:predict'
  const errorClass = 'errorBox';
  const validClass = 'validBox';
  const hideClass = 'hide';
  const humanLabel = 'Real';
  const aiLabel = 'Fake';

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

    console.log('Submit form');

    showBox(processingBox);
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
    return (count >= minWords || count >= maxWords);
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
        console.log(data); // JSON data parsed by `data.json()` call
        const result = data.predictions[0];
        const label = result.label;

        if (label == humanLabel) {
          showBox(humanBox);
        }

        if (label == aiLabel) {
          showBox(aiBox);
        }
      })
      .catch((error) => {
        console.log(error);
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

  async function postData(url = '', data = {}) {
    const token = ""
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
});

