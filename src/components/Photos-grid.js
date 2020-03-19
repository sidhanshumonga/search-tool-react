import React, { Component } from 'react';
import { three } from './three.gif';

export default class PhotosGrid extends Component {
    render() {
        return (
            <div className="PhotosGrid">
                {}
                {this.props.photos.length === 0 ? <h2>No photo found</h2> : this.props.photos.map((i) => <img className="mx-2" src={'https://farm' + i.farm + '.staticflickr.com/' + i.server + '/' + i.id + '_' + i.secret + '_z.jpg'} alt="Logo" width="222px" height="222px" />)}
            </div>
        )
    }
}