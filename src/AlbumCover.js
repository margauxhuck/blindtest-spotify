import React, { Component } from 'react';
class AlbumCover extends Component {
  render() {
    return(
      <img src={this.props.track.track.album.images[0].url} style={{ width: this.props.width + 'px', height: this.props.width + 'px' }} />
    )
  }
}
export default AlbumCover;
