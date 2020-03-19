import React from 'react';
import { Form, Row, Col, Tooltip } from 'react-bootstrap'
import './App.css';
import PhotosGrid from './components/Photos-grid/Photos-grid'
import { logo } from './logo.svg'
import axios from 'axios';
import _ from 'lodash';
import Loader from './components/Loader/Loader'
const initialState = { value: '', photos: [], loading: false, apiPageCount: 1, totalPages: 1, scrolled: false };
class App extends React.Component {
  constructor() {
    super();
    this.state = { ...initialState, history: [] }
  }

  fetchPhotos = _.debounce((flag) => {
    axios.get('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3b8da0e5c9ae44b2d9c8f009a21f8929&text=' + this.state.value + '&format=json&safe_search=3&nojsoncallback=1&page=' + this.state.apiPageCount)
      .then(response => {
        if (response.data.photos) {
          this.setState({ photos: flag ? [...response.data.photos.photo] : [...this.state.photos, ...response.data.photos.photo], loading: false, totalPages: response.data.photos.pages, scrolled: false })
          if (flag && this.state.value.length > 2) { this.saveToStorage(); this.recover(); }
        }
      });
  }, 1000)

  handleChange = (e) => {
    this.setState({ value: e.target.value });
    if (e.target.value) {
      this.setState({ loading: true });
      this.fetchPhotos(true);
    }
    else {
      this.setState(initialState);
    }
  }

  updateSearch = (value) => {
    this.setState({ value: value, loading: true });
    this.fetchPhotos(true);
  }

  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.handleChange(e);
    }
  }

  isInViewport = (offset = 0) => {
    let elements = document.getElementsByClassName('photos');
    let element = elements[elements.length - 1];
    if (!element) return false;
    const top = element.getBoundingClientRect().top;
    return (top + offset) >= 0 && (top - offset) <= window.innerHeight;
  }


  handleScroll = (event) => {
    if (this.isInViewport() && this.state.apiPageCount <= this.state.totalPages && !this.state.scrolled) {
      this.setState({ apiPageCount: this.state.apiPageCount + 1, loading: true, scrolled: true });
      this.fetchPhotos();
      return;
    }
  }

  recover() {
    //parse the localstorage value
    let data = JSON.parse(localStorage.getItem('history'));
    if (data) {
      this.setState({ history: data.length > 5 ? data.reverse().splice(0, 5) : data.reverse() });
    }
  }

  saveToStorage = () => {
    //local storage only takes in key value pair so you would have to serialize it.
    let history = this.state.history ? [...this.state.history] : [];

    if (!history.includes(this.state.value)) { history.push(this.state.value); }

    localStorage.setItem('history', JSON.stringify(history));
  }

  clearStroage = () => {
    localStorage.clear();
    this.setState({ history: [], value: '', photos: [] });
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
    this.recover();
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
              {this.state.history.length > 0 ? <div className="pt-2">
                <h6 className="p-head">Previous Search: </h6>
                {this.state.history.map((x) => <p key={x} className="p-tags mx-1" onClick={() => this.updateSearch(x)}>{x}</p>)}
                <i className="material-icons clear-tags m-2" onClick={() => this.clearStroage()}>close</i>
              </div> : null}
            </Col>
          </Row>
        </header>
        <div className="App-body mt-3">
          <PhotosGrid photos={this.state.photos} loading={this.state.loading} page={this.state.apiPageCount}></PhotosGrid>
          {this.state.loading ? <Loader className="loader-div"></Loader> : null}
        </div>
      </div>
    );
  }
}

export default App;
