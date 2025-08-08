import Choice from "./Enum/Choice"
import "./style.css"

let totalMatches: number = 0
let currentMatch: number = 0
let userScore: number = 0
let pcScore: number = 0

const matchInput = document.getElementById("match_count") as HTMLInputElement
const startBtn = document.getElementById("start_game") as HTMLButtonElement
const configBox = document.querySelector(".config") as HTMLDivElement
const gameBox = document.querySelector(".game_hidden") as HTMLDivElement

const userButtons = document.querySelectorAll<HTMLButtonElement>(".user_selection button")
const pcHandImg = document.querySelector(".pc_hand img") as HTMLImageElement
const userHandImg = document.querySelector(".user_hand img") as HTMLImageElement
const matchCountDisplay = document.querySelector(".match_count_game") as HTMLDivElement
const matchResult = document.querySelector(".match_result") as HTMLDivElement
const userScoreDisplay = document.querySelector(".player_score .score_number") as HTMLSpanElement
const pcScoreDisplay = document.querySelector(".pc_score .score_number") as HTMLSpanElement
const overlay = document.querySelector(".overlay") as HTMLDivElement
const finalResult = document.querySelector(".final_result") as HTMLHeadingElement
const restartBtn = document.getElementById("restart_game") as HTMLButtonElement
const notice = document.getElementById("notice") as HTMLDivElement

const choices = Object.values(Choice)

function getComputerChoice(): Choice {
  const index = Math.floor(Math.random() * choices.length)
  return choices[index] as Choice
}

function playRound(userChoice: Choice): void {
  if (currentMatch > totalMatches) return
  const pcChoice = getComputerChoice()

  userHandImg.src = `/Hand ${capitalize(userChoice)}.svg`
  pcHandImg.src = `/Hand ${capitalize(pcChoice)}.svg`

  let result = ""

  if (userChoice === pcChoice) {
    result = "Draw"
  } else if (
    (userChoice === Choice.Rock && pcChoice === Choice.Scissors) ||
    (userChoice === Choice.Paper && pcChoice === Choice.Rock) ||
    (userChoice === Choice.Scissors && pcChoice === Choice.Paper)
  ) {
    userScore++
    result = "Player wins this Round"
  } else {
    pcScore++
    result = "PC wins this Round"
  }

  matchResult.textContent = result
  userScoreDisplay.textContent = userScore.toString()
  pcScoreDisplay.textContent = pcScore.toString()

  currentMatch++

  matchCountDisplay.textContent = `Match ${
    currentMatch <= totalMatches ? currentMatch : currentMatch - 1
  }  / ${totalMatches}`

  if (currentMatch > totalMatches) {
    endGame()
  }
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function endGame() {
  let resultText = ""
  if (userScore > pcScore) {
    resultText = "You Win"
  } else if (pcScore > userScore) {
    resultText = "You Lose"
  } else {
    resultText = "It´s a Tie"
  }
  overlay.classList.remove("overlay_hidden")
  finalResult.textContent = resultText
  restartBtn.classList.remove("overlay_hidden")
}

function resetGame() {
  totalMatches = 0
  currentMatch = 0
  userScore = 0
  pcScore = 0
  userScoreDisplay.textContent = "0"
  pcScoreDisplay.textContent = "0"
  matchResult.textContent = "Match Result"
  matchInput.value = ""
  matchCountDisplay.textContent = ""
  overlay.classList.add("overlay_hidden")
  restartBtn.classList.add("overlay_hidden")
  gameBox.classList.remove("active")
  gameBox.classList.add("game_hidden")
  configBox.classList.remove("hidden")
  userHandImg.src = "/Hand Rock.svg"
  pcHandImg.src = "/Hand Rock.svg"
}

startBtn.addEventListener("click", () => {
  totalMatches = parseInt(matchInput.value)

  if (isNaN(totalMatches)) {
    showNotice()
    totalMatches = Number.POSITIVE_INFINITY
    configBox.classList.add("hidden")
    gameBox.classList.remove("game_hidden")
    gameBox.classList.add("active")
    matchCountDisplay.textContent = `Match 1 / ${totalMatches}`
    currentMatch = 1
  } else {
    configBox.classList.add("hidden")
    gameBox.classList.remove("game_hidden")
    gameBox.classList.add("active")
    matchCountDisplay.textContent = `Match 1 / ${totalMatches}`
    currentMatch = 1
  }
})

userButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const choiceId = btn.id as keyof typeof Choice
    const userChoice = Choice[choiceId]

    userButtons.forEach((button) => {
      if (button === btn) {
        button.classList.add("selected")
        button.classList.remove("dimmed")
      } else {
        button.classList.remove("selected")
        button.classList.add("dimmed")
      }
    })

    userButtons.forEach((btn) => (btn.disabled = true))
    userHandImg.src = "/Hand Rock.svg"
    pcHandImg.src = "/Hand Rock.svg"

    triggerAnimation(userHandImg, "shake")
    triggerAnimation(pcHandImg, "shake")

    setTimeout(() => {
      playRound(userChoice)
      userButtons.forEach((btn) => {
        btn.classList.remove("selected", "dimmed")
        btn.disabled = false
      })
    }, 1500)
  })
})

restartBtn.addEventListener("click", resetGame)

function triggerAnimation(e: HTMLElement, animationClass: string): void {
  e.classList.add(animationClass)
  e.addEventListener(
    "animationend",
    () => {
      e.classList.remove(animationClass)
    },
    { once: true }
  )
}

function showNotice() {
  notice.classList.remove("notice_hidden")
  notice.style.animation = "none"
  void notice.offsetWidth
  notice.style.animation = "fadeOutNotice 3s ease-out forwards"
  setTimeout(() => {
    notice.classList.add("notice_hidden")
  }, 4000)
}
