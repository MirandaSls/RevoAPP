/*async function fazPost(url, body) {
    
    let request = new XMLHttpRequest()
    request.open("POST", url, true)
    request.setRequestHeader("Content-type", "application/json")
    request.send(JSON.stringify(body))

    request.onload = function () {

        const teste = this.responseText
        console.log(teste)

        if (teste === '{"Message":"Usuário não existente"}') {
            alert('Usuário não existente')
        } else if (teste === '{"Message":"Senha incorreta"}') {
            alert('Senha incorreta')
        } else {
            window.location.href = '/src/frontend/src/pages/user.html'
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
console.log(nameUser)
*/



async function cadastrar(event) {
    event.preventDefault()
    var user;

    const nome = document.getElementById("nome").value
    const email = document.getElementById("email").value
    const senha = document.getElementById("senha").value
    const confSenha = document.getElementById("confSenha").value

    if (senha.trim() != confSenha.trim()) {
        window.alert("Senhas não coincidem")
    } else if ((nome.trim() === "") || (email.trim() === "") || (senha.trim() === "") || (confSenha.trim() === "")) {
        window.alert("Tenha certeza de preencher todos os campos")
    } else {

        const url = `https://revoapp.up.railway.app/user/singup`

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: nome,
                email: email,
                password: senha
            }),
        })

        window.location.href = '../index.html'

}  }