import React, { Component } from 'react';
import AlbumCover from './AlbumCover'
class TrackDescription extends Component {
  render() {
    return(
      <div class="track">
        <div class="track__info">
          <div class="track-info__line">
            <span class="track-info__label">Name:</span><span class="track-info__value">{this.props.track.track.name}</span>
          </div>
          <div class="track-info__line">
            <span class="track-info__label">Album:</span><span class="track-info__value">{this.props.track.track.album.name}</span>
          </div>
          <div class="track-info__line">
            <span class="track-info__label">Author(s):</span> <span class="track-info__value">{this.props.track.track.artists.map((author) => {
              return author.name
            })}</span>
          </div>
        </div>
        <div class="track__cover">
          <AlbumCover track={this.props.track} width="200"/>
        </div>
      </div>
    )
  }
}
export default TrackDescription;
