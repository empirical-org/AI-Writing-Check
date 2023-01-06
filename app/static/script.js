'use strict';

window.addEventListener('load', function () {

  const textBox = document.getElementById('js-textBox');
  const form = document.getElementById('js-form');
  const submitButton = document.getElementById('js-submitButton');
  const wordCountField = document.getElementById('js-wordCount');
  const countersBox = document.getElementById('js-counters');

  const warningBox = document.getElementById('js-warning');
  const processingBox = document.getElementById('js-processing');
  const humanBox = document.getElementById('js-human');
  const aiBox = document.getElementById('js-ai');
  const minWords = 100;
  const maxWords = 400;
  const errorClass = 'errorBox';
  const validClass = 'validBox';

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

    console.log('Submit form')


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
    return (count > minWords || count >= maxWords);
  }

  function wordCount() {
    return textBox.value.split(" ").length;
  }

  function showBox(box) {

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

});

