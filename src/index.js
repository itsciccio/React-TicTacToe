import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick} style={{background:props.isWinningSquare ?  "#aaa" : "#fff"}}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    renderSquare(i, winning_square) {
        return (
            <Square value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                isWinningSquare={winning_square}
            />
        );
    }

    render() {
        return (
            this.generateSquare()
        );
    }

    generateSquare(){
        const structure = [];
        
        var counter = 0;
        for(let r = 0; r < 3; r++){
            var rows = [];
            for(let c = 0; c < 3; c++){
                var winner = false;
                if(this.props.winning_line){
                    console.log(this.props.winning_line)
                    if(this.props.winning_line.includes(counter)){
                        console.log(counter)
                        winner = true;
                    }
                }                
                rows.push(this.renderSquare(counter, winner));
                counter++;
            }
            structure.push(<div className="board-row">{rows}</div>);
        }

        return <div>{structure}</div>        
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                move_played: null,
                step: 0,
            }],
            xIsNext: true,
            stepNumber: 0,
            order: true,
            winning_lines: null,
        };
    }

    
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }       
        
        squares[i] = this.state.xIsNext ? 'X' : 'O';        
        const [col, row] = getLocationOnBoard(i);        

        this.setState({
            history: history.concat([{
                squares: squares,
                move_played: squares[i],
                col: col,
                row: row,
                step: history.length,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    sortHistory(){

        this.setState({
            order : ! this.state.order,
        })

        this.state.history.sort((a, b) => this.state.order ? b.step - a.step : a.step - b.step);
    }

    setWinningLine(winning_line){
        if(this.state.winning_lines === null){ 
            this.setState({
                winning_lines : winning_line,
            });
        }
    }


    render() {
        const history = this.state.history;
        const current =  history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            var desc = move ?
                'Go to move #' + move :
                'Go to game start';
            desc = move ? 
                desc + " - " + step.move_played + ": (" + step.col + " , " + step.row + ")" : 
                desc;
            return (
                <li key={move} >
                    <button onClick={() => this.jumpTo(move)}  style={{ fontWeight: move === this.state.stepNumber ? 'bold':'normal' }}>                    
                        {desc}                        
                    </button>
                </li>
            );            
        });

        let status;
        if (winner !== null){
            status = 'Winner: '+ winner[0];
            this.setWinningLine(winner[1]);
        }else{
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        if(history.length === 10 && this.state.stepNumber === 9){
            status = 'Draw!';
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winning_line={this.state.winning_lines}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <button onClick = {() => this.sortHistory()}>
                        {this.state.order ? "DESC" : "ASC" }
                    </button>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a],lines[i]];
        }
    }
    return null;
}

function getLocationOnBoard(i){

    i = i+1;

    var col;
    var row;

    if (i === 1 || i === 4 || i === 7){
        col = 1
    }else if(i === 2 || i === 5 || i === 8){
        col = 2
    }else if(i === 3 || i === 6 || i === 9){
        col = 3
    }

    if (i === 1 || i === 2 || i === 3){
        row = 1
    }else if(i === 4 || i === 5 || i === 6){
        row = 2
    }else if(i === 7 || i === 8 || i === 9){
        row = 3
    }

    return [col, row]
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

