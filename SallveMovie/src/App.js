import React, { Component } from 'react';
import './App.css';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
const fetch = require('isomorphic-fetch');

class SearchBody extends Component {
	render() {
		return(
			<div>
			{
	          this.props.data.response === "True"? 
	            <div className="col-xs-12 search-body">
	              <div className="col-xs-12 col-md-8 col-md-push-4 col-lg-7 col-lg-push-5 search-details">
	                <h2 className="colorRed">{this.props.data.title}</h2>
                  <h4 className="colorRed">Data de lançamento:</h4>
                  <p>{this.props.data.released}</p>
                  <h4 className="colorRed">Gênero:</h4>
                  <p>{this.props.data.genre}</p>
                  <h4 className="colorRed">Premiações:</h4>
                  <p>{this.props.data.awards}</p>
                  <h4>Enrredo:</h4>
	                <p>{this.props.data.plot}</p>
	                <div className="details">
	                  <div className="actors">
	                    <h4>Atores:</h4>
	                    <div>{this.props.data.actors}</div>
	                  </div>
	                  <div className="row release">
	                    <div className="col-xs-5"> 
                        <span className="details-label">Diretor:</span>
                        <span className="display-block">{this.props.data.director}</span> 
                      </div>
	                    <div className="col-xs-5"> 
                        <span className="details-label">Quem escreveu:</span>
                        <span className="display-block">{this.props.data.writer}</span><
                      /div>
	                  </div>
	                </div>
	              </div>
	              <div className="col-xs-12 col-md-4 col-md-pull-8 col-lg-2 col-lg-pull-7 poster-container">
	                <img src={this.props.data.poster_url} className="poster" alt="" />
	              </div>
	            </div>
	            : 
	            <div className="not-found">
	            </div>
	        }
	        </div>
		);
	}
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTitle: '',
      defaultUrl: 'http://www.omdbapi.com/?t=arrival'
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchApiData = this.fetchApiData.bind(this);
    this.renderMenuItemChildren = this.renderMenuItemChildren.bind(this);
  }

  componentDidMount() {
  	this.fetchApiData(this.state.defaultUrl);
  }
  fetchApiData(url){
    fetch(url) 
      .then((result) => {
        return result.json()
      })
      .then((json) => {
        if(json.Response === "True"){
        this.setState({
          title: json.Title,
          released: json.Released,
          genre: json.Genre,
          awards: json.Awards,
          plot: json.Plot,
          actors: json.Actors,
          director: json.Director,
          writer: json.Writer,
          poster_url: json.Poster,
          response: json.Response
        });
        }
        else {
          this.setState({
            response: json.Response,
            error: json.Error
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  handleSubmit(query){
    if (!query) {
      return;
    }
    this.fetchApiData(`http://www.omdbapi.com/?t=${query}&apikey=e08a03db`);
  }

  handleSearch(query) {
    if (!query) {
      return;
    }

    fetch(`http://www.omdbapi.com/?s=${query}&apikey=e08a03db`)
      .then((result) => {
        return result.json()
      })
      .then((json) => {
        this.setState({
          options: json.Search
        })
      });
  }

  renderMenuItemChildren(option, props, index) {
    return (
      <div key={option.imdbID} onClick={this.handleSubmit.bind(this, option.Title)}>
        <span>{option.Title}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="container">
      <div className="col-xs-12 col-lg-10 col-lg-offset-1">
	        <div className="App col-xs-12">
	          <div className="row">
	            <div className="col-xs-12 col-sm-6 col-lg-12">
	              <h1>Sallve Movie</h1>
              </div>
	            </div>
	            <div className="col-xs-12 col-sm-6 col-lg-8 form">
                  <AsyncTypeahead
                    ref="typeahead"
                    {...this.state}
                    labelKey="Title"
                    onSearch={this.handleSearch}
                    options={this.state.options}
                    placeholder='Procurar por título'
                    className="search"
                    renderMenuItemChildren={this.renderMenuItemChildren}
                  />
	            </div>
	        <SearchBody data={this.state} />
        </div>
      </div>
    </div>
    );
  }
}

export default App;
