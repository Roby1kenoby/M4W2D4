let cardsContainer = document.getElementById('cardsContainer')
let searchInput = document.getElementById('searchField')
let cartList = document.getElementById('cartList')
let pTotal = document.getElementById('total')
let allBooks = []
let filteredBooks = []
let cart = []
let cartPrices = []
let total = 0
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
    card.dataset.price = book.price
    card.innerHTML = 
    `
    <img src="${book.img}" class="album-img card-img-top" alt="${book.title}">
    <div class="myCardBody">
        <div class="topInfo">
            <button class="btn btn-success" onClick="toggleCart(this.parentElement.parentElement.parentElement)">Buy</button>
            <button class="btn btn-danger d-none" onClick="toggleCart(this.parentElement.parentElement.parentElement)">Remove</button>
        </div>
        <div class="bottomInfo">
                <h5 class="title card-title text-truncate">${book.title}</h5>
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
        // individuo l'elmeneto lista nel dom corrispondente e lo rimuovo 
        findLiByAsin(idCard).remove()
        // aggiorno il totale
        calcTotal()
        btnAdd.classList.remove('d-none')
        btnRemove.classList.add('d-none')    
    }
    // altrimenti aggiungo e switcho i pulsanti
    else{
        cart.push(idCard)
        // aggiungo la voce anche al ccarrello
        addRowToCart(card)
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
    cartList.innerHTML = ''
    refreshCart()
    calcTotal()
    clearDOM()
    loadBooks()
    alert('Cart Emptied!')
}

// event listener sull'input
searchInput.addEventListener('input',function() {
    // se l'input è lungo 3 o più char, allora filtro
    searchInput.value.length >= 3 ? filterBooksArray(searchInput.value) : loadBooks()
})

// funzione per creare riga nel carrello
let addRowToCart = function(card)
{
    let le = document.createElement('li')
    le.innerHTML =
    `<div class="d-flex justify-content-between align-baseline">
        <p class="m-0">${card.dataset.title}</p>
        <p class="m-0 listPrice">${card.dataset.price}€</p>
        <button onClick="removeRowFromCart(this.parentElement.parentElement, '${card.dataset.asin}')">elimina</button>
    </div>
    `
    // aggiungo l'attributo asin perchè lo usero per eliminare l'elemento li se
    // l'utente mi clicca sul pulsante rimuovi nella pagina
    le.dataset.asin = card.dataset.asin
    cartList.appendChild(le)
    calcTotal()
}

// funzione per rimuovere elemento da cartList e ripristinare stato acquisto su elenco libri
let removeRowFromCart = function(listElemenet, asin){
    syncCard(asin)
    listElemenet.remove()
    calcTotal()
}

// funzione per trovare la card con uno specifico asin, per fare toggle dei pulsanti
let syncCard = function(asin){
    // trovo la card in base al suo asin e richiamo la funzione di toggle
    let cardToEdit = document.querySelector(`.myCard[data-asin="${asin}"`)
    toggleCart(cardToEdit)
}

// funzione per trovare un list element dato un asin (click su remove =>deve sparire 
// l'elemento dalla lista)
let findLiByAsin = function(asin){
    return LiToRemove = document.querySelector(`li[data-asin="${asin}"`)
}

// funzione per calcolare il totale carrello ed aggiornarlo sul DOM
let calcTotal = function(){
    total = 0
    let prices = document.getElementsByClassName('listPrice')
    for(let p of prices){
        total += parseFloat(p.innerHTML.replace('€',''))
    }
    pTotal.innerHTML = `Total: ${total.toFixed(2)}€`
}

// fast load photos
onload = async (e) => {
    await loadBooks()
}