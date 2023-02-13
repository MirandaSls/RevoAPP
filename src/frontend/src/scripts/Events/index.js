if (!localStorage.getItem("user")) {
    window.location.href = '../index.html'
}

function dataAtualFormatada(data) {
    var data = new Date(data),
      dia = data.getDate().toString().padStart(2, '0'),
      mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
      ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
}

//Inicio coleta de dados evento
async function loadevent() {

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    let value = params.id; // "some_value"

    url = `https://revoapp.up.railway.app/event/${value}`


    var response = await fetch(url)
    var dados = await response.json()

    //Inicio Local Storage
    localStorage.setItem("event", JSON.stringify(dados))
    const eventData = JSON.parse(localStorage.getItem("event"))
 

    //Fim Local Storage    

    var nome = dados.name
    var desc = dados.description
    var hour = dados.time
    var type = dados.public
    if (type === false) {
        type = "PÚBLICO"
    } else {
        type = "PRIVADO"
    }

    var data = dados.date

    document.getElementById('title').innerHTML = nome
    document.getElementById('details').innerHTML = desc
    document.getElementById('hour').innerHTML = `<b>HORÁRIO:</b> ${hour}`
    document.getElementById('type').innerHTML = `<b>TIPO:</b> ${type}`

    //const events = JSON.parse(localStorage.getItem("event"))
    let metaMonetaria = dados.goals[0].money
    let metaMaterial = dados.goals[0].material

    document.getElementById('metaModal').innerHTML = `<h4 id="metaMonetaria">Meta monetária: R$${metaMonetaria}</h4>`

    document.getElementById('metaModal').innerHTML += `
                <h4 id="metaMaterial">Meta material: </h4>
    `
    metaMaterial.forEach((material) => {document.getElementById('metaMaterial').innerHTML += `${material.material_name} `})

    const user = JSON.parse(localStorage.getItem('user'))

    document.getElementById('username').innerText = user.name
    document.getElementById('friend_number').innerText = user.friends?.length


    if(user.id !== eventData.authorId) {
        document.getElementById("openInvite").style.display = "none"
    }

    if(!eventData.public) {
        document.getElementById("Presence").style.display = "none"
    }

    document.getElementById('hour').innerHTML = `<b>HORARIO:</b> ${eventData.time}`
    document.getElementById("place").innerHTML = `<b>LOCAL:</b> ${eventData.place}`
    document.getElementById('contacts').innerHTML = `<b>CONTATOS:</b> ${eventData.cellphone}`
    document.getElementById("type").innerHTML = `<b>TIPO:</b> ${eventData.public ? "PUBLICA" : "PRIVADO"}`
    document.getElementById("date").innerHTML = `<b>DATA:</b> ${dataAtualFormatada(eventData.date)}`
    document.getElementById("participants").innerHTML = `<b>PARTICIPANTES:</b> ${eventData.participants.length}`

    user.friends.forEach(friend => {
        document.getElementById('search-friends').innerHTML += `
            <button class="Friend" onclick={inviteFriend('${friend.userId}')}>
                <h2 class="name">${friend.name}</h3>
                <span id="idFriend">#${friend.userId}</span>
            </button>
        `
    })

}

//Fim coleta de dados evento

// Inicio modal patrocionio

const openModalButton = document.querySelector("#openModal");
const closeModalButton = document.querySelector("#closeModal");

const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

toggleModal = () => {
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
}

[openModalButton, closeModalButton, fade].forEach(element => {
    element.addEventListener("click", () => toggleModal());
});




// Fim modal


//Início Patrocínio

var monetario = document.getElementById('monetario').value
var material = document.getElementById('material').value

async function patrocinar() {

    var monetario = document.getElementById('monetario').value
    var material = document.getElementById('material').value

    const materialArray = material.split(",")

    const user = JSON.parse(localStorage.getItem("user"))
    const event = JSON.parse(localStorage.getItem("event"))

    const url = `https://revoapp.up.railway.app/event/${event.id}/author/${event.authorId}/sponser_from/${user.id}`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            money: Number(monetario),
            material: materialArray
        })
    })
    const message = await response.json()

    alert(message.Message)
}

//Fim Patrocínio

// Inicio Modal Convidar Amigo

const openInviteButton = document.querySelector("#openInvite");
const modalInvite = document.querySelector("#modalInvite");
const fadeInvite = document.querySelector("#fadeInvite");

const toggleInvite = () => {
    [modalInvite, fadeInvite].forEach((element) => element.classList.toggle("hideInvite"));
}

[openInviteButton, fadeInvite].forEach((element) => {
    element.addEventListener("click", () => toggleInvite())
});

async function PesquisaAmigo(event) {
    event.preventDefault()

    const friend = document.getElementById("search").value

    if(friend.trim() === ""){
        return alert("Insira o nome do usuário")
    } 

    const url = `https://revoapp.up.railway.app/user/search`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: friend,

        })
    })
    const data = await response.json()

    console.log(data)
    
    document.getElementById("search-users").innerHTML = ``
    
    if(data.length === 0) {

        document.getElementById("search-users").innerHTML = `
            <button class="Friend"}>
                <h2 class="name">Usuário não encontrado</h2>
            </button>   
        `
        return
    }

    data.forEach(users => {
        document.getElementById("search-users").innerHTML += `
            <button class="Friend" onclick={inviteFriend('${users.id}')}>
                <h2 class="name">${users.name}</h2>
                <span id="idFriend">#${users.id}</span>
            </button>   
        `
    })
    
}

async function inviteFriend(friendId) {
    console.log(friendId)
    const user = JSON.parse(localStorage.getItem("user"))
    const event = JSON.parse(localStorage.getItem("event"))

    const url = `https://revoapp.up.railway.app/user/${user.id}/invite/${friendId}/to/${event.id}`

    await fetch(url)

    alert("Convite enviado com sucesso!")
}

async function handleParticipate() {
    const user = JSON.parse(localStorage.getItem("user"))
    const event = JSON.parse(localStorage.getItem("event"))

    const url = `https://revoapp.up.railway.app/event/${event.id}/participate/${user.id}`

    await fetch(url)

    alert("Participando do evento")
}


// Fim Modal Convidar Amigo