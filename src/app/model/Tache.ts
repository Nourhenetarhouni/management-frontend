import { Article } from "./Article";

export class Tache{
    id!: number;
    bondecommande_id!: number;
    code!: string;
    nom!: number;
    delais!: number;
    avancement!: number;
    dateDebutNewBC!: string
    prix!: string;
    quantite!: number;
    listeArticles:Article[]=[];

    constructor(){}
    
}