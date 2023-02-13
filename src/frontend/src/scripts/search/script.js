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


async function loadevent() {

  const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  let value = params.name; // "some_value"
  console.log(value)

  url = `https://revoapp.up.railway.app/event/search/${value}`

  var response = await fetch(url)
  var event = await response.json()

  console.log(event)

  for (let i = 0; i < event.length; i++) {

      document.getElementById('event-container').innerHTML += ` 
      
      <section>

        <a href="./events.html?id=${event[i].id}">
          <img src="../assets/Banner.png" alt="Banner" />
        
          <div>
            <h1>${event[i].name}</h1>
            <p>
            ${event[i].description}
            </p>

            <div>
              <div>
                <p>Data: ${dataAtualFormatada(event[i].date)}</p>
                <p>Local: ${event[i].place}</p>
                <p>Horário: ${event[i].time}</p>
              </div>
              <img src="../assets/Friends_count.png" />
            </div>
          </div>
        </a>
      
      </section>
    `

  }

  const user = JSON.parse(localStorage.getItem('user'))

  document.getElementById('username').innerText = user.name
  document.getElementById('friends').innerText = user.friends?.length
}

function fazPesquisa(event) {
    event.preventDefault()

    let query = document.getElementById('pesquisa').value

    window.location.href = `./search.html?name=${query}`

    // if (query != "") {
    //   url = `http://127.0.0.1:5500/src/frontend/src/pages/search.html?name=${query}`;
    // }
    // else {
    //   url = "http://127.0.0.1:5500/src/frontend/src/pages/search.html?name=a";

}