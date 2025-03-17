const options = ["rock", "paper", "scissor"];

function rockPaperScissor(playerChoice) {
    const cpuChoice = options[Math.floor(Math.random() * options.length)];

    // update UI elements
    const playerPlayElement = document.getElementById("playerPlay");
    playerPlayElement.innerHTML = `Your play: <strong>${playerChoice}</strong>`

    const cpuPlayElement = document.getElementById("cpuPlay");
    cpuPlayElement.innerHTML = `CPU play: <strong>${cpuChoice}</strong>`;

    const messageElement = document.getElementById("message")

    // game result var
    let resultMessage = "";

    // UI feature: remove game result message last color
    messageElement.classList.remove(messageElement.classList[3])

    // game rules
    if (playerChoice === cpuChoice) {
        // UI change: change result message color
        messageElement.classList.add("text-yellow-600")

        resultMessage = "It's a tie!";
    } else if (
        (playerChoice === "rock" && cpuChoice === "scissor") ||
        (playerChoice === "paper" && cpuChoice === "rock") ||
        (playerChoice === "scissor" && cpuChoice === "paper")
    ) {
        // UI change: change result message color
        messageElement.classList.add("text-green-600")

        resultMessage = "You win!";

    } else {
        // UI change: change result message color
        messageElement.classList.add("text-red-600")

        resultMessage = "You lose!";
    }

    // update game result message
    messageElement.innerText = resultMessage;
}
