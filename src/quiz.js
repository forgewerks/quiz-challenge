/*--------------------------------------------*/
/*----------- HTML/File References -----------*/
/*--------------------------------------------*/
const quizContainer = document.getElementsByClassName('container')[0];
const themeButton = document.getElementById('question-theme');
const quizNumber = document.getElementById('question-number');
const quizQuestion = document.getElementById('question-text');
const quizAnswers = document.getElementById('options');
const quizSubmit = document.getElementById('question-nxt');
const timerDisplay = document.getElementById('question-timer');
const speechText = document.getElementsByClassName('face-speech')[0];
const correctSound = new Audio('./resources/Sounds/correct.mp3');
const incorrectSound = new Audio('./resources/Sounds/incorrect.mp3');


/*----------------------------------------*/
/*----------- Global Variables -----------*/
/*----------------------------------------*/
let answerList = [];
let currentlySelected = -1;
let currentlyCorrect = -1;
let questionIndex = 0;
const DEFAULT_TIMER = 30;
let timer = 0;
let timerInterval = null;


/*----------------------------------------*/
/*------------ Quiz Functions ------------*/
/*----------------------------------------*/

/*--------- Fill From Data ---------*/
fillQuiz();
async function fillQuiz() {
    quizAnswers.innerHTML = "";
    quizQuestion.innerHTML = "";
    timer = DEFAULT_TIMER;
    resetTimer();
    const dataLoaded = await resetData();
    console.log(dataLoaded);
    timerDisplay.innerHTML = `Remaining Time: <b>0:${timer}</b>`;
    //--add info from data to html--
    quizSubmit.disabled = true;
    let questionData = data[questionIndex];
    quizNumber.innerHTML = "QUESTION " + (questionIndex + 1) + "/" + data.length;
    quizQuestion.innerHTML = formatString(questionData.question);
    for (let i = 0; i < Object.keys(questionData.answers).length; i++) {
        let answer = questionData.answers["answer_" + String.fromCharCode(97 + i)];
        let correct =  questionData.correct_answers["answer_" + String.fromCharCode(97 + i) + "_correct"];
        if (answer) {
            quizAnswers.innerHTML+=`<div class="option-container">
                                        <input type="radio" value="${i}" id="opt${i}" name="answer" onchange="selectOption(event, ${i})" required/>
                                        <label class="option" for="opt${i}">
                                            <p class="option-letter">${String.fromCharCode(97 + i).toUpperCase()}</p>
                                            <p class="option-txt">${formatString(answer)}</p>
                                        </label>

                                    </div>`
        }
        if(correct == "true"){
            currentlyCorrect = i;
        }
    }
}
/*----Fill correct answers array----*/
async function resetData(){
    try {
        if(localStorage.getItem("answers")){
            answerList = JSON.parse(localStorage.getItem("answers"));
        }

        if(localStorage.getItem("questionIndex")){
            questionIndex = parseInt(localStorage.getItem("questionIndex"));
        }

        if(localStorage.getItem("data")) {
            data = JSON.parse(localStorage.getItem("data"));
        } else {
            const fetchedData = await getData();
            if (fetchedData) {
                data = fetchedData;
            } else {
                throw new Error("Could not load quiz data");
            }
        }
    } catch(e){
        console.log("Error in resetData:", e);
        if(questionIndex == 0){
            localStorage.setItem("answers", JSON.stringify(answerList));
            localStorage.setItem("questionIndex", questionIndex);
        }
    }
}
/**----Fetch Data from API----*/
async function getData() {
    try {
        const response = await fetch(CONFIG.BASE_URL + "&apiKey=" + CONFIG.API_KEY + CONFIG.CONFIG);
        const fetchedData = await response.json();
        localStorage.setItem("data", JSON.stringify(fetchedData));
        return fetchedData;
    } catch (e) {
        console.log("Error fetching data: ", e);
        console.log("Using local data instead.");
        return null;
    }
}

/*----Set Timer with Updating UI----*/
function resetTimer(){
    //--load timer from local storage--
    if(localStorage.getItem("timer")){
        timer = parseInt(localStorage.getItem("timer"));
    }

    //--setInterval for next second--
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
        timer--;
        const timerText = timer < 10 ? "0" + timer : timer;
        timerDisplay.innerHTML = `Remaining Seconds: <b>${timerText}</b>`;
        localStorage.setItem("timer", timer);
        if(timer == 10){
            speechText.innerHTML = "Hurry up! Only 10 seconds left!";
        }
        if(timer == 5){
            speechText.innerHTML = "Times running out!";
        }
        //-next question if timer ends--
        if(timer <= 0) {
            clearInterval(timerInterval);
            checkResult();
        }
    }, 1000);
}
/*----Special characters----*/
function formatString(str){
    return str
    .replace(/&/g, '&amp;') 
    .replace(/</g, '&lt;')   
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;') 
    .replace(/'/g, '&#39;');
}


/*---------------------------------------*/
/*---------- Question Handling ----------*/
/*---------------------------------------*/

/*--------- Select Answer Form ---------*/
function selectOption(e, index) {
    currentlySelected = index;
    quizSubmit.disabled = false;
    speechText.innerHTML = confusingPhrases[Math.floor(Math.random()*confusingPhrases.length)]
}

/*--------- Submit Answer Form ---------*/
function submitAnswer(e) {
    e.preventDefault();
    checkResult();
}
function checkResult(){
    //--check if correct, last question or ended--
    console.log("Selected: " + currentlySelected + " Correct: " + currentlyCorrect);
    if(currentlyCorrect == currentlySelected){
        answerList[questionIndex] = true;
        speechText.innerHTML = "Correct!";
        correctSound.play().catch(e => console.log("Audio play failed:", e));
    }else{
        answerList[questionIndex] = false;
        speechText.innerHTML = "Incorrect!";
        incorrectSound.play().catch(e => console.log("Audio play failed:", e));
    }
    questionIndex++;
    if(questionIndex == data.length-1){
        quizSubmit.innerHTML = "End";
    }
    console.log(questionIndex >= data.length);
    if(questionIndex >= data.length){
        window.location.href = "end.html";
    }
    //--next question
    localStorage.setItem("answers", JSON.stringify(answerList));
    localStorage.setItem("questionIndex", questionIndex);
    localStorage.removeItem("timer");
    fillQuiz();
}


/*--------------------------------------*/
/*------------ UI Functions ------------*/
/*--------------------------------------*/

/*--------- Switch Light on load ---------*/
checkTheme();
function checkTheme(){
    if (localStorage.getItem("theme") == "dark") {
        quizContainer.classList.remove('container-quiz-light');
        quizContainer.classList.add('container-quiz-dark');
        themeButton.innerHTML = "Light"
    } 
    if (localStorage.getItem("theme") == "light") {
        quizContainer.classList.remove('container-quiz-dark');
        quizContainer.classList.add('container-quiz-light');
        themeButton.innerHTML = "Dark"
    }
}

/*--------- Switch Light or Dark Theme ---------*/
function changeTheme(){
    if (quizContainer.classList.contains('container-quiz-dark')) {
        //--light theme--
        quizContainer.classList.remove('container-quiz-dark');
        quizContainer.classList.add('container-quiz-light');
        themeButton.innerHTML = "Dark"
        localStorage.setItem("theme", "light");
    } else {
        //--dark theme--
        quizContainer.classList.remove('container-quiz-light');
        quizContainer.classList.add('container-quiz-dark');
        themeButton.innerHTML = "Light"
        localStorage.setItem("theme", "dark");
    }
}


