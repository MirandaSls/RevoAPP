
async function fazPost(url, body) {

    let request = new XMLHttpRequest()
    request.open("POST", url, true)
    request.setRequestHeader("Content-type", "application/json")
    request.send(JSON.stringify(body))

    request.onload = function () {

        const teste = this.responseText

        if (teste === '{"Message":"Usuário não existente"}') {
            alert('Usuário não existente')
        } else if (teste === '{"Message":"Senha incorreta"}') {
            alert('Senha incorreta')
        } else {
            window.location.href = './pages/user.html'
        }

        const userData = JSON.parse(localStorage.getItem("user"))
        if (userData == null) {
            localStorage.setItem("user", "[]")
            userData = []
        }

        var aux = JSON.parse(teste)
        localStorage.setItem("user", JSON.stringify(aux))
        
    }
}

var receber = localStorage.getItem("user")

var nameUser = receber.name



async function entrar(event) {
    event.preventDefault()

    var data
    var email = document.getElementById('email').value;
    var senha = document.getElementById('senha').value;

    if ((email.trim() === "") || (senha.trim() === "")) {
        alert('Preencha os dados corretamente!');
    }

    const url = `https://revoapp.up.railway.app/user/login`

    var body = {
        email: email,
        password: senha
    }

    fazPost(url, body)
}

