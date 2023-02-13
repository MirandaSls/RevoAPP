var logado = false

if (!localStorage.getItem("user")) {
    window.location.href = '../index.html'
}

async function handleChange(event) {
    event.preventDefault()
    const id = "2dce98aa-8ec3-40b5-aa24-77c98f320ac9"
    let name = document.getElementById("name").value
    let password = document.getElementById("senha").value
    if (name.trim() === undefined || password.trim() === undefined) {
        alert("Preencha pelo menos um campo.")
    }
    const user = await fetch(`https://revoapp.up.railway.app/user/${id}`, {
        method: "put",
        body: { name: name, password: password }
    })
    console.log(user)
}



// Pegar dados do localStorage

let receber = JSON.parse(localStorage.getItem('user'))

var nameUser = receber.name
var idUser = receber.id
var friendsUser = receber.friends.length
var emailUser = receber.email

document.getElementById('name').innerHTML = nameUser
document.getElementById('name2').innerHTML = nameUser
document.getElementById('name3').placeholder = nameUser
document.getElementById('idUser').placeholder = idUser
document.getElementById('friends').innerHTML = `<h2>Amigos: ${friendsUser}</h2>`
document.getElementById('friends2').innerHTML = friendsUser
document.getElementById('email').placeholder = emailUser

async function adicionarAmigo() {
    let nomeAmigo = document.getElementById("idAdicionarAmigo").value
    if (nomeAmigo === "") {
        return alert("Insira o id de usuário corretamente")
    } else {
        const url = `https://revoapp.up.railway.app/user/search`

        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nomeAmigo,

            })
        })

        let dados = await response.json()
        console.log(dados)


        if (dados.length === 0) {
            document.getElementById("resultados").innerHTML =
            `<div class="lista">
                <label >Nenhum usuario encontrado</label>
            </div>`
        } else {
            for (let i = 0; i < dados.length; i++) {
                document.getElementById("resultados").innerHTML += `
                <div class="lista">
                    <button onclick="selecionarUsuario('${dados[i].id}')"><label>${dados[i].name}</label></button>
                </div>
                `
            }
        }
    }



}

async function selecionarUsuario(userId) {
    let receber = JSON.parse(localStorage.getItem('user'))
    console

    const url = `https://revoapp.up.railway.app/user/${receber.id}/add_friend/${userId}`

    await fetch(url)
    window.location.reload()
}




async function getUser() {

    let receber = JSON.parse(localStorage.getItem('user'))

    let idUser = receber.id

    url = `https://revoapp.up.railway.app/user/${idUser}`


    let response = await fetch(url)
    let user = await response.json()

    return user

}


async function Load() {
    let user = await getUser();

    console.log(user)

    if (user.friends.length === 0) {
        document.getElementById("todosAmigos").innerHTML = `
        <div class="naoEvento">
             <label> Você não tem amigos >:(  </label>
        </div>
        `
    } else {
        for (let i = 0; i < user.friends.length; i++) {
            document.getElementById("todosAmigos").innerHTML += `
        <div class="lista">
            <div>
                <label for="nomeAmigo1">${user.friends[i].name} </label>
            </div>
            <div>
                <label for="idAmigo1">${user.friends[i].id}</label>
            </div>
        </div>
        `}
    }

    if (user.notifications.length === 0) {
        document.getElementById("areaNotif").innerHTML = `
        <div class="naoEvento2">
            <p> Você não tem notificação </p>
        </div>
        `
    } else {
        for (let i = 0; i < user.notifications.length; i++) {
            if (user.notifications[i].just_for_show) {
                document.getElementById("areaNotif").innerHTML += `
                <div class="textoNotif">
                    <button onclick="fechaNotif('${user.notifications[i].id}')">X</button>
                    <p>${user.notifications[i].message}</p>
                </div>
                `
            } else {
                document.getElementById("areaNotif").innerHTML += `
                    <div class="itensNotif">
                        <div class="textoNotif">
                            <button onclick="fechaNotif('${user.notifications[i].id}')">X</button>
                            <p>${user.notifications[i].message}</p>
                        </div>
                        <div class="escolha">
                            <button onclick="Aceitar('${user.notifications[i].accepte_route}','${user.notifications[i].id}')">
                                <img src="../assets/Confiamar.png" alt="botaoConfirmar" />
                            </button>
                            <button onclick="Recusar('${user.notifications[i].recuse_route}','${user.notifications[i].id}')">
                                <img src="../assets/Cancelar.png" alt="botaoCancelar" />
                            </button>

                        </div>
                    </div>
                `
            }
        }
    }

    if (user.events.length === 0) {
        document.getElementById("areaEvento").innerHTML = `
        <div class="naoEvento">
            <label for"> Você não tem eventos</label>
        </div>
        `
    } else {
        for (let i = 0; i < user.events.length; i++) {
            document.getElementById("areaEvento").innerHTML += `
                <div class="lista">
                    <label for">${user.events[i].name}</label>
                </div>
            `
        }
    }

    if (user.participations.length === 0) {
        document.getElementById("areaParticipa").innerHTML = `
        <div class="naoEvento">
            <label for"> Você não participa de nenhum evento</label>
        </div>
        `
    } else {
        for (let i = 0; i < user.participations.length; i++) {

            document.getElementById("areaParticipa").innerHTML += `
                <div class="lista">
                    <label for">${user.participations[i].eventName}</label>
                </div>
            `
        }
    }

}

async function Aceitar(rota, id) {
    await fetch(rota)
    fechaNotif(id)
}

async function Recusar(rota, id) {
    await fetch(rota)
    fechaNotif(id)
}

async function fechaNotif(id) {
    let dados = await getUser();
    await fetch(`https://revoapp.up.railway.app/user/${dados.id}/delete/${id}`, {
        method: "delete"
    })
    window.location.reload()
}


//function adicionarAmigo
const openModalButton = document.querySelector("#open-modal");
const closeModalButton = document.querySelector("#close-modal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const toggleModal = () => {
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
};

[openModalButton, closeModalButton, fade].forEach((el) => {
    el.addEventListener("click", () => toggleModal());
});