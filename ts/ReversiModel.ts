import { BehaviorSubject, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import {Board, Turn, ReversiModelInterface, C, TileCoords, Board_RO, GameState, PlayImpact} from "./ReversiDefinitions";

export class ReversiModel implements ReversiModelInterface {
    protected board: Board;
    protected currentTurn: Turn;

    protected game: GameState;

    protected gameStateSubj: BehaviorSubject<GameState>;

    
    public readonly gameStateObs: Observable<GameState>;
    

    constructor() {
        this.gameStateSubj = new BehaviorSubject<GameState>(this.game);
        this.gameStateObs = this.gameStateSubj.asObservable();
        this.initBoard();
    }


    initBoard(): void {
        this.currentTurn = this.game.turn='Player1';
        this.board = new Array(8).fill(0).map( l => new Array<C>(8).fill(C.Empty) ) as Board;
        this.board[3][3] = this.board[4][4] = this.game.turn = 'Player1';
        this.board[4][3] = this.board[3][4] = this.game.turn = 'Player2';;
    }

    PionsTakenIfPlayAt(x: number, y: number): PlayImpact {
        // Parcourir les 8 directions pour accumuler les coordonnées de pions prenables

        const FctAccuDir = (dx :number, dy: number): PlayImpact => {
                // renvoie les coordonnées des pions pris dans la direction dx, dy

                if (this.board[x][y] === 'Empty') {
                    const otherTile = this.currentTurn === (this.game.turn = 'Player1') ? (this.game.turn = 'Player2') : (this.game.turn = 'Player1');
                    const tilesToFlip: PlayImpact = [];

                const tab : TileCoords[] = [];
                let px=x;
                let py=y;
                let c: C;

                do{
                      px +=dx;
                      py +=dy;
                      //c= this.board[px][py];
                      c= (px >= 0 && px < this.board.length &&  py >=0 && py < this.board[0].length) ?this.board[px][py] : 'Empty';
                      //c= this.board[px] ? this.board[px] : C.Empty;
                      
                      tab.push({x= px, y= py});

                }while(c === otherTile);
                    tab.pop();
                    return c === this.currentTurn ? tab : [];
                }
                    
                
                
    
        }
    return [];
}



    play(i: number, j: number): void {
        // Vérifier que le coup est valide.
        // Si c'est le cas, après avoir jouer le coup, on passe à l'autre joueur.
        // Si l'autre joueur ne peut jouer nul part, on redonne la main au joueur initial. 
        const L = this.PionsTakenIfPlayAt(i, j);
        if (L.length > 0) {
            // à compléter
            this.board[i][j] = this.currentTurn; // Je place mon pion
            L.forEach( ({x, y}) => this.board[x][y] = this.currentTurn );
            // Je change de joueur
            this.currentTurn = this.currentTurn === (this.game.turn = 'Player1') ? (this.game.turn = 'Player2') : (this.game.turn = 'Player1');
            if (this.skipTurn()) {
                // L'adversaire ne peut pas jouer, c'est encore à moi
                this.currentTurn = this.currentTurn === (this.game.turn = 'Player1') ? (this.game.turn = 'Player2') : (this.game.turn = 'Player1');
            }
            this.gameStateSubj.next(this.game);
        }
    }


    skipTurn(): boolean {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.PionsTakenIfPlayAt(i, j).length > 0) {
                    return false;
                }
            }
        }
        return true;
    }

}
