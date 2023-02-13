"use strict";


class Menu extends React.Component {
    constructor(props) {
      super(props);
    }
  
    render() {

      return (
        <div id="menu-container">
          <header id="menu-content">
            <a href="./home.html">
              <img src="../assets/Logo.png" />
            </a>

            <a href="./user.html">
              <div>
                <h2>{this.props.user.name}</h2>

                <div id="user-info">
                  <span>{this.props.user.friends?.length}</span>
                  <img src="../assets/Friends.png" />
                </div>

              </div>

              <img src="../assets/Profile.png" />
            </a>
          </header>
        </div>
      );
    }
}

class Search extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      userInput: ""
    }
  }

  handleUserChange(e) {
    this.setState({userInput: e.target.value});
  }

  handleSearch(e) {
    e.preventDefault();
    console.log(this.state.userInput)

    window.location.href = `./search.html?name=${this.state.userInput}`

  }

  render(){

    return(
      <div className="max-width" id="search-container">
        <form onSubmit={(e) => {this.handleSearch(e)}}>
          <div>
            <input type="text" placeholder="Procurar evento..." onChange={(e) => this.handleUserChange(e)}/>
            <img src="../assets/Search_icon.png" />
          </div>

          <a href="./createEvent.html">
            <button type="button">
                Criar evento
            </button>
          </a>

        </form>
      </div>
    )
  }
}


class Event extends React.Component{
  constructor(props){
    super(props);
  }


  dataAtualFormatada(data) {
    var data = new Date(data),
      dia = data.getDate().toString().padStart(2, '0'),
      mes = (data.getMonth() + 1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
      ano = data.getFullYear();
    return dia + "/" + mes + "/" + ano;
  }

  render(){
    return(
      <section>
        
        <a href={`./events.html?id=${this.props.event.id}`} className="card">
          
          <img src="../assets/Banner.png" alt="Banner" />
          
          <div>
            <h1>{this.props.event.name}</h1>

            <p>
              {this.props.event.description.split(" ", 20).join(" ")}...
            </p>

            <div>
              <div>
                <p>Date: {this.dataAtualFormatada(this.props.event.date)}</p>
                <p>Local: {this.props.event.place}</p>
                <p>Horário: {this.props.event.time}</p>
              </div>
              <img src="../assets/Friends_count.png" />
            </div>
          </div>

        </a>
                      
      </section>
    )
  }
}


class Events extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){

    if(this.props.events?.length === 0){
      return(
        <div className="max-width" id="event-container">
        <div id={this.props.public ? "public" : "private"}>
          <h2>{this.props.public ? "PUBLICOS" : "PRIVADOS"}</h2>
        </div>

        <h3 style={{textAlign: "center"}}>
          Ainda não existem eventos
        </h3>
      </div>
      )
    }


    return(
      <div className="max-width" id="event-container">
        <div id={this.props.public ? "public" : "private"}>
          <h2>{this.props.public ? "PUBLICOS" : "PRIVADOS"}</h2>
        </div>
        
        {
          this.props.events.map((event) => (
            <Event public event={event} key={event.id} />
          ))
        }
      
      </div>
    )
  }
}

class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      publicEvents: [],
      privateEvents: [],
      user: []
    };
  }

  handleEventsData = async () => {
    const data = await fetch('https://revoapp.up.railway.app/event')
    const body = await data.json()

    const publicEvents = body.filter((event) => {
      return event.public === true;
    })

    const privateEvents = body.filter((event) => {
      return event.public === false;
    })

    this.setState({publicEvents: publicEvents, privateEvents: privateEvents})
  }

  componentDidMount() {
    this.handleEventsData()

    if (!localStorage.getItem("user")) {
      window.location.href = '../index.html'
    } else {
      this.setState({user: JSON.parse(localStorage.getItem("user"))})
    }
  
  }

  render(){


    return(
      <>
        <Menu user={this.state.user} />

        <Search />

        <div className="events-container">
          <Events public events={this.state.publicEvents}/>
          <div id="divider" />
          <Events public={false} events={this.state.privateEvents}/>
        </div>
      </>
    )
  }
}

function App() {
  return <Home/>
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
