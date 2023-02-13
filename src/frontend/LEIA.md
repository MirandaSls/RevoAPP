# DOCUMENTAÇÃO DO FRONTEND

## Como usar o Sass
Antes de tudo.... Porque? kkkkk
Sass é um CSS com *superpowers*, voçê não precisa usar classes ou id se quiser, isso vai facilitar muito o html e css tambem :).   

Primeiro passo: entra na parte de extenções
Segundo passo: baixa a extenção *Live Sass Compiler*
Terceiro passo: ativa o *Watch Sass* no cantinho

PS: mas se quiser usar CSS puro ou Bootstrap avontade, o importante é a tela fica bonita.

Exemplo:
```css
.container {
    h1{
        display: block;
    }
}
```

## Como usar o Axios
Axios vai ajuda na hora de conectar com o backend, ele ja vem com a URL.

Para usar no JS é preciso importar,
depois colocar qual metodo deseja usar (GET, POST, PUT, PATCH, DELETE)
e colocar os dados necessarios.

Exemplo:
Criando um usuário na pasta scripts/index.js, a response é o backend que manda.
```js
import {api} from "../utils/api";

api.post("users", {
    name: "Roberto Carlos",
}).then((response) => { console.log(response)})

api.get("event").then((response) => {console.log(response)}) //Hello world!

```