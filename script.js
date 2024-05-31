let cardsContainer = document.getElementById('cardsContainer')
let searchInput = document.getElementById('searchField')
let allBooks = []
let filteredBooks = []
let cart = []
// fetch dei libri iniziale
let loadBooks = async function(){
    clearDOM()
    let req = await fetch('https://striveschool-api.herokuapp.com/books');
    allBooks = await req.json()
    showCards(allBooks)
}

// append card in array
let showCards = function(arr){
    arr.forEach((c) => {
        let nc = createCard(c)
        cardsContainer.appendChild(nc)
    })
}

// creazione di una card
let createCard = function(book){
    let card = document.createElement('div')
    card.className = 'myCard'
    card.dataset.asin = book.asin
    card.dataset.title = book.title
    card.innerHTML = 
    `
    <img src="${book.img}" class="album-img card-img-top" alt="${book.title}">
    <div class="myCardBody">
        <div class="topInfo">
            <button class="btn btn-success" onClick="toggleCart(this.parentElement.parentElement.parentElement)">Buy</button>
            <button class="btn btn-danger d-none" onClick="toggleCart(this.parentElement.parentElement.parentElement)">Remove</button>
        </div>
        <div class="bottomInfo">
                <h5 class="author card-title text-truncate">${book.title}</h5>
                <p class="genre">${book.category}</p>
                <p class="price">${book.price}€</p>
        </div>
    </div>
    `
    return card
}

// funzione aggiunta\rimozione in carrello
let toggleCart = function(card){
    let idCard = card.dataset.asin
    // pulsante per aggiungere
    let btnAdd = card.querySelector('button:nth-child(1)')
    // pulsante per rimuovere
    let btnRemove = card.querySelector('button:nth-child(2)')
    // se c'è già, allora rimuovo e switcho i pulsanti
    if(cart.includes(idCard)){
        let cardIndex = cart.findIndex(c => c === idCard)
        cart.splice(cardIndex,1)
        btnAdd.classList.remove('d-none')
        btnRemove.classList.add('d-none')    
    }
    // altrimenti aggiungo e switcho i pulsanti
    else{
        cart.push(idCard)
        btnAdd.classList.add('d-none')
        btnRemove.classList.remove('d-none')    
    }
    refreshCart()
}

// funzione per aggiornare il contatore del carrello
let refreshCart = function(){
    document.getElementById('nrBooks').innerHTML = `(${cart.length})`
}

// funzione per pulire i libri dal DOM
let clearDOM = async function(){
    document.getElementById('cardsContainer').innerHTML = ''
}

// funzione per filtrare un array e mostrare sul DOM i risultati
let filterBooksArray = function(text){
    filteredBooks = allBooks.filter(b => {
        return b.title.toLowerCase().includes(text.toLowerCase())
    })    
    clearDOM()
    showCards(filteredBooks)

}

// funzione per svuotare il carrello
let emptyCart = function(){
    cart = []
    refreshCart()
    clearDOM()
    loadBooks()
    alert('Cart Emptied!')
}

// event listener sull'input
searchInput.addEventListener('input',function() {
    // se l'input è lungo 3 o più char, allora filtro
    searchInput.value.length >= 3 ? filterBooksArray(searchInput.value) : loadBooks()
})

// fast load photos
onload = async (e) => {
    await loadBooks()
}