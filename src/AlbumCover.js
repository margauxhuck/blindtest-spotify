import React, { Component } from 'react';
class AlbumCover extends Component {
  render() {
    return(
      <img src={this.props.track.track.album.images[0].url} style={{ width: 400, height: 400 }} />
    )
  }
}
export default AlbumCover;
