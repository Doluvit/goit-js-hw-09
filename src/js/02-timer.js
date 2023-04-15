import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  input: document.querySelector('#datetime-picker'),
  button: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[data-seconds]'),
};

refs.button.classList = 'timer-button';
refs.button.disabled = true;

let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const selectedDate = new Date();

    if (selectedDates[0] - selectedDate > 0) {
      refs.button.disabled = false;
    } else {
      refs.button.disabled = true;
      Notiflix.Notify.failure('Please choose a date in the future');
    }
  },
};

const flat = flatpickr(refs.input, options);

refs.button.addEventListener('click', timerStart);

function timerStart() {
  const selectedDate = flat.selectedDates[0];
  timerId = setInterval(() => {
    const startTime = new Date();
    const ms = selectedDate - startTime;
    refs.button.disabled = true;
    refs.input.disabled = true;

    if (ms < 0) {
      clearInterval(timerId);
      refs.input.disabled = false;
      return;
    }
    newTimerUpdate(convertMs(ms));
  }, 1000);
}

function newTimerUpdate({ days, hours, minutes, seconds }) {
  refs.days.textContent = days.toString().padStart(2, '0');
  refs.hours.textContent = hours.toString().padStart(2, '0');
  refs.minutes.textContent = minutes.toString().padStart(2, '0');
  refs.seconds.textContent = seconds.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
