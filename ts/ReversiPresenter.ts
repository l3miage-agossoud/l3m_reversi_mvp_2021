import { GameState, ReversiModelInterface, Turn, Board } from './ReversiDefinitions';

const reversiView = `
    <table class="reversi">
        <tbody></tbody>
    </table>
`;

export class ReversiPresenter {
    tds: HTMLElement[][] = [];
    

    constructor(private root: HTMLElement, private model: ReversiModelInterface) {
        this.initBoard();
    }

    updatePresentation({board, turn}: GameState) {
        // à compléter
        // Les cases (balises td) contenant un pion du joueur 1 ont la classe CSS Player1 (voir le CSS)
        // Les cases (balises td) contenant un pion du joueur 2 ont la classe CSS Player2 (voir le CSS)
        // Les cases sur lesquelles le joueur courant peut poser un pion ont la classe CSS canPlayHere
        this.tds.forEach((L,i)=>L.forEach((td, j)=>{
            const c= board[i][j];
            td.setAttribute("class",'');
            td.classList.add(turn);
             const canplay = this.model.PionsTakenIfPlayAt(i,j).length>0;
             if(canplay){
                 td.onclick = () => this.model.play(i,j);
                 td.classList.add('canPlayHere');
             }else{
                 td.onclick=null;
             }
        }))
    }

    private initBoard() {
        // à compléter
        // Remplir le tableau avec 8x8 cases contenant chacune une balise div
        // Utiliser la fonction document.createElement
        // Stockez les balises td dans l'attribut tds de l'objet => ça vous facilitera la vie plus tard

        this.root.innerHTML = reversiView;
        const tbody = this.root.querySelector('tbody') as HTMLElement;
        const board = this.model.gameStateObs;
        
        let str =' ';
        board.forEach( L => {
            str +='<tr>';
            L.board.forEach(c => {
                str +='<td><div></div></td>'
            })
            str +='</tr>'
        })
        tbody.innerHTML = str;

        this.tds = [...tbody.querySelectorAll('tr')].map(tr => [...tr.querySelectorAll('td')]);
        console.log(this.tds);
        //this.updatePresentation(board, turn );
    }
}
