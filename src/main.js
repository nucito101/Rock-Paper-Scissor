"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Choice_1 = require("./Enum/Choice");
require("./style.css");
var totalMatches = 0;
var currentMatch = 0;
var userScore = 0;
var pcScore = 0;
var matchInput = document.getElementById("match_count");
var startBtn = document.getElementById("start_game");
var configBox = document.querySelector(".config");
var gameBox = document.querySelector(".game_hidden");
var userButtons = document.querySelectorAll(".user_selection button");
var pcHandImg = document.querySelector(".pc_hand img");
var userHandImg = document.querySelector(".user_hand img");
var matchCountDisplay = document.querySelector(".match_count_game");
var matchResult = document.querySelector(".match_result");
var userScoreDisplay = document.querySelector(".player_score .score_number");
var pcScoreDisplay = document.querySelector(".pc_score .score_number");
var overlay = document.querySelector(".overlay");
var finalResult = document.querySelector(".final_result");
var restartBtn = document.getElementById("restart_game");
var notice = document.getElementById("notice");
var choices = Object.values(Choice_1.default);
function getComputerChoice() {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
}
function playRound(userChoice) {
    if (currentMatch > totalMatches)
        return;
    var pcChoice = getComputerChoice();
    userHandImg.src = "/Hand ".concat(capitalize(userChoice), ".svg");
    pcHandImg.src = "/Hand ".concat(capitalize(pcChoice), ".svg");
    var result = "";
    if (userChoice === pcChoice) {
        result = "Draw";
    }
    else if ((userChoice === Choice_1.default.Rock && pcChoice === Choice_1.default.Scissors) ||
        (userChoice === Choice_1.default.Paper && pcChoice === Choice_1.default.Rock) ||
        (userChoice === Choice_1.default.Scissors && pcChoice === Choice_1.default.Paper)) {
        userScore++;
        result = "Player wins this Round";
    }
    else {
        pcScore++;
        result = "PC wins this Round";
    }
    matchResult.textContent = result;
    userScoreDisplay.textContent = userScore.toString();
    pcScoreDisplay.textContent = pcScore.toString();
    currentMatch++;
    matchCountDisplay.textContent = "Match ".concat(currentMatch <= totalMatches ? currentMatch : currentMatch - 1, "  / ").concat(totalMatches);
    if (currentMatch > totalMatches) {
        endGame();
    }
}
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
function endGame() {
    var resultText = "";
    if (userScore > pcScore) {
        resultText = "You Win";
    }
    else if (pcScore > userScore) {
        resultText = "You Lose";
    }
    else {
        resultText = "It´s a Tie";
    }
    overlay.classList.remove("overlay_hidden");
    finalResult.textContent = resultText;
    restartBtn.classList.remove("overlay_hidden");
}
function resetGame() {
    totalMatches = 0;
    currentMatch = 0;
    userScore = 0;
    pcScore = 0;
    userScoreDisplay.textContent = "0";
    pcScoreDisplay.textContent = "0";
    matchResult.textContent = "Match Result";
    matchInput.value = "";
    matchCountDisplay.textContent = "";
    overlay.classList.add("overlay_hidden");
    restartBtn.classList.add("overlay_hidden");
    gameBox.classList.remove("active");
    gameBox.classList.add("game_hidden");
    configBox.classList.remove("hidden");
    userHandImg.src = "/Hand Rock.svg";
    pcHandImg.src = "/Hand Rock.svg";
}
startBtn.addEventListener("click", function () {
    totalMatches = parseInt(matchInput.value);
    if (isNaN(totalMatches)) {
        showNotice();
        totalMatches = Number.POSITIVE_INFINITY;
        configBox.classList.add("hidden");
        gameBox.classList.remove("game_hidden");
        gameBox.classList.add("active");
        matchCountDisplay.textContent = "Match 1 / ".concat(totalMatches);
        currentMatch = 1;
    }
    else {
        configBox.classList.add("hidden");
        gameBox.classList.remove("game_hidden");
        gameBox.classList.add("active");
        matchCountDisplay.textContent = "Match 1 / ".concat(totalMatches);
        currentMatch = 1;
    }
});
userButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        var choiceId = btn.id;
        var userChoice = Choice_1.default[choiceId];
        userButtons.forEach(function (button) {
            if (button === btn) {
                button.classList.add("selected");
                button.classList.remove("dimmed");
            }
            else {
                button.classList.remove("selected");
                button.classList.add("dimmed");
            }
        });
        userButtons.forEach(function (btn) { return (btn.disabled = true); });
        userHandImg.src = "/Hand Rock.svg";
        pcHandImg.src = "/Hand Rock.svg";
        triggerAnimation(userHandImg, "shake");
        triggerAnimation(pcHandImg, "shake");
        setTimeout(function () {
            playRound(userChoice);
            userButtons.forEach(function (btn) {
                btn.classList.remove("selected", "dimmed");
                btn.disabled = false;
            });
        }, 1500);
    });
});
restartBtn.addEventListener("click", resetGame);
function triggerAnimation(e, animationClass) {
    e.classList.add(animationClass);
    e.addEventListener("animationend", function () {
        e.classList.remove(animationClass);
    }, { once: true });
}
function showNotice() {
    notice.classList.remove("notice_hidden");
    notice.style.animation = "none";
    void notice.offsetWidth;
    notice.style.animation = "fadeOutNotice 3s ease-out forwards";
    setTimeout(function () {
        notice.classList.add("notice_hidden");
    }, 4000);
}
