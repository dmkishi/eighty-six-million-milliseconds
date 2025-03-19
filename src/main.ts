import './styles/style.css';
import Time from './Time';

const time = new Time();
const clock = document.getElementById('js-clock')!;

function updateClock() {
  clock.textContent = time.toString();
  requestAnimationFrame(updateClock);
}

requestAnimationFrame(updateClock);
