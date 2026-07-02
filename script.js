const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');

// Definição dos estilos de pista
const trackStyles = {
    normal: {
        name: 'Normal',
        image: 'pista.png',
        minScore: 0
    },
    primavera: {
        name: 'Primavera 🌸',
        image: 'pista_primavera.png',
        minScore: 2000
    },
    outono: {
        name: 'Outono 🍂',
        image: 'pista_outono.png',
        minScore: 5000
    },
    chuva: {
        name: 'Chuva 🌧️',
        image: 'pista_chuva.png',
        minScore: 8000
    },
    neve: {
        name: 'Neve ❄️',
        image: 'pista_neve.png',
        minScore: 12000
    }
};

let currentTrack = 'normal';
let nextTrackScore = trackStyles.primavera.minScore;
let gameAnimationId = null;

// LANES disponíveis para os carros
const LANES = [90, 200, 310, 420];

let player = {
    speed: 5,
    score: 0,
    start: false,
    baseSpeed: 5,
    speedBoostActive: false,
    boostTimer: 0,
    shieldActive: false,
    shieldTimer: 0,
    level: 1,
    x: 250,
    y: 0,
    nitroParticles: []
};

let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

// ========== FUNÇÕES DE PISTA ==========
function updateTrackByScore() {
    let newTrack = 'normal';
    
    if (player.score >= trackStyles.neve.minScore) {
        newTrack = 'neve';
    } else if (player.score >= trackStyles.chuva.minScore) {
        newTrack = 'chuva';
    } else if (player.score >= trackStyles.outono.minScore) {
        newTrack = 'outono';
    } else if (player.score >= trackStyles.primavera.minScore) {
        newTrack = 'primavera';
    } else {
        newTrack = 'normal';
    }
    
    if (currentTrack !== newTrack) {
        currentTrack = newTrack;
        const trackInfo = trackStyles[currentTrack];
        gameArea.style.backgroundImage = `url('${trackInfo.image}')`;
        showTrackChangeNotification(trackInfo.name);
        addWeatherEffects(currentTrack);
        updateNextTrackMilestone();
    }
}

function showTrackChangeNotification(trackName) {
    const notification = document.createElement('div');
    notification.className = 'trackNotification';
    notification.innerHTML = `
        <div class="notificationContent">
            <span class="trackIcon">${getTrackIcon(trackName)}</span>
            <span>${trackName}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 1000);
        }, 3000);
    }, 100);
}

function getTrackIcon(trackName) {
    const icons = {
        'Primavera 🌸': '🌸',
        'Outono 🍂': '🍂',
        'Chuva 🌧️': '🌧️',
        'Neve ❄️': '❄️',
        'Normal': '🏁'
    };
    return icons[trackName] || '🏁';
}

function updateNextTrackMilestone() {
    if (currentTrack === 'neve') {
        nextTrackScore = Infinity;
    } else if (currentTrack === 'chuva') {
        nextTrackScore = trackStyles.neve.minScore;
    } else if (currentTrack === 'outono') {
        nextTrackScore = trackStyles.chuva.minScore;
    } else if (currentTrack === 'primavera') {
        nextTrackScore = trackStyles.outono.minScore;
    } else {
        nextTrackScore = trackStyles.primavera.minScore;
    }
}

function getNextTrackName() {
    if (currentTrack === 'normal') return 'Primavera 🌸';
    if (currentTrack === 'primavera') return 'Outono 🍂';
    if (currentTrack === 'outono') return 'Chuva 🌧️';
    if (currentTrack === 'chuva') return 'Neve ❄️';
    return null;
}

// ========== FUNÇÕES DE EFEITOS CLIMÁTICOS ==========
function addWeatherEffects(track) {
    const oldWeather = document.querySelector('.weatherEffect');
    if (oldWeather) oldWeather.remove();
    
    if (track === 'chuva') {
        createRainEffect();
    } else if (track === 'neve') {
        createSnowEffect();
    } else if (track === 'primavera') {
        createCherryBlossomEffect();
    } else if (track === 'outono') {
        createLeafEffect();
    }
}

function createRainEffect() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'weatherEffect rainEffect';
    rainContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:15;overflow:hidden';
    
    for (let i = 0; i < 100; i++) {
        const raindrop = document.createElement('div');
        raindrop.style.cssText = `position:absolute;width:2px;height:15px;background:linear-gradient(to bottom,rgba(173,216,230,0.8),rgba(135,206,250,0.2));left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:rainFall ${0.5 + Math.random()}s linear infinite;animation-delay:${Math.random() * 2}s;opacity:${0.3 + Math.random() * 0.5}`;
        rainContainer.appendChild(raindrop);
    }
    gameArea.appendChild(rainContainer);
}

function createSnowEffect() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'weatherEffect snowEffect';
    snowContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:15;overflow:hidden';
    
    for (let i = 0; i < 60; i++) {
        const snowflake = document.createElement('div');
        snowflake.style.cssText = `position:absolute;width:3px;height:3px;background:white;border-radius:50%;left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:snowFall ${3 + Math.random() * 4}s linear infinite;animation-delay:${Math.random() * 5}s;opacity:${0.5 + Math.random() * 0.5}`;
        snowContainer.appendChild(snowflake);
    }
    gameArea.appendChild(snowContainer);
}

function createCherryBlossomEffect() {
    const blossomContainer = document.createElement('div');
    blossomContainer.className = 'weatherEffect blossomEffect';
    blossomContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:15;overflow:hidden';
    
    for (let i = 0; i < 30; i++) {
        const blossom = document.createElement('div');
        blossom.style.cssText = `position:absolute;width:8px;height:8px;background:#ffb7c5;border-radius:50% 0 50% 0;transform:rotate(45deg);left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:leafFall ${5 + Math.random() * 4}s linear infinite;animation-delay:${Math.random() * 8}s;opacity:${0.6 + Math.random() * 0.4}`;
        blossomContainer.appendChild(blossom);
    }
    gameArea.appendChild(blossomContainer);
}

function createLeafEffect() {
    const leafContainer = document.createElement('div');
    leafContainer.className = 'weatherEffect leafEffect';
    leafContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:15;overflow:hidden';
    
    const leafColors = ['#ff6b35', '#cc5500', '#8b4513', '#ffa500', '#ff8c00'];
    
    for (let i = 0; i < 25; i++) {
        const leaf = document.createElement('div');
        leaf.style.cssText = `position:absolute;width:10px;height:6px;background:${leafColors[Math.floor(Math.random() * leafColors.length)]};border-radius:50% 0 50% 0;transform:rotate(${Math.random() * 360}deg);left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation:leafFall ${6 + Math.random() * 4}s linear infinite;animation-delay:${Math.random() * 8}s;opacity:${0.7 + Math.random() * 0.3}`;
        leafContainer.appendChild(leaf);
    }
    gameArea.appendChild(leafContainer);
}

// ========== FUNÇÕES DE SPAWN ==========
function isLaneOccupied(lane, currentEnemies, yPosition, minDistance = 150) {
    for (let enemy of currentEnemies) {
        const enemyLane = parseInt(enemy.style.left);
        const enemyY = enemy.y;
        if (Math.abs(enemyLane - lane) < 30 && Math.abs(enemyY - yPosition) < minDistance) {
            return true;
        }
    }
    return false;
}

function getFreeLane(currentEnemies, yPosition, preferredLane = null) {
    if (preferredLane !== null && !isLaneOccupied(preferredLane, currentEnemies, yPosition)) {
        return preferredLane;
    }
    
    const shuffledLanes = [...LANES];
    for (let i = shuffledLanes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledLanes[i], shuffledLanes[j]] = [shuffledLanes[j], shuffledLanes[i]];
    }
    
    for (const lane of shuffledLanes) {
        if (!isLaneOccupied(lane, currentEnemies, yPosition)) {
            return lane;
        }
    }
    
    return LANES[Math.floor(Math.random() * LANES.length)];
}

function getRandomCarType() {
    const carTypes = ['red', 'blue', 'green', 'yellow', 'purple', 'truck', 'sports'];
    const weights = [0.2, 0.2, 0.2, 0.1, 0.1, 0.1, 0.1];
    
    let random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < carTypes.length; i++) {
        sum += weights[i];
        if (random <= sum) {
            return carTypes[i];
        }
    }
    return carTypes[0];
}

function spawnEnemyAtSafePosition(yPosition = null, preferredLane = null) {
    const currentEnemies = document.querySelectorAll('.enemy');
    
    if (yPosition === null) {
        yPosition = -300 - Math.random() * 400;
    }
    
    const freeLane = getFreeLane(currentEnemies, yPosition, preferredLane);
    
    const enemyCar = document.createElement('div');
    const carType = getRandomCarType();
    enemyCar.className = 'enemy ' + carType;
    enemyCar.y = yPosition;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.left = freeLane + "px";
    
    if (carType === 'truck') {
        enemyCar.style.height = '120px';
        enemyCar.style.width = '80px';
        enemyCar.style.backgroundSize = '80px 120px';
    } else {
        enemyCar.style.height = '100px';
        enemyCar.style.width = '60px';
        enemyCar.style.backgroundSize = '60px 100px';
    }
    
    let speedMultiplier = 1;
    if (carType === 'sports') speedMultiplier = 1.3;
    if (carType === 'truck') speedMultiplier = 0.7;
    enemyCar.dataset.speedMultiplier = speedMultiplier;
    
    gameArea.appendChild(enemyCar);
    return enemyCar;
}

// ========== FUNÇÕES DE COLISÃO E MOVIMENTO ==========
function isCollide(a, b) {
    if (!a || !b) return false;
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    
    const margin = 10;
    return !(
        (aRect.bottom - margin < bRect.top + margin) ||
        (aRect.top + margin > bRect.bottom - margin) ||
        (aRect.right - margin < bRect.left + margin) ||
        (aRect.left + margin > bRect.right - margin)
    );
}

function moveEnemy(car) {
    const enemies = document.querySelectorAll('.enemy');
    const gameAreaHeight = gameArea.offsetHeight;
    
    for (let item of enemies) {
        if (isCollide(car, item) && !player.shieldActive) {
            endGame();
            return;
        }
        
        const speedMultiplier = parseFloat(item.dataset.speedMultiplier) || 1;
        item.y += player.speed * speedMultiplier;
        item.style.top = item.y + "px";
        
        // Reposicionar quando sair da tela
        if (item.y > gameAreaHeight + 200) {
            item.y = -300 - Math.random() * 400;
            const currentEnemies = document.querySelectorAll('.enemy');
            const newLane = getFreeLane(currentEnemies, item.y);
            item.style.left = newLane + "px";
            
            // Chance de mudar o tipo de carro
            if (Math.random() > 0.7) {
                const newType = getRandomCarType();
                item.className = 'enemy ' + newType;
                
                if (newType === 'truck') {
                    item.style.height = '120px';
                    item.style.width = '80px';
                    item.style.backgroundSize = '80px 120px';
                } else {
                    item.style.height = '100px';
                    item.style.width = '60px';
                    item.style.backgroundSize = '60px 100px';
                }
                
                let newSpeedMultiplier = 1;
                if (newType === 'sports') newSpeedMultiplier = 1.3;
                if (newType === 'truck') newSpeedMultiplier = 0.7;
                item.dataset.speedMultiplier = newSpeedMultiplier;
            }
        }
        
        // Movimento lateral para carros esportivos
        if (item.classList.contains('sports') && Math.random() > 0.7) {
            const swing = Math.sin(Date.now() / 200) * 3;
            item.style.transform = `translateX(${swing}px)`;
        } else {
            item.style.transform = 'translateX(0px)';
        }
    }
    
    // Manter número mínimo de inimigos
    const enemyCount = document.querySelectorAll('.enemy').length;
    if (enemyCount < 4) {
        const topEnemies = document.querySelectorAll('.enemy');
        const existingTopPositions = Array.from(topEnemies).map(e => e.y);
        const hasNearTop = existingTopPositions.some(y => y > -200 && y < 100);
        
        if (!hasNearTop) {
            spawnEnemyAtSafePosition(-350);
        }
    }
}

function moveItems(items, className) {
    const car = document.querySelector('.car');
    if (!car) return;
    
    const gameAreaHeight = gameArea.offsetHeight;
    
    for (let item of items) {
        if (isCollide(car, item)) {
            const carRect = car.getBoundingClientRect();
            const gameRect = gameArea.getBoundingClientRect();
            const x = carRect.left - gameRect.left + 30;
            const y = carRect.top - gameRect.top + 50;
            
            if (className === 'coin') {
                player.score += 50;
                createParticle(x, y, 'coin');
                item.remove();
            } else if (className === 'speedBoost') {
                if (!player.speedBoostActive) {
                    player.speedBoostActive = true;
                    player.boostTimer = 300;
                    player.speed += 4;
                    createParticle(x, y, 'boost');
                    const carElement = document.querySelector('.car');
                    if (carElement) carElement.classList.add('boostActive');
                    item.remove();
                    
                    setTimeout(() => {
                        if (player.speedBoostActive) {
                            player.speedBoostActive = false;
                            player.speed = Math.min(player.baseSpeed + Math.floor(player.score / 1500), 25);
                            const carElement = document.querySelector('.car');
                            if (carElement) carElement.classList.remove('boostActive');
                        }
                    }, 5000);
                } else {
                    item.remove();
                }
            } else if (className === 'shield') {
                if (!player.shieldActive) {
                    player.shieldActive = true;
                    player.shieldTimer = 450;
                    const carElement = document.querySelector('.car');
                    if (carElement) carElement.classList.add('shieldActive');
                    item.remove();
                    
                    setTimeout(() => {
                        if (player.shieldActive) {
                            player.shieldActive = false;
                            const carElement = document.querySelector('.car');
                            if (carElement) carElement.classList.remove('shieldActive');
                        }
                    }, 7500);
                } else {
                    item.remove();
                }
            }
        }
        
        if (item.y >= gameAreaHeight + 100) {
            item.y = -200 - Math.random() * 300;
            item.style.left = LANES[Math.floor(Math.random() * 4)] + "px";
        }
        
        item.y += player.speed;
        item.style.top = item.y + "px";
    }
}

function createParticle(x, y, type) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.borderRadius = '50%';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.pointerEvents = 'none';
    particle.style.background = type === 'coin' ? 'gold' : '#00ff00';
    particle.style.boxShadow = type === 'coin' ? '0 0 10px gold' : '0 0 10px #00ff00';
    
    gameArea.appendChild(particle);
    
    let opacity = 1;
    let size = 10;
    const animate = () => {
        opacity -= 0.05;
        size += 1;
        particle.style.opacity = opacity;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.top = parseFloat(particle.style.top) - 5 + 'px';
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    };
    animate();
}

// ========== FUNÇÕES DE DIFICULDADE E TIMERS ==========
function increaseDifficulty() {
    const newLevel = Math.floor(player.score / 1500) + 1;
    if (newLevel > player.level) {
        player.level = newLevel;
        player.baseSpeed = 5 + (player.level * 0.8);
        if (!player.speedBoostActive) {
            player.speed = Math.min(player.baseSpeed, 25);
        }
    }
}

function updateTimers() {
    if (player.speedBoostActive) {
        player.boostTimer--;
        if (player.boostTimer <= 0) {
            player.speedBoostActive = false;
            player.speed = Math.min(player.baseSpeed + Math.floor(player.score / 1500), 25);
            const carElement = document.querySelector('.car');
            if (carElement) carElement.classList.remove('boostActive');
        }
    }
    
    if (player.shieldActive) {
        player.shieldTimer--;
        if (player.shieldTimer <= 0) {
            player.shieldActive = false;
            const carElement = document.querySelector('.car');
            if (carElement) carElement.classList.remove('shieldActive');
        }
    }
}

function createNitroEffect() {
    if (player.speedBoostActive) {
        const car = document.querySelector('.car');
        if (!car) return;
        
        const carRect = car.getBoundingClientRect();
        const gameRect = gameArea.getBoundingClientRect();
        
        for(let i = 0; i < 3; i++) {
            const nitro = document.createElement('div');
            nitro.className = 'nitroEffect';
            nitro.style.cssText = `position:absolute;width:30px;height:15px;background:linear-gradient(to right,#ff0000,#ffff00);border-radius:0 50% 50% 0;opacity:0.7;left:${carRect.left - gameRect.left - 30}px;top:${carRect.top - gameRect.top + 40 + Math.random() * 20}px`;
            gameArea.appendChild(nitro);
            setTimeout(() => nitro.remove(), 300);
        }
    }
}

// ========== FUNÇÃO PRINCIPAL DO JOGO ==========
function gamePlay() {
    const car = document.querySelector('.car');
    const road = gameArea.getBoundingClientRect();
    
    if (player.start && car) {
        // Scroll da pista
        const currentY = parseFloat(gameArea.style.backgroundPositionY) || 0;
        gameArea.style.backgroundPositionY = (currentY + player.speed * 1.5) + 'px';
        
        moveEnemy(car);
        
        const coins = document.querySelectorAll('.coin');
        const boosts = document.querySelectorAll('.speedBoost');
        const shields = document.querySelectorAll('.shield');
        moveItems(coins, 'coin');
        moveItems(boosts, 'speedBoost');
        moveItems(shields, 'shield');
        
        updateTimers();
        increaseDifficulty();
        updateTrackByScore();
        
        const minX = 20;
        const maxX = road.width - 80;
        
        if (keys.ArrowUp && player.y > (road.top + 100)) {
            player.y -= player.speed;
        }
        if (keys.ArrowDown && player.y < (road.bottom - 180)) {
            player.y += player.speed;
        }
        if (keys.ArrowLeft && player.x > minX) {
            player.x -= player.speed * 1.2;
        }
        if (keys.ArrowRight && player.x < maxX) {
            player.x += player.speed * 1.2;
        }
        
        car.style.top = player.y + "px";
        car.style.left = player.x + "px";
        
        if (player.speed > 15) {
            const blurAmount = Math.min((player.speed - 15) / 5, 3);
            gameArea.style.filter = `blur(${blurAmount}px)`;
        } else {
            gameArea.style.filter = 'blur(0px)';
        }
        
        // Atualizar pontuação
        player.score += Math.floor(player.speed / 5);
        score.innerHTML = `
            <div style="font-size: 1.1em; font-weight: bold;">PONTUAÇÃO: ${player.score}</div>
            <div>NÍVEL: ${player.level}</div>
            <div>VELOCIDADE: ${player.speed.toFixed(1)}</div>
            <div>PISTA: ${trackStyles[currentTrack].name}</div>
            ${player.speedBoostActive ? '<div style="color: #00ff00;">BOOST ATIVADO!</div>' : ''}
            ${player.shieldActive ? '<div style="color: cyan;">ESCUDO ATIVADO!</div>' : ''}
        `;
        
        // Mostrar próximo marco
        if (nextTrackScore !== Infinity && player.score >= nextTrackScore - 500 && player.score < nextTrackScore) {
            const nextTrack = getNextTrackName();
            if (nextTrack && !document.querySelector('.nextTrackInfo')) {
                const remaining = nextTrackScore - player.score;
                const info = document.createElement('div');
                info.className = 'nextTrackInfo';
                info.innerHTML = `Próxima pista: ${getTrackIcon(nextTrack)} em ${remaining} pontos`;
                gameArea.appendChild(info);
                setTimeout(() => info.remove(), 3000);
            }
        }
        
        gameAnimationId = requestAnimationFrame(gamePlay);
    }
}

// ========== FUNÇÃO DE FIM DE JOGO ==========
function endGame() {
    player.start = false;
    if (gameAnimationId) {
        cancelAnimationFrame(gameAnimationId);
        gameAnimationId = null;
    }
    startScreen.classList.remove('hide');
    startScreen.innerHTML = `
        <h1>GAME OVER</h1>
        <p>Pontuação Final: <strong>${player.score}</strong></p>
        <p>Nível Alcançado: <strong>${player.level}</strong></p>
        <p>Velocidade Máxima: <strong>${player.speed} km/h</strong></p>
        <br>
        <p>Pressione aqui para recomeçar</p>
    `;
}

// ========== FUNÇÃO DE INÍCIO ==========
function start() {
    if (gameAnimationId) {
        cancelAnimationFrame(gameAnimationId);
        gameAnimationId = null;
    }
    
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";
    
    currentTrack = 'normal';
    gameArea.style.backgroundImage = "url('pista.png')";
    gameArea.style.backgroundPositionY = '0px';
    gameArea.style.filter = 'blur(0px)';
    
    const oldWeather = document.querySelector('.weatherEffect');
    if (oldWeather) oldWeather.remove();
    
    player = {
        speed: 5,
        score: 0,
        start: true,
        baseSpeed: 5,
        speedBoostActive: false,
        boostTimer: 0,
        shieldActive: false,
        shieldTimer: 0,
        level: 1,
        x: 250,
        y: gameArea.offsetHeight - 200,
        nitroParticles: []
    };
    
    // Criar carro do jogador
    const car = document.createElement('div');
    car.className = 'car';
    car.style.left = player.x + "px";
    car.style.top = player.y + "px";
    gameArea.appendChild(car);
    
    // Criar carros inimigos em posições espaçadas
    const enemyPositions = [-150, -500, -850];
    enemyPositions.forEach((yPos, index) => {
        spawnEnemyAtSafePosition(yPos, LANES[index % LANES.length]);
    });
    
    createCollectibles();
    gameAnimationId = requestAnimationFrame(gamePlay);
}

function createCollectibles() {
    for (let x = 0; x < 12; x++) {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.y = ((x + 1) * 120) * -1;
        coin.style.top = coin.y + "px";
        coin.style.left = LANES[Math.floor(Math.random() * 4)] + "px";
        gameArea.appendChild(coin);
    }
    
    for (let x = 0; x < 4; x++) {
        const boost = document.createElement('div');
        boost.className = 'speedBoost';
        boost.y = ((x + 1) * 350) * -1;
        boost.style.top = boost.y + "px";
        boost.style.left = LANES[Math.floor(Math.random() * 4)] + "px";
        gameArea.appendChild(boost);
    }
    
    for (let x = 0; x < 3; x++) {
        const shield = document.createElement('div');
        shield.className = 'shield';
        shield.y = ((x + 1) * 500) * -1;
        shield.style.top = shield.y + "px";
        shield.style.left = LANES[Math.floor(Math.random() * 4)] + "px";
        gameArea.appendChild(shield);
    }
}

// ========== EVENTOS DE TECLADO ==========
function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && player.start) {
        createNitroEffect();
    }
}

function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
startScreen.addEventListener('click', start);