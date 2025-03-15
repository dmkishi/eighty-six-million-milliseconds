import './styles/style.css';
import Time from './Time';

const time = new Time();
const clock = document.getElementById('clock')!;

clock.textContent = time.toString();
setInterval(() => clock.textContent = time.toString(), 1_000);
