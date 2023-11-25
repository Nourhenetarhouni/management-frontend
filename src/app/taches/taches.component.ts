import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BondeCommande } from '../model/BondeCommande';
import { Tache } from '../model/Tache';
import { ArticleService } from '../service/article.service';
import { BondeCommandeService } from '../service/bonde-commande.service';
import { MarcheeService } from '../service/marchee.service';
import { TacheArticleAssocService } from '../service/tache-article-assoc.service';
import { TacheService } from '../service/tache.service';
import { TachepredecesseurService } from '../service/tachepredecesseur.service';

@Component({
  selector: 'app-taches',
  templateUrl: './taches.component.html',
  styleUrls: ['./taches.component.css']
})
export class TachesComponent implements OnInit {

  constructor(
    private marchserv: MarcheeService,
    private bcserv: BondeCommandeService,
    private tachserv: TacheService,
    private taasserv: TacheArticleAssocService,
    private tachpredserv: TachepredecesseurService,
    private fb: FormBuilder,
    private artserv: ArticleService
  ) { }

  
  bcs!: BondeCommande[]
  taches!: any[]
  articles: any = []
  tcpred: any = []
  selectedTache: any = null
  predsSlctTache: any = []
  predecessors: any = []

  code_marchee=""
  bcId=""

  bc_selected=false; article_op=false; tcpred_op=false
  edit_tache = false

  err_marchee=false; err_msg="";

  ngOnInit(): void {
  }

  importMarcheeByCode($event: any){
    this.err_marchee = false
    let code = $event.target.value
    this.marchserv.getMarcheebyCode(code).subscribe(
      (res: any)=>{
        this.bcs = res.bondes
      }, (err: any)=>{
        this.err_msg="Marchée n'existe pas"
        this.err_marchee = true
      }
    )
  }
  
  importTachesByBcId($event: any){
    this.bc_selected = true
    let code = $event.target.value
    this.tachserv.getTachebyBcId(code).subscribe(
      (res: any)=>{
        this.taches=res
        this.taches.map((e: any)=>{
          let cout = 0
          e.articlesassociation.forEach((element: any )=> {
            cout += element.prix*element.quantitee
          });
          e.cout = cout
        })
        console.log(this.taches)
      }
    )
  }

  openArticles(tc: Tache){
    let list: any = tc
    for(const article of list.articlesassociation){
      this.artserv.getArticlebyId(article.id.article_id).subscribe(
        (res: any)=>{
          let art = {
            articleTache: article,
            articleData: res
          }
          this.articles.push(art)
          this.article_op=true
        }
      )
    }
  }

  openTachesPred(tc: Tache, typ: any){
    this.tachpredserv.findAllByTacheATravId(tc.id).subscribe(
      (res: any)=>{
        this.predecessors = []
        this.tcpred = []
        for(var k =0; k<res.length; k++){
          this.tcpred.push(res[k].tache_p_trav_id)
          this.predecessors.push(res[k].tache_p_trav_id)
        }
        if(typ!=null){
          this.tcpred_op=true
        }
      }
    )
  }

  importArticle(id: any){
    this.artserv.getArticlebyId(id).subscribe(
      (res: any)=>{

      }
    )
  }

  changeTache($event: any) {
    this.selectedTache.dateDebutNewBC = $event.target.value
  }
  saveChanges() {
    let ind = this.taches.findIndex((e: any)=>{ return e.id == this.selectedTache.id })
    let i = 0
    let list_to_delete: any = []
    for(const tc of this.tcpred){
      let ind = this.predecessors.findIndex((e: any)=>{ e.id==tc.id; })
      if(ind==-1){
        list_to_delete.push(tc)
      }
    }
    i += list_to_delete.length
    let list_to_add: any = []
    for(const tc of this.predecessors){
      let ind = this.tcpred.findIndex((e: any)=>{ e.id==tc.id; })
      if(ind==-1){
        list_to_add.push(tc)
      }
    }
    i += list_to_add.length
    this.tachserv.changeTache(this.selectedTache.id, this.selectedTache).subscribe(
      (res: any)=>{
        this.taches[ind] = this.selectedTache
        let j = 0
        for(const tc of list_to_delete){
          this.tachpredserv.delete(this.selectedTache.id, tc.id).subscribe(
            (res: any)=>{
              j++
              if(j==i){
                this.selectedTache = null
                this.edit_tache = false
              }
            }, (err: any)=>{ }
          )
        }
        for(const tc of list_to_add){
          this.tachpredserv.add(this.selectedTache.id, tc.id).subscribe(
            (res: any)=>{
              j++
              if(j==i){
                this.selectedTache = null
                this.edit_tache = false
              }
            }, (err: any)=>{ }
          )
        }
      }, (err: any)=>{ }
    )
  }
  changeStatPred($event: any, tc: any) {
    let ind = this.predecessors.findIndex((e: any)=>{ return e.id==tc.id; })
    if(ind==-1){
      this.predecessors.push(tc)
    }else{
      this.predecessors.splice(ind, 1)
    }
    console.log(this.predecessors)
  }
  verifyCheck(tsId: any): any {
    let checked = false
    let ind0 = this.tcpred.findIndex((elem: any)=>{ return elem.id==tsId; })
    if(ind0==-1){ checked = false; return false; }
    checked = true
    return checked
  }
}
