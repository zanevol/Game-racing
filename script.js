const MAX_ENEMY = 10,
	HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div'),
	hard = document.querySelector('.hard'),
	record = document.querySelector('.record');
car.classList.add('car');

gameArea.style.height = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM) * HEIGHT_ELEM;



const audio = document.createElement('audio');
audio.volume = 0.05;
audio.src = 'audio.mp3';
audio.loop = true;
const crash = new Audio('crash.mp3');
crash.volume = 0.06;
const keys = {
	ArrowUp: false,
	ArrowRight: false,
	ArrowDown: false,
	ArrowLeft: false,
};

const setting = {
	start: false,
	score: 0,
	speed: 3,
	traffic: 2,
};

record.textContent = localStorage.getItem('raceScore', setting.score) ? record.textContent = `Рекорд: ${localStorage.getItem('raceScore', setting.score)}` : record.textContent = `Рекорд: ${setting.score}`;

const addLocalStorage = () => {
	if (setting.score > localStorage.getItem('raceScore', setting.score)) {
		localStorage.setItem('raceScore', setting.score);
		record.textContent = `Рекорд: ${setting.score}`;
	}

};




const getQuantityElements = heightElement => {
	return (gameArea.offsetHeight / heightElement) + 1;
};

const startGame = () => {
	audio.play();
	start.classList.add('hide');
	gameArea.innerHTML = '';
	for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) {
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * HEIGHT_ELEM) + 'px';
		line.style.height = (HEIGHT_ELEM / 2) + 'px';
		line.y = i * HEIGHT_ELEM;
		gameArea.append(line);
	}

	for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
		const enemy = document.createElement('div'),
			randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;

		enemy.classList.add('enemy');
		enemy.y = -100 * setting.traffic * (i + 1);
		enemy.style.top = enemy.y + 'px';
		enemy.style.background = `transparent url("./image/enemy${randomEnemy}.png") no-repeat center / cover`
		gameArea.append(enemy);
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
	}

	setting.score = 0;
	setting.start = true;
	gameArea.append(car);
	car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
	car.style.top = 'auto';
	car.style.bottom = '10px';
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
};

const playGame = () => {
	if (setting.start) {
		setting.score += setting.speed;
		score.textContent = `Очки: ${setting.score} `;
		moveRoad();
		moveEnemy();
		if (keys.ArrowLeft && setting.x > 0) {
			// setting.x = setting.x - setting.speed;
			setting.x -= setting.speed;
		}
		if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
			setting.x += setting.speed;
		}
		if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
			setting.y += setting.speed;
		}
		if (keys.ArrowUp && setting.y > 0) {
			setting.y -= setting.speed;
		}

		car.style.left = setting.x + 'px';
		car.style.top = setting.y + 'px';
		requestAnimationFrame(playGame);
	}
};

const startRun = event => {
	if (keys.hasOwnProperty(event.key)) {
		event.preventDefault();
		keys[event.key] = true;
	}
};

const stopRun = event => {
	if (keys.hasOwnProperty(event.key)) {
		event.preventDefault();
		keys[event.key] = false;
	}
};

const moveRoad = () => {
	let lines = document.querySelectorAll('.line');
	lines.forEach(line => {
		line.y += setting.speed;
		line.style.top = line.y + 'px';
		if (line.y >= gameArea.offsetHeight) {
			line.y = -HEIGHT_ELEM;
		}
	});
};

const moveEnemy = () => {
	let enemies = document.querySelectorAll('.enemy');
	enemies.forEach(enemy => {
		let carRect = car.getBoundingClientRect();
		let enemyRect = enemy.getBoundingClientRect();

		if (carRect.top <= enemyRect.bottom &&
			carRect.right >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top) {
			setting.start = false;
			start.classList.remove('hide');
			audio.pause();
			crash.play();
			addLocalStorage();
		}

		enemy.y += setting.speed / 2;
		enemy.style.top = enemy.y + 'px';

		if (enemy.y >= gameArea.offsetHeight) {
			enemy.y = -HEIGHT_ELEM * setting.traffic;
			enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
		}
	});
};

const changeHard = event => {
	const target = event.target;
	if (target.closest('.radio-select')) {
		setting.speed = +target.value;
		setting.traffic = +target.value;
	}
};





start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
hard.addEventListener('change', changeHard);