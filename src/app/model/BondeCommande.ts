import { Article } from "./Article";
import { ArticleUtilisee } from "./ArticleUtilisee";
import { Tache } from "./Tache";

export class BondeCommande{
    id!: number;
    codebc!: string;
    montant!: number;
    dateDebutNewBC!: string
    delais!: number;
    valide:boolean=false;
    listeArticles:Article[]=[];
    listeTaches:Tache[]=[];
    //idEntrep!: number;
    idOrganisation!: number;
    //nomEntrep!: string;
    nomOrganisation!: string;

    constructor(){}
    
}