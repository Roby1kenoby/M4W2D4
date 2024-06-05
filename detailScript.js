// fast load dettagli
onload = async (e) => {
    await loadDetails()
}

let loadDetails = async function(){
    const params = new URLSearchParams(location.search)
    const id = params.get("id")
    let req = await fetch('https://striveschool-api.herokuapp.com/books/'+id);
    let libro = await req.json()
    console.log(libro)
    
    let detailPage = document.createElement('div')
    detailPage.className = 'd-flex justify-content-center'

    detailPage.innerHTML = 
    `
    <div class="d-flex justify-content-center">
        <div class="card">
            <img src="${libro.img}" alt="img">
            
            <div class="card-body">
                <hr>
                <h3>${libro.title}</h3>
                <p>
                    <span>Genere: ${libro.category}</span>
                    <span>Prezzo: ${libro.price}€</span>
                </p>
            </div>
            <div class="card-footer">
                <form action="./index.html">
                    <button type="submit" class="btn btn-secondary">Back to Cathalog</button>
                </form>
            </div>
        </div>
    </div>
    `

    let bod = document.getElementsByTagName('body')[0]
    bod.appendChild(detailPage)
}
