import React from 'react';
import { Form, Row, Col } from 'react-bootstrap'
import './App.css';
import PhotosGrid from './components/Photos-grid'
import { logo } from './logo.svg'
import axios from 'axios';

class App extends React.Component {

  constructor() {
    super();
    this.state = { value: '', photos: [] }
  }
  handleChange = (e) => {
    this.setState({ value: e.target.value });
    if (e.target.value) {
      axios.get('https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=3b8da0e5c9ae44b2d9c8f009a21f8929&text=' + e.target.value + '&format=json&nojsoncallback=1')
        .then(response => {
          this.setState({ photos: [...response.data.photos.photo] })
        });
    }
    else {
      this.setState({ photos: [] });
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Row className="search-row">
            <Col>
              <h3 className="my-3">Search Photos</h3>
              <Form>
                <Form.Control className="search-input" placeholder="Search images..." value={this.state.value} onChange={this.handleChange} autoComplete="on" />
              </Form>
            </Col>
          </Row>
        </header>
        <body className="App-body mt-3">
          <PhotosGrid photos={this.state.photos}></PhotosGrid>
        </body>
      </div>
    );
  }
}

export default App;
