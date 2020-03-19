import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import './Photo-modal.css'

export default class PhotoModal extends Component {
    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {this.props.photo ? this.props.photo.title : null}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {this.props.photo ? <img src={'https://farm' + this.props.photo.farm + '.staticflickr.com/' + this.props.photo.server + '/' + this.props.photo.id + '_' + this.props.photo.secret + '_z.jpg'} alt={this.props.photo.title.split(' ')[0]} /> : null}
                </Modal.Body>
            </Modal>
        )
    }
}