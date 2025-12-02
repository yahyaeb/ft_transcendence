const modal = document.getElementById('modal')
const closebtn = document.getElementById('closeModal')
const openbtn = document.getElementById('openModal')
let player1 = document.getElementById('player1')
let player2 = document.getElementById('player2')

openbtn.addEventListener("click", ()=>{
    modal.classList.remove("hidden")
})

closebtn.addEventListener("click", ()=>{
    //ADD TOURNAMENT LOGIC HERE
    modal.classList.add("hidden")
})