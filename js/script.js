'use strict'

//обьявление переменных
let degplus = 0; //поворот картинки крови
let killCounter = 0; //количество попаданий
let topscore = 0; //Лучший результат
let boxHeight = document.querySelector(".playBox").offsetHeight; //высота игрового поля
let boxwidth = document.querySelector(".playBox").offsetWidth; //шырина игрового поля
let x = boxwidth / 2; //координаты обьекта с лева от края блока
let y = boxHeight / 2; //координаты обьекта с верху от края блока
let direction; // направление движения, одно из 8 направленией
let timer; //задержка. поток для игры
let stepCount = 0; // счетчик шагов
let speed ; //задержка срабатывания функции (скорость движения)
let seconds;//Остаток секунд
let second; //Таймер остатка времени


//--Отслеживает движение мышкой и передвигает кастомный курсор-------
const cursor = document.querySelector(".cursor");
const mouseMove = function (e) {
    let x = e.clientX;
    let y = e.clientY;
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
};
document.addEventListener("mousemove", mouseMove);
//-----------обработка нажатия мыши----------------------------
const mouseDown = function (e) {
    cursor.classList.add("_active");
    setTimeout((() => cursor.classList.remove("_active")), 100);
};
document.addEventListener("mousedown", mouseDown)
//----------------------------------------------------------

//попадание по обьекту---------------------------------
const flyItem = document.querySelector(".fly"); //инициализация обьекта
//срабатывавет при попадании по обьекту
flyItem.addEventListener("mousedown", () => {
    killCounter++; // прибавляет количество попаданий
    document.querySelector(".counter").textContent = killCounter; //рисует значение счетчика попаданий
    //добавляет пятна в игровой блок
    degplus = degplus + 120; //поворот картинки пятна крови
    let playBoxBlood = document.querySelector(".bloodyBox").innerHTML;
    document.querySelector(".bloodyBox").innerHTML = playBoxBlood + `<img class="blood" style="left: ${x}px; top: ${y}px; transform: rotate(${degplus}deg);" src="img/blood.png">`;
    //на время добавляет обьекту класс display none
    flyItem.classList.add("_nonedisplay");
    setTimeout((() => flyItem.classList.remove("_nonedisplay")), 1000);;
});
//--------------------------------------------

//основная функция игры---движения обьекта---------------
function drawFly() {
    if (stepCount == 0) {
        //случайное количество шагов
        stepCount = Math.floor(100 * Math.random()); //0-100
        //случайное направление движения
        direction = Math.floor(8 * Math.random()); //0-7
    }
    else {
        stepCount--;
    }
    switch (direction) {
        case 0:
            //вверх
            y = y - 1;
            flyItem.style.transform = 'rotate(0deg)';
            break;
        case 1:
            //вправо
            x = x + 1;
            flyItem.style.transform = 'rotate(90deg)';
            break;
        case 2:
            //вниз
            y = y + 1;
            flyItem.style.transform = 'rotate(180deg)';
            break;
        case 3:
            //влево
            x = x - 1;
            flyItem.style.transform = 'rotate(270deg)';
            break;
        case 4:
            //вправо вверх
            x = x + 1;
            y = y - 1;
            flyItem.style.transform = 'rotate(45deg)';
            break;
        case 5:
            //вправо вниз
            x = x + 1;
            y = y + 1;
            flyItem.style.transform = 'rotate(135deg)';
            break;
        case 6:
            //влево вниз
            x = x - 1;
            y = y + 1;
            flyItem.style.transform = 'rotate(225deg)';
            break;
        case 7:
            //влево вверх
            x = x - 1;
            y = y - 1;
            flyItem.style.transform = 'rotate(315deg)';
            break;
    }
    //меняет направление при приближении к границе блока
    if (x < 0 || x > boxwidth || y < 0 || y > boxHeight) {
        switch (direction) {
            case 0:
                direction = 2;
                break;
            case 1:
                direction = 3;
                break;
            case 2:
                direction = 0;
                break;
            case 3:
                direction = 1;
                break;
            case 4:
                direction = 6;
                break;
            case 5:
                direction = 7;
                break;
            case 6:
                direction = 4;
                break;
            case 7:
                direction = 5;
                break;
        }
    }
    //меняет положение обьекта (движение обьекта)
    flyItem.style.left = `${x}px`;
    flyItem.style.top = `${y}px`;
    //задержка выполнения
    timer = setTimeout(drawFly, speed);
};
//--------------------------------------------------------------------

// обратный отсчет
function backTime() {
    seconds--;//уменьшает значение таймера
    //отрисовка текущего значения таймера
    document.querySelector(".seconds").textContent = seconds;
    //увеличение скорости каждую секунду
    speed -= 0.1;
    //проверка на остаток времени
    if (seconds < 1) {
        stopGame(); // остановка игры 
    } else {
        //задержка выполнение 1 сек
        second = setTimeout(backTime, 1000);
    }
}

//остановка игры
function stopGame() {
    //останавливает поток текущей игры
    clearTimeout(timer);
    //останавливает поток обратного отсчета времени
    clearTimeout(second);
    //убирает блок с обьектом с игрового поля
    document.querySelector(".fly").innerHTML = '';
    //показывает курсор
    document.querySelector(".body").classList.remove("_cursorHide");
    //скрывает кастомный курсор
    document.querySelector(".cursor").classList.remove("_display");
    // проверяем и устанавливаем значение лучшей игры
    if(killCounter > topscore){
        topscore = killCounter;
    }
    //отрисовывает значение лучшей игры
    document.querySelector(".topscore").textContent = topscore;
}

//старта игры
const button = document.querySelector(".button"); //кнопка старт
button.addEventListener("click", () => startGame(20)); //передает в функцию параметр скорости
const buttonHard = document.querySelector(".buttonHard"); //кнопка старт хард мод
buttonHard.addEventListener("click", () => startGame(6)); //передает в функцию параметр скорости

//функция принимает скорость обьекта. (чем ниже тем быстрее)
function startGame(mod) {
    //останавливает поток текущей игры
    clearTimeout(timer);
    //останавливает поток обратного отсчета времени
    clearTimeout(second);
    //добавляет блок с обьектом на игровое поле
    document.querySelector(".fly").innerHTML = '<img class="icon" src="img/fly.png">';
    //скрывает курсор
    document.querySelector(".body").classList.add("_cursorHide");
    //показывает кастомный курсор
    document.querySelector(".cursor").classList.add("_display");
    //сброс всех переменных к базовым значениям
    seconds = 60; //обратный отсчет
    x = boxwidth / 2; //координаты обьекта с лева от края блока
    y = boxHeight / 2; //координаты обьекта с верху от края блока
    direction = 0; // направление движения, одно из 8 направленией
    stepCount = 0; // счетчик шагов
    speed = mod; //скорость движения
    killCounter = 0 //счетчика попаданий
    document.querySelector(".counter").textContent = killCounter; //рисует значение счетчика попаданий

    backTime(); //запуск потока таймера остаток времени
    drawFly(); //Запуск основного потока игры
};

