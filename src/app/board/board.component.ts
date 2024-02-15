import { Component } from '@angular/core';

type Difficulty = 'easy' | 'medium' | 'hard';
type Player = 'x' | 'o';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})

export class BoardComponent {
  squares: any[] | undefined;
  xIsNext: boolean | undefined;
  winner: string | null | undefined;
  AIPlayer: string | null | undefined;
  humanPlayer: string | null | undefined;
  difficulty: Difficulty = 'medium'; // Add this line
  playerSelected: Player = 'o'; // Add this line;

  constructor() { }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.newGame();

  }

  newGame() {
    this.AIPlayer = 'X'
    this.humanPlayer = 'O'
    this.squares = Array(9).fill(null);
    this.winner = null;
    this.xIsNext = true;

    // comentar muda o player
    if (this.player === this.AIPlayer) {
      this.playRandom();
    }
  }

  playRandom() {
    const randomMovement = Math.floor(Math.random() * 9);
    this.makeMove(randomMovement);
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  hasNoNull(arr: any[]): boolean {
    return !arr.some(value => value === null);
  }

  findNullIndex(arr: any[]): number {
    return arr.findIndex(value => value === null);
  }

  printBoard(arr: any[]): void {
    console.log(arr[0] + ' | ' + arr[1] + ' | ' + arr[2]);
    console.log('---------');
    console.log(arr[3] + ' | ' + arr[4] + ' | ' + arr[5]);
    console.log('---------');
    console.log(arr[6] + ' | ' + arr[7] + ' | ' + arr[8]);
  }



    competitiveSearch(boardMovement: any[], isMaximizing: boolean,): number[] {
      
      const winner = this.calculateWinner(boardMovement);
      
      if (winner != undefined) {
        return [
          winner == this.AIPlayer ? 1 : -1,
          -1
        ];
      } 
  
      let bestScore = isMaximizing ? -Infinity : Infinity;
      let bestMovement: number = -1;
      let totalScore: number = 0;
      for (let i = 0; i < boardMovement.length; i++) {
        if (boardMovement[i] === null) {
          // Por meio da isMaximizing, podemos ver se é o Player ou a IA
          boardMovement[i] = isMaximizing ? this.AIPlayer : this.humanPlayer;
          const score = this.competitiveSearch(boardMovement, !isMaximizing)[0];
          totalScore += score;
          bestScore = isMaximizing ?
            Math.max(score, bestScore) :
            Math.min(score, bestScore);
  
          // Houve uma troca
          if (score == bestScore) {
            bestMovement = i;
          }
          boardMovement[i] = null;
        }
      }

      if (this.difficulty === 'easy' && Math.random() < 0.7) {
        const possibleMovements = boardMovement.map((value, index) => value === null ? index : -1).filter(index => index !== -1);
        bestMovement = possibleMovements[Math.floor(Math.random() * possibleMovements.length)];
      }

      if(this.difficulty === 'medium' && Math.random() < 0.3) {
        const possibleMovements = boardMovement.map((value, index) => value === null ? index : -1).filter(index => index !== -1);
        bestMovement = possibleMovements[Math.floor(Math.random() * possibleMovements.length)];
      }

      return [bestScore, bestMovement];
    }
  
    changeDifficulty(difficulty: Difficulty) {
      this.difficulty = difficulty;
      this.newGame();
    }
    changePlayer(player: Player) {
      this.playerSelected = player;
      this.newGame();
    }

  makeBestMove() {
    let bestMove: number = this.competitiveSearch(this.squares || Array(9).fill(null), true)[1];
    //this.printBoard(this.squares || Array(9).fill(null))
   // console.log(bestMove);
    if (bestMove != -1) {
      this.makeMove(bestMove);
    } else {
      const randomMovement = this.findNullIndex(this.squares || Array(9).fill(null));
      // console.log(randomMovement);
      this.makeMove(randomMovement);
    }
  }

  makeMove(idx: number) {
    if (this.squares == undefined || this.squares[idx] == null) {
      this.squares!.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }
    this.winner = this.calculateWinner(this.squares);

    // Se for a vez da IA
    if (!this.winner &&
      !this.hasNoNull(this.squares || Array(9).fill(null)) &&
      this.player === this.AIPlayer) {
          this.makeBestMove();
    }
  }

  calculateWinner(board: any[] | undefined) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        board != undefined &&
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }
    return null;
  }
}
