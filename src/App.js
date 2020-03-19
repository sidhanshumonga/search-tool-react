import React from 'react';
import { Form, Row, Col } from 'react-bootstrap'
import './App.css';
import PhotosGrid from './components/Photos-grid/Photos-grid'
import axios from 'axios';
import _ from 'lodash';
import Loader from './components/Loader/Loader'

const initialState = { value: '', photos: [], loading: false, apiPageCount: 1, totalPages: 1, scrolled: false };

class App extends React.Component {
  constructor() {
    super();
    this.state = { ...initialState, history: [] }
  }

  // method to fetch photos from flickr API
  // parameters used : { text to search, pagecount }
  // debounce : to avoid multiple calls to API at same time
  fetchPhotos = _.debounce((flag) => {
    axios.get('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3b8da0e5c9ae44b2d9c8f009a21f8929&text=' + this.state.value + '&format=json&safe_search=3&nojsoncallback=1&page=' + this.state.apiPageCount)
      .then(response => {
        if (response.data.photos) {
          // flag ensures that whether method is called from onscroll listener or input change
          // flag true : will replace the photos variable in state
          // flag false : will add next page photos to same array
          this.setState({ photos: flag ? [...response.data.photos.photo] : [...this.state.photos, ...response.data.photos.photo], loading: false, totalPages: response.data.photos.pages, scrolled: false }) //scroll false ensures API is called once!
          //saving a tag in localStorage as history if searched once!
          if (flag && this.state.value.length > 2) { this.saveToStorage(); this.recover(); }
        }
      });
  }, 1000);

  // method to handle user input from search field
  // parameters used : { event }
  handleChange = (e) => {
    this.setState({ value: e.target.value });
    if (e.target.value) {
      // loading true: shows loader
      this.setState({ loading: true });
      // calls method to fetch data
      this.fetchPhotos(true);
    }
    else {
      // if value becomes empty: state resets to Initial State
      this.setState(initialState);
    }
  }

  // method to handle search from tags/history
  // parameters used : { text value of tag }
  updateSearch = (value) => {
    this.setState({ value: value, loading: true });
    this.fetchPhotos(true);
  }

  // method to handle enter key on search
  // parameters used : { event }
  _handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // preventing page from reloading
      e.preventDefault();
      this.handleChange(e);
    }
  }

  // method to check whether last image is in viewport on scroll
  // parameters used : { offset value = 0 }
  isInViewport = (offset = 0) => {
    // getting all elements in document: class photos
    let elements = document.getElementsByClassName('photos');
    // getting last element in photos array
    let element = elements[elements.length - 1];
    if (!element) return false;
    const top = element.getBoundingClientRect().top;
    return (top + offset) >= 0 && (top - offset) <= window.innerHeight; //returns boolean
  }

  // method to handle scroll event
  // parameters used : { event }
  handleScroll = (event) => {
    // checks whether element is in viewport & apiPageCount is less or equal to total number of pages
    if (this.isInViewport() && this.state.apiPageCount <= this.state.totalPages && !this.state.scrolled) {
      this.setState({ apiPageCount: this.state.apiPageCount + 1, loading: true, scrolled: true });
      this.fetchPhotos();
      return;
    }
  }

  // method to restore tags from localstorage
  recover = () => {
    //parse the localstorage value
    let data = JSON.parse(localStorage.getItem('history'));
    if (data) {
      // saving last 5 searches
      this.setState({ history: data.length > 5 ? data.reverse().splice(0, 5) : data.reverse() });
    }
  }

  // method to save tags/searches to localstorage
  saveToStorage = () => {
    //local storage only takes in key value pair so you would have to serialize it.
    let history = this.state.history ? [...this.state.history] : [];

    if (!history.includes(this.state.value)) { history.push(this.state.value); }

    localStorage.setItem('history', JSON.stringify(history));
  }

  // method to clear history (localstorage and state both)
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
