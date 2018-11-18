/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import AlbumCover from './AlbumCover';
import TrackDescription from './TrackDescription';
import ReactQueryParams from 'react-query-params';
var parse = require('url-parse')

const status = {
  WAITING: "waiting",
  ONGOING: "ongoing",
  FIRST: "first"
}

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

function filterTracks(tracks) {
  return tracks.filter(track => null !== track.track.preview_url)
}

class App extends ReactQueryParams{

  constructor() {
    super();
    this.state = {
      tracks: [],
      currentTrack:{},
      text: " ",
      songsLoaded:false,
      timeout: null,
      gameStatus: status.FIRST,
      propositions: []
    };
  }

  componentDidMount() {
    var params = [];
    var query = window.location.hash.substr(1)
    console.log(query);
    var pairs = query.split('&');
    for(var i in pairs){
      var couplet = pairs[i].split("=");
      params[couplet[0]] = couplet[1];
    }
    console.log(params['access_token']);
    if (!params['access_token']){
      window.location.href='https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=30e6b2b7ca184b9ebb24e839e7c9a771' +
      '&scope=user-library-read' +
      '&redirect_uri=' + encodeURIComponent('https://margauxhuck.github.io/blindtest-spotify');
    } else {
      this.setState({ text: "Bonjour" })
      const playlistId = "37i9dQZF1DWXncK9DGeLh7"
      const playlistUrl = "https://api.spotify.com/v1/playlists/"+playlistId+"/tracks"
      const tracksUrl = "https://api.spotify.com/v1/me/tracks?limit=50"
      fetch(tracksUrl, {
        method: 'GET',
        headers: {
         Authorization: 'Bearer ' + params['access_token'],
        },
      })
      .then(response => response.json())
      .then((data) => {
        console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
        const tracks = filterTracks(data.items);
        this.setState({tracks: tracks});
        this.setState({songsLoaded:true});
      })
    };
  }



  prepareGame() {
    const randomNumber = getRandomNumber(this.state.tracks.length);
    const currentTrack = this.state.tracks[randomNumber];
    const timeout = setTimeout(() => {
      this.noAnswerInTime()
    },
    30000);

    let track0 = currentTrack;
    let track1 = this.state.tracks[getRandomNumber(this.state.tracks.length)];
    let track2 = this.state.tracks[getRandomNumber(this.state.tracks.length)];
    const tableau =[track0,track1,track2];
    const ordre  = shuffleArray(tableau);

    this.setState({
      currentTrack: currentTrack,
      timeout: timeout,
      gameStatus: status.ONGOING,
      propositions: ordre
    })
  }

  gameWon() {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout)
    };
    this.setState({gameStatus: status.WAITING});
  }

  noAnswerInTime() {
    return swal('You suck', 'You ran out of time', 'error').then(this.setState({gameStatus: status.WAITING}));
  }

  checkAnswer(id){
    if (id === this.state.currentTrack.track.id){
      return swal('Bravo', 'Tu es le meilleur', 'success').then(this.gameWon());
    }
    return swal('You suck', 'Better luck next time', 'error');
  }

  render() {
    const header = (<header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <h1 className="App-title">Coding Sunday !</h1>
      </header>);

    if (this.state.songsLoaded) {
      if (this.state.gameStatus === status.FIRST) {
        return (
          <div className="App">
            {header}
            <div className="App-images">
              <p> Nombre de chansons disponibles: {this.state.tracks.length}</p>
              <Button onClick={()=>this.prepareGame()}>Start a game ?</Button>
            </div>
          </div>
        );
      }

      const previewUrl = this.state.currentTrack.track.preview_url;
      const song = <Sound url={previewUrl} playStatus={Sound.status.PLAYING}/>;

      const body = <TrackDescription track={this.state.currentTrack}/>

      const button = <Button onClick={()=>this.prepareGame()}>Ready for the next track ?</Button>

      const buttons = (<div className="App-buttons">
      {
        this.state.propositions.map(item => (
          <div class="proposition">
            <div class="proposition__cover">
              <AlbumCover track={item} width='100'/>
            </div>
            <div class="propostion__button">
              <Button onClick={()=>this.checkAnswer(item.track.id)}>{item.track.name}</Button>
            </div>
          </div>
        ))
      }
      </div>);

      return (
        <div className="App">
          {header}
          <div className="App-images">
            <Sound url={previewUrl} playStatus={Sound.status.PLAYING}/>
            <div>
              {this.state.gameStatus === status.WAITING ? body : null}
            </div>
            <div>
              {this.state.gameStatus === status.WAITING ? button : null}
            </div>
          </div>
          {this.state.gameStatus === status.ONGOING ? buttons : null}
        </div>
      );
    } else {
      return (
        <div className="App">
          {header}

          <div className="App-images">
          <img src={loading} className="App-logo" alt="logo"/>
          </div>
          <div className="App-buttons">
          </div>
        </div>
      );
    }
  }

}

export default App;
