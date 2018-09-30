/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';
import AlbumCover from './AlbumCover';

const apiToken = 'BQCDG4JYf6mDRtAlezMPFz8Nuwd9aK1tr6oQ9BuxmhE-QxdczAeouaLlc6l7kjNzy21a86BX6R10Dli5TuDjYUQChunPS0ujb--wr_owETIEhwpYZUKEKKfatj6vvJvIfIppImsA_yUsXbBzkc1bz_mbxtuatgXGKsxkfxTlmYrA';

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

class App extends Component {

  constructor() {
    super();
    this.state = {
      tracks: [],
      text: " ",
      songsLoaded:false
    };
  }
componentDidMount() {
  this.setState({ text: "Bonjour" })
  fetch('https://api.spotify.com/v1/me/tracks', {
  method: 'GET',
  headers: {
   Authorization: 'Bearer ' + apiToken,
  },
})
  .then(response => response.json())
  .then((data) => {
    this.setState({tracks:data.items})
    console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data.items);
    this.setState({songsLoaded:true})
  })
};
  render() {

    if (this.state.songsLoaded) {
      const previewUrl = this.state.tracks[0].track.preview_url;
      let track0 = this.state.tracks[0];
      let track1 = this.state.tracks[1];
      let track2 = this.state.tracks[2];

      return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Coding Sunday !</h1>
        </header>
        <div className="App-images">
        <AlbumCover track={this.state.tracks[0]}/>
          <p> Nombre de chansons disponibles: {this.state.tracks.length}</p>
          <p> Titre de la premiere chanson: {this.state.tracks[0].track.name}</p>
          <Sound url={previewUrl} playStatus={Sound.status.PLAYING}/>
        </div>
        <div className="App-buttons">
        <Button>{track0.track.name}</Button>
        <Button>{track1.track.name}</Button>
        <Button>{track2.track.name}</Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Coding Sunday !</h1>
        </header>

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
