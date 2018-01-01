import React, { Component } from 'react';
import './styles/reset.css';
import './styles/App.css';

function SquareContent(props) {
  return <li className="box-board-content" onClick={ props.onClick }>{ props.item === 0 ? '-' : props.item === 1 ? 'O' : 'X' }</li>;
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      player: true,
      winner: null,
      status: Array(9).fill(0), //0 = '-'; 1 = 'O'; -1 = 'X';
    }
    this.baseState = this.state;
  }

  handleClick({item, idx}) {
    if (item !== 0 || this.state.winner !== null) return;
    const newStatus = this.state.player ? 1 : -1;
    const newStatusAry = this.state.status.map( (oriItem, oriIdx) => idx === oriIdx && oriItem === 0 ? newStatus : oriItem );
    const successLines = [[0,1,2],[0,4,8],[0,3,6],[1,4,7],[2,4,6],[2,5,8],[3,4,5],[6,7,8]];
    const winnerResult = successLines.map(successLine => successLine.reduce((acc, cur)=> acc + newStatusAry[cur],0))
                                     .filter(total => total === 3 || total === -3);

    this.setState({
      player: !this.state.player,
      status: newStatusAry,
      winner: !winnerResult.length ? this.state.winner : winnerResult[0] > 0 ? 'O' : 'X',   
    });
  }

  resetGame() {
    this.setState(this.baseState);
  }

  render() {
    const showResult = this.state.winner ? {display: 'flex'} : {display: 'none'};
    return (
      <div className="box-container">
        <h1 className="box-title">OOXX</h1>
        <div className="box-info">
          <span>player: { this.state.player ? 'O' : 'X' }</span>
          <span>winner: { this.state.winner || '???' }</span>
        </div>
        <ul className="box-board">
          { this.state.status.map( (item, idx) =>
            <SquareContent 
            item = {item}
            onClick = {()=> this.handleClick({item, idx})} 
            />)
          }
        </ul>
        <div className="box-result" style={ showResult }>
          <h2>Winner is { this.state.winner }</h2>
          <button onClick={()=> this.resetGame()}>replay</button>
        </div>
      </div>
    )
  }
}

export default Board;