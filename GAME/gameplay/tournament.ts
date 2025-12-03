const modal = document.getElementById('modal')!
const closebtn = document.getElementById('closeModal')!
const openbtn = document.getElementById('openModal')!
let player1Input = document.getElementById('player1') as HTMLInputElement
let player2Input = document.getElementById('player2') as HTMLInputElement
let player3Input = document.getElementById('player3') as HTMLInputElement
let player4Input = document.getElementById('player4') as HTMLInputElement

openbtn.addEventListener("click", ()=>{
    modal.classList.remove("hidden")
})

closebtn.addEventListener("click", ()=>{
    const pseudo1 = player1Input.value.trim() || 'Player 1'
    const pseudo2 = player2Input.value.trim() || 'Player 2'
    const pseudo3 = player3Input.value.trim() || 'Player 3'
    const pseudo4 = player4Input.value.trim() || 'Player 4'
    
    window.location.href = `./tournamentBracket.html?player1=${encodeURIComponent(pseudo1)}&player2=${encodeURIComponent(pseudo2)}&player3=${encodeURIComponent(pseudo3)}&player4=${encodeURIComponent(pseudo4)}`
})