import React from 'react';
import { Form, Row, Col } from 'react-bootstrap'
import './App.css';
import PhotosGrid from './components/Photos-grid/Photos-grid'
import { logo } from './logo.svg'
import axios from 'axios';
import _ from 'lodash';
import Loader from './components/Loader/Loader'

class App extends React.Component {

  constructor() {
    super();
    this.state = { value: '', photos: [], loading: false, apiPageCount: 1, totalPages: 1, scrolled: false }
  }

  fetchPhotos = _.debounce(() => {
    axios.get('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3b8da0e5c9ae44b2d9c8f009a21f8929&text=' + this.state.value + '&format=json&nojsoncallback=1&page=' + this.state.apiPageCount)
      .then(response => {
        this.setState({ photos: [...this.state.photos, ...response.data.photos.photo], loading: false, totalPages: response.data.photos.pages, scrolled: false  })
      });
  }, 1000)

  handleChange = (e) => {
    this.setState({ value: e.target.value });
    if (e.target.value) {
      this.setState({ loading: true });
      this.fetchPhotos();
    }
    else {
      this.setState({ photos: [], loading: false });
    }
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log(e);
      this.handleChange(e);
    }
  }

  isInViewport = ( offset = 0) => {
    let elements = document.getElementsByClassName('photos');
    let element = elements[elements.length-1];
    if (!element) return false;
    const top = element.getBoundingClientRect().top;
    return (top + offset) >= 0 && (top - offset) <= window.innerHeight;
  }


  handleScroll = (event) => {
    if(this.isInViewport() && this.state.apiPageCount <= this.state.totalPages && !this.state.scrolled){
      this.setState({ apiPageCount: this.state.apiPageCount+1, loading: true, scrolled: true});
      this.fetchPhotos();
      return;
    }
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Row className="search-row">
            <Col>
              <h3 className="my-3">Search Photos</h3>
              <Form>
                <Form.Control className="search-input" placeholder="Search images..." value={this.state.value} onChange={this.handleChange} onKeyDown={this._handleKeyDown} />
              </Form>
            </Col>
          </Row>
        </header>
        <body className="App-body mt-3">
          <PhotosGrid photos={this.state.photos} loading={this.state.loading} page={this.state.apiPageCount}></PhotosGrid>
          {this.state.loading ? <Loader className="loader-div"></Loader> : null}
        </body>
      </div>
    );
  }
}

export default App;
