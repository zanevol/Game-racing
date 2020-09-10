const score = document.querySelector('.score'),
	start = document.querySelector('.start'),
	gameArea = document.querySelector('.gameArea'),
	car = document.createElement('div'),
	hard = document.querySelector('.hard');
car.classList.add('car');

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
	traffic: 3,
};

const getQuantityElements = heightElement => {
	return document.documentElement.clientHeight / heightElement + 1;
};

const startGame = () => {
	start.classList.add('hide');
	gameArea.innerHTML = '';
	for (let i = 0; i < getQuantityElements(100); i++) {
		const line = document.createElement('div');
		line.classList.add('line');
		line.style.top = (i * 100) + 'px';
		line.y = i * 100;
		gameArea.appendChild(line);
	}

	for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
		const enemy = document.createElement('div');
		enemy.classList.add('enemy');
		enemy.y = -100 * setting.traffic * (i + 1);
		enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
		enemy.style.top = enemy.y + 'px';
		enemy.style.background = 'transparent url("./image/enemy2.png") no-repeat center / cover'
		gameArea.appendChild(enemy);
	}

	setting.score = 0;
	setting.start = true;
	gameArea.appendChild(car);
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
	event.preventDefault();
	keys[event.key] = true;
};

const stopRun = event => {
	event.preventDefault();
	keys[event.key] = false;
};

const moveRoad = () => {
	let lines = document.querySelectorAll('.line');
	lines.forEach(line => {
		line.y += setting.speed;
		line.style.top = line.y + 'px';
		if (line.y >= document.documentElement.clientHeight) {
			line.y = -100;
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
		}

		enemy.y += setting.speed / 2;
		enemy.style.top = enemy.y + 'px';

		if (enemy.y >= document.documentElement.clientHeight) {
			enemy.y = -100 * setting.traffic;
			enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
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