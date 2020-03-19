import React, { Component } from 'react';
import './Photos-grid.css'
import PhotoModal from '../photo-modal/Photo-modal'

export default class PhotosGrid extends Component {
    constructor() {
        super();
        this.state = { modalShow: false, setModalShow: false, selected: null }
        // this.setModalShow = this.setModalShow.bind(this)
    }

    setModalShow = (v, photo) => {
        this.setState({modalShow: v, selected: photo});
    }
    
    render() {
        // const 

        return (
            <div className="PhotosGrid">
                {this.props.photos.length === 0 ? <h2>No photo found</h2> : this.props.photos.map((i) => <img key={i.id} className="m-2 photos" src={'https://farm' + i.farm + '.staticflickr.com/' + i.server + '/' + i.id + '_' + i.secret + '_z.jpg'} alt={i.title.split(' ')[0]} width="220px" height="220px" onClick={() => this.setModalShow(true, i)} />)}
                {/* Loading image to show on scroll */}
                {this.props.loading && this.props.page > 1 ? <img src={require('./loading.gif')} className='inline' width="420px" height="220px" /> : null}
                <PhotoModal
                    show={this.state.modalShow}
                    photo={this.state.selected}
                    onHide={() => this.setModalShow(false)}
                />
            </div>
        )
    }
}