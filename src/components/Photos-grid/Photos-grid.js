import React, { Component } from 'react';

export default class PhotosGrid extends Component {
    render() {
        return (
            <div className="PhotosGrid">
                {this.props.photos.length === 0 ? <h2>No photo found</h2> : this.props.photos.map((i) => <img className="m-2 photos" src={'https://farm' + i.farm + '.staticflickr.com/' + i.server + '/' + i.id + '_' + i.secret + '_z.jpg'} alt={i.title.split(' ')[0]} width="220px" height="220px"/>)}
            </div>
        )
    }
}