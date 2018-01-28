import React, { Component } from 'react';
import './App.css';


// import jpRule from './jpRule'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchWord: '良い',
      resultData: {} 
    }
    this.fetchData = this.fetchData.bind(this);
    this.changeSearchWord = this.changeSearchWord.bind(this);
  }

  fetchData(){
    fetch('http://127.0.0.1:3001/dictionary', {
      method: 'post',
      body: JSON.stringify({searchword: this.state.searchWord}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(res=>res.json())
    .then(res => {
      this.setState({
        resultData: res
      })
    });
  }

  changeSearchWord(event) {
    this.setState({
      searchWord: event.target.value
    })
  }

  render() {
    return (
      <div className="container">
          <label>
            語彙：
            <input type="text" value={this.state.searchWord} onChange={this.changeSearchWord}/>
          </label>
          <button onClick={this.fetchData}>submit</button>
          <div>{JSON.stringify(this.state.resultData)}</div>
      </div>
    );
  }
}

export default App;
