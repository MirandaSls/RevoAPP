if (!localStorage.getItem("user")) {
    window.location.href = '../index.html'
}

const user = JSON.parse(localStorage.getItem('user'))

document.getElementById("username").innerText = user.name
document.getElementById("friend").innerText = user.friends?.length

async function criar() {

    var name = document.getElementById('nome').value
    var descricao = document.getElementById('desc').value
    var date = Date(document.getElementById('data').value)
    var time =document.getElementById('hour').value
    var local = document.getElementById('local').value
    var phone = document.getElementById('tel').value
    var monetaria = document.getElementById('money').value
    var material = document.getElementById('material').value
    var tipo = document.getElementById('toggle').checked

    var receber = JSON.parse(localStorage.getItem("user"))
    var idUser = receber.id
    
    const materialArray = material.split(",")

    if ((name == "") || (descricao == "") || (date == "") || (time == "") || (local == "") || (phone == "") || (monetaria == "")) {
        alert('Preencha os dados corretamente!')
    } else {

        const url = `https://revoapp.up.railway.app/event/create`

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                description: descricao,
                public: tipo,
                date: date,
                place: local, 
                cellphone: phone,
                time: time,
                money: Number(monetaria),
                material:  materialArray,                 
                userId: idUser

            }),
        })
            .then((response) =>
                response.json()
            )
            .then(data => {
                alert("Evento criado")
                window.location.href = './home.html'
            })

            

    }

}

