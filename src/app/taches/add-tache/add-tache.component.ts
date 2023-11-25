import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { elementAt } from 'rxjs';
import { Article } from 'src/app/model/Article';
import { BondeCommande } from 'src/app/model/BondeCommande';
import { Tache } from 'src/app/model/Tache';
import { TacheArticleAssoc } from 'src/app/model/TacheArticleAssoc';
import { TacheArticleAssocId } from 'src/app/model/TacheArticleAssocId';
import { ArticleService } from 'src/app/service/article.service';
import { BondeCommandeService } from 'src/app/service/bonde-commande.service';
import { MarcheeService } from 'src/app/service/marchee.service';
import { TacheArticleAssocService } from 'src/app/service/tache-article-assoc.service';
import { TacheService } from 'src/app/service/tache.service';
import { TachepredecesseurService } from 'src/app/service/tachepredecesseur.service';

@Component({
  selector: 'app-add-tache',
  templateUrl: './add-tache.component.html',
  styleUrls: ['./add-tache.component.css']
})
export class AddTacheComponent implements OnInit {

  constructor(
    private marchserv: MarcheeService,
    private bcserv: BondeCommandeService,
    private tachserv: TacheService,
    private taasserv: TacheArticleAssocService,
    private tachpredserv: TachepredecesseurService,
    private fb: FormBuilder,
    private artserv: ArticleService
  ) { }
  choixBcForm = this.fb.group({
    bondecommande_id: ['', [Validators.required]],
  })
  tacheForm = this.fb.group({
    code: ['', [Validators.required]],
    nom: ['', [Validators.required]],
    delais: ['', [Validators.required]],
    predecessors: [''],
  })
  editTacheForm = this.fb.group({
    code: ['', [Validators.required]],
    nom: ['', [Validators.required]],
    delais: ['', [Validators.required]],
    predecessors: [''],
  })
  articleForm = this.fb.group({
    artCode: ['', [Validators.required]],
    quantite: ['', [Validators.required]],
  })

  code_marchee=""

  qtt_art=-1
  qtt_no_dispo=false
  articles!: Article[]
  bcs!: BondeCommande[]


  marche: any
  bcIdSelected!: any
  bcSelected!: any
  taches: Tache[] = []
  tachesPredec!: any
  predecessors: any = []
  tachesValidated: any[] = []
  tacheSelected!: Tache

  draftListArticles!: any[]
  tache_to_delete!: Tache
  tache_to_edit!: Tache

  to_confirm = false; bc_confirmed=false; add_tache=false;
  add_article=false; edit_tache=false; delete_tache=false;
  edit_predec=false
  art_step=2

  err_marchee=false; err_montant=false; err_delais=false;
  err_codetache=false; err_nomtache=false; err_delaistache=false;
  err_article=false; err_prix=false; err_qtt=false;err_datetache=false;
  err_msg=""

  ngOnInit(): void {
    this.importArticle()
  }
  importArticle(){
    this.artserv.getArticles().subscribe(
      (res: any)=>{
        this.articles = res
      }, (err: any)=>{}
    )
  }
  importMarcheeByCode($event: any){
    this.err_marchee = false
    let code = $event.target.value
    this.marchserv.getMarcheebyCode(code).subscribe(
      (res: any)=>{
        this.marche = res
        this.bcs = res.bondes
      }, (err: any)=>{
        this.err_msg="Marchée n'existe pas"
        this.err_marchee = true
      }
    )
  }
  importTacheByCode($event: any){
    this.err_codetache = false
    let code = $event.target.value
    this.tachserv.getTachebyCode(code).subscribe(
      (res: any)=>{
        this.err_codetache = true
        this.err_msg="Ce code est déjà utilisé"
      }, (err: any)=>{

      }
    )
  }
  importArticleByCode($event: any){
    let code = $event.target.value
    this.artserv.getArticlebyCode(code).subscribe(
      (res: any)=>{
        this.err_article=true
        this.err_msg=""
      }, (err: any)=>{
        if(err.status==404){
          this.err_article = true
          this.err_msg=""
        }
      }
    )
  }
  confirmBc(){
    if(!this.choixBcForm.invalid){
      this.bcserv.getBCbyId(this.choixBcForm.value.bondecommande_id).subscribe(
        (res: any)=>{
          this.to_confirm = true
        }, (err: any)=>{}
      )
    }
  }
  confirmInformationsBc(){
    this.bcIdSelected = this.choixBcForm.value.bondecommande_id
    this.bcserv.getBCbyId(this.bcIdSelected).subscribe(
      (res: any)=>{
        this.bcSelected = res;
        this.importTachesByBcId(this.bcSelected.id)
        for(var art of this.bcSelected.articlesassociation){
          this.artserv.getArticlebyId(art.id.article_id).subscribe(
            (res: any)=>{
              let ind = this.bcSelected.articlesassociation.findIndex((elem: any)=>{ return elem.id.article_id==res.id; })
              this.bcSelected.articlesassociation[ind].id=res
            }
          )
        }
      }
    )
    this.choixBcForm.controls['bondecommande_id'].disable();
    this.bc_confirmed=true
  }
  importTachesByBcId(bcId: any){
    this.tachserv.getTachebyBcId(bcId).subscribe(
      (res: any)=>{
        this.tachesPredec=res
      }
    )
  }
  addTacheAction(){
    this.add_tache=true
  }
  checkTask($event: any, tcCode: any){
    if($event.target.checked==true){
      let ind = this.predecessors.findIndex((elem: any)=>{ return elem.taskATravCode==tcCode; })
      if(ind==-1){
        let preds: any = []
        preds.push({taskPTravId: $event.target.value})

        let ct_null = this.predecessors.filter((elem: any)=>{ return elem.taskATravCode==null; }).length
        if(ct_null>0){
          let ind_null = this.predecessors.findIndex((elem: any)=>{ return elem.taskATravCode==null; })
          this.predecessors[ind_null].preds.push({taskPTravId: $event.target.value})
        }else{
          this.predecessors.push({taskATravCode: null, preds: preds})
        }
      }else{
        this.predecessors[ind].preds.push({taskPTravId: $event.target.value})
      }
    }else{
      let ind0 = this.predecessors.findIndex((elem: any)=>{ return elem.taskATravCode==tcCode||elem.taskATravCode==null; })
      if(ind0!=-1){
        let ind1 = this.predecessors[ind0].preds.findIndex((elem: any)=>{ return elem.taskPTravId==$event.target.value; })
        if(ind1!=-1){
          if(this.predecessors[ind0].preds.length==1){
            this.predecessors.splice(ind0, 1)
          }else{
            this.predecessors[ind0].preds.splice(ind1, 1)
          }
        }
      }
    }
  }
  verifyCheck(tcCode: any, tsId: any): any{
    let checked = false
    let ind0 = this.predecessors.findIndex((elem: any)=>{ return elem.taskATravCode==tcCode; })
    if(ind0==-1){ checked = false; return false; }
    let ind1 = this.predecessors[ind0].preds.findIndex((elem: any)=>{ return elem.taskPTravId==tsId; })
    if(ind1==-1){ checked = false; return false; }
    checked = true
    return checked
  }
  addTache(){
    this.err_codetache=false; this.err_nomtache=false;
    this.err_delaistache=false; this.err_datetache = false
    this.err_msg=""
    if(!this.tacheForm.invalid){
      let ind = this.taches.findIndex((elem: any)=>{ return elem.code==this.tacheForm.value.code; })
      if(ind != -1){
        this.err_codetache = true
        this.err_msg="Ce code est déjà utilisé"
      }else{
        this.tachserv.getTachebyCode(this.tacheForm.value.code).subscribe(
          (res: any)=>{
            this.err_codetache = true
            this.err_msg="Ce code est déjà utilisé"
          }, (err: any)=>{
            if(this.tacheForm.value.delais>this.bcSelected.delais){
              this.err_delaistache = true
              this.err_msg="Le délai de la tache est supérieur que délai du bonde commande"
              return
            }
            let newTache = new Tache()
            newTache.dateDebutNewBC = this.bcSelected?.dateDebutNewBC
            let ol_deb = (new Date(this.bcSelected.dateDebutNewBC)).getTime()
            let ol_del = ol_deb+(this.bcSelected.delais*24*60*60*1000)
            let nw_db = (new Date(newTache.dateDebutNewBC)).getTime()
            let nw_del = nw_db+(this.tacheForm.value.delais*24*60*60*1000)
            if(ol_del<nw_del){
              this.err_delaistache = true
              this.err_msg="La date de fin de la tache atteint la date de fin de la bonde commande"
              return
            }
            newTache.bondecommande_id = this.bcIdSelected
            newTache.code = this.tacheForm.value.code
            newTache.nom = this.tacheForm.value.nom
            newTache.delais = parseFloat(this.tacheForm.value.delais)
            newTache.avancement = 0
            this.taches.push(newTache)
            this.tachesValidated.push({jeton: 1, stat:0})
            this.tacheForm.reset()
            this.add_tache = false
          }
        )
      }
    }else{
      if(this.tacheForm.value.code.length==0){
        this.err_codetache=true;
        this.err_msg=""
      }
      if(this.tacheForm.value.nom.length==0){ this.err_nomtache=true; }
      if(this.tacheForm.value.delais.length<=0){ this.err_delaistache=true; }
    }
  }
  editTacheAction(tcCode: any){
    let ind = this.taches.findIndex((elem: Tache)=>{ return elem.code==tcCode; })
    this.tache_to_edit = this.taches[ind]
    this.editTacheForm.patchValue({"code": this.taches[ind].code})
    this.editTacheForm.patchValue({"nom": this.taches[ind].nom})
    this.editTacheForm.patchValue({"delais": this.taches[ind].delais})
    this.editTacheForm.controls['code'].disable();
    this.edit_tache=true
  }
  editTache(withForm: any){
    this.err_nomtache=false; this.err_delaistache=false;
    this.err_datetache=false; this.err_msg="";
    this.editTacheForm.controls['code'].enable()
    let ind = this.taches.findIndex((elem: Tache)=>{ return elem.code==this.editTacheForm.value.code; })
    if(!this.editTacheForm.invalid||withForm==0){
      if(this.editTacheForm.value.delais>this.bcSelected.delais&&withForm==1){
        this.err_delaistache = true
        this.err_msg="Le délai de la tache est supérieur que délai du bonde commande"
        return
      }
      //-----------------------
      if(withForm==0){
        if(this.predecessors.length==0){
          let ind1 = this.taches.findIndex((elem: Tache)=>{ return elem.code==this.tache_to_edit.code; })
          this.taches[ind1].dateDebutNewBC = this.bcSelected?.dateDebutNewBC
        }else{
          let ind = this.predecessors.findIndex((elem: any)=>{ return elem.taskATravCode==this.tache_to_edit.code||elem.taskATravCode==null; })
          if(ind!=-1){
            let preds = this.predecessors[ind].preds
            if(preds.length>0){
              let ind2 = this.tachesPredec.findIndex((e: any)=>{ return e.id == parseInt(preds[0].taskPTravId) })
              let mx_date = (new Date(this.tachesPredec[ind2].dateDebutNewBC)).getTime()+(this.tachesPredec[ind2].delais*24*60*60*1000)
              let mx_id = this.tachesPredec[ind2].id
              for(var i = 1; i<preds.length; i++){
                console.log(this.tachesPredec)
                console.log(preds[i].taskPTravId)
                let ind3 = this.tachesPredec.findIndex((e: any)=>{ return e.id == parseInt(preds[i].taskPTravId) })
                console.log(ind3)
                let ndt = (new Date(this.tachesPredec[ind3].dateDebutNewBC)).getTime()+(this.tachesPredec[ind3].delais*24*60*60*1000)
                if(ndt>mx_date){
                  mx_date=ndt
                  mx_id = this.tachesPredec[ind3].id
                }
              }
              this.taches[ind].dateDebutNewBC = this.formatDate(mx_date)
            }else{
              this.taches[ind].dateDebutNewBC = this.bcSelected?.dateDebutNewBC
            }
          }else{
            this.taches[ind].dateDebutNewBC = this.bcSelected?.dateDebutNewBC
          }
        }
        let ind1 = this.taches.findIndex((elem: Tache)=>{ return elem.code==this.tache_to_edit.code; })
        let ind2 = this.predecessors.findIndex((elem: any)=>{ return elem.taskATravCode==null; })

        let ol_deb = (new Date(this.bcSelected.dateDebutNewBC)).getTime()
        let ol_del = ol_deb+(this.bcSelected.delais*24*60*60*1000)
        let nw_db = (new Date(this.taches[ind1].dateDebutNewBC)).getTime()
        let nw_del = nw_db+(this.taches[ind1].delais*24*60*60*1000)
        if(ol_del<nw_del){
          this.err_datetache = true
          this.err_msg="La date de fin de la tache atteint la date de fin de la bonde commande"
          return
        }

        if(ind2!=-1){
          this.predecessors[ind2].taskATravCode = this.taches[ind1].code
        }
      }else if(withForm==1){
        let ol_deb = (new Date(this.bcSelected.dateDebutNewBC)).getTime()
        let ol_del = ol_deb+(this.bcSelected.delais*24*60*60*1000)
        let nw_db = (new Date(this.taches[ind].dateDebutNewBC)).getTime()
        let nw_del = nw_db+(this.editTacheForm.value.delais*24*60*60*1000)
        if(ol_deb>nw_db){
          this.err_datetache = true
          this.err_msg="Choisir un date après début de la bonde commande "+this.bcSelected.dateDebutNewBC
          return
        }
        if(ol_del<nw_del){
          this.err_datetache = true
          this.err_msg="La date de fin de la tache atteint la date de fin de la bonde commande"
          return
        }
        this.taches[ind].nom=this.editTacheForm.value.nom
        this.taches[ind].delais=parseFloat(this.editTacheForm.value.delais)
      }
      //-----------------------
      //-----------------------
      this.editTacheForm.reset()
      this.tache_to_edit=new Tache()
      this.edit_tache=false;
      this.edit_predec=false;
    }else{
      if(this.editTacheForm.value.nom.length==0){ this.err_nomtache=true; }
      if(this.editTacheForm.value.delais.length<=0){ this.err_delaistache=true; }
    }
  }
  validateTache(i: any){
    if(this.tachesValidated[i].jeton==1){
      var x = document.getElementById("toast-token")
      x!.className = "show";
      setTimeout(function(){ x!.className = x!.className.replace("show", ""); }, 5000);
    }
  }
  deleteTacheAction(tcCode: any){
    let ind = this.taches.findIndex((elem: Tache)=>{ return elem.code==tcCode; })
    this.tache_to_delete = this.taches[ind]
    this.delete_tache=true
  }
  deleteTache(){
    let ind0 = this.predecessors.findIndex((elem: any)=>{ return elem.taskATravCode==this.tache_to_delete.code; })
    if(ind0!=-1){
      this.predecessors.splice(ind0, 1)
    }
    let ind = this.taches.findIndex((elem: Tache)=>{ return elem.code==this.tache_to_delete.code; })
    this.taches.splice(ind, 1)
    this.tachesValidated.splice(ind, 1)
    this.delete_tache=false
  }
  listArticles(tache: any){
    let deep_taches = JSON.parse(JSON.stringify(this.taches))
    let ind = deep_taches.findIndex((elem: Tache)=>{ return elem.code==tache.code; })
    this.tacheSelected = deep_taches[ind]
    this.add_article=true
  }
  addArticle(){
    this.err_article=false; this.err_prix=false; this.err_qtt=false; this.qtt_no_dispo=false;
    if(!this.articleForm.invalid){
      let ind = this.bcSelected.articlesassociation.findIndex((elem: any)=>{
        return elem.id.code==this.articleForm.value.artCode
      })
      if(ind == -1){
        this.err_article=true
        this.err_msg="Code article n'existe pas"
        return
      }
      let qtt_dispo = this.calculeQuantiteArticleDispo(ind, null)
      
      if(this.articleForm.value.quantite>qtt_dispo){
        this.qtt_art = qtt_dispo
        this.qtt_no_dispo=true
        this.err_qtt = true
        return
      }
      let newArticle: Article =  this.bcSelected.articlesassociation[ind].id
      newArticle.id = parseInt( this.bcSelected.articlesassociation[ind].id.id)
      newArticle.prix = parseFloat(this.bcSelected.articlesassociation[ind].prix)
      newArticle.quantitee = parseInt(this.articleForm.value.quantite)
      this.tacheSelected.listeArticles.push(newArticle)
      this.articleForm.reset()
      this.qtt_art = this.qtt_art-newArticle.quantitee
    }else{
      if(this.articleForm.value.artCode==""){this.err_article=true;this.err_msg="";}
      if(this.articleForm.value.quantite==""){this.err_qtt=true;this.err_msg="";}
    }

  }
  chooseArticle(){
    this.err_article=false; this.qtt_art=-1;
    let ind = this.bcSelected.articlesassociation.findIndex((elem: any)=>{
      return elem.id.code==this.articleForm.value.artCode
    })
    if(ind == -1){
      this.err_article=true
      this.err_msg="Code article n'existe pas"
      return false
    }
    this.qtt_art = this.calculeQuantiteArticleDispo(ind, null)
    if(this.qtt_art<0){
      this.qtt_no_dispo=true
    }
    return true
  }
  calculeQuantiteArticleDispo(ind: any, artIdEnt: any){
    let artId = artIdEnt==null ? this.bcSelected.articlesassociation[ind].id.id : artIdEnt
    let qtt_tot=0
    let index = ind
    for(const tc of this.taches){
      for(const art of tc.listeArticles){
        if(art.id==artId){
          qtt_tot=qtt_tot+art.quantitee
        }
      }
    }
    for(const tc of this.tachesPredec){
      for(const art of tc.articlesassociation){
        if(art.id.article_id==artId){
          qtt_tot=qtt_tot+art.quantitee
        }
      }
    }
    if(artIdEnt!=null){
      index = this.bcSelected.articlesassociation.findIndex((elem: any)=>{
        return elem.id.id==artId
      })
    }
    let qtt_dispo = this.bcSelected.articlesassociation[index].quantitee - qtt_tot
    return qtt_dispo
  }
  saveArticlesAdding(){
    let ind = this.taches.findIndex((elem: Tache)=>{ return elem.code==this.tacheSelected.code; })
    if(this.tacheSelected.listeArticles.length>0){
      this.tachesValidated[ind].jeton = 0
    }
    this.taches[ind]=JSON.parse(JSON.stringify(this.tacheSelected))
    this.add_article=false
  }
  deleteArticle(code: any){
    let ind = this.tacheSelected.listeArticles.findIndex((elem: Article)=>{ return elem.code==code; })
    this.tacheSelected.listeArticles.splice(ind, 1)
  }
  allValidate(){
    let validate=true
    for(const elem of this.tachesValidated){
      if(elem.stat==0){
        validate=false
      }
    }
    return validate
  }
  calculMontantArticlesSelected(){
    let s = 0
    for(const art of this.tacheSelected.listeArticles){
      s=s+(art.prix*art.quantitee)
    }
    for(const tc of this.taches){
      if(this.tacheSelected.code!=tc.code){
        for(const art of tc.listeArticles){
          s=s+(art.prix*art.quantitee)
        }
      }
    }
    for(const tc of this.tachesPredec){
      for(const art of tc.articlesassociation){
        s=s+(art.prix*art.quantitee)
      }
    }
    return s
  }
  validerMontant(): boolean{
    let values = this.calculeTotal()
    let s = values[0], d=values[1]
    if(s<=this.bcSelected.montant){
      return true
    }else{
      for(var i=0; i<this.tachesValidated.length; i++){
        this.tachesValidated[i].stat=0
      }
      this.err_montant=true;
      return false
    }
  }
  calculeTotal(){
    let s = 0, d = 0
    for(const tc of this.taches){
      for(const art of tc.listeArticles){
        s=s+(art.prix*art.quantitee)
      }
    }
    for(const tc of this.tachesPredec){
      for(const art of tc.articlesassociation){
        s=s+(art.prix*art.quantitee)
      }
    }
    return [s, d]
  }
  saveTache(){
    if(this.validerMontant()==true){
      let len_arts = 0, i=0
      for(const tc of this.taches){
        len_arts=+ tc.listeArticles.length
      }
      for(const tc of this.taches){
        this.tachserv.addTache(tc.bondecommande_id, tc).subscribe(
          (res: any)=>{
            if(this.predecessors.length>0){
              let ind = this.predecessors.findIndex((elem: any)=>{ return elem.taskATravCode==res.code; })
              if(ind != -1){
                let preds = this.predecessors[ind].preds
                for(const pred of preds){
                  this.tachpredserv.add(res.id, pred.taskPTravId).subscribe(
                    (res:any)=>{}
                  )
                }
              }
            }
            if(tc.listeArticles.length>0){
              for(const art of tc.listeArticles){
                let article = {
                  article_id: art.id,
                  tache_id: res.id,
                  prix: art.prix,
                  quantitee: art.quantitee
                }
                this.taasserv.addArticleToTache(res.id, art.id, article).subscribe(
                  (res: any)=>{
                    i++
                    if(len_arts==i){
  
                      var x = document.getElementById("toast")
                      x!.className = "show";
                      setTimeout(function(){ x!.className = x!.className.replace("show", ""); }, 5000);
                      
                      this.bcIdSelected=null
                      this.bcSelected=null
                      this.taches = []
                      this.tachesValidated = []
                      this.tacheSelected= new Tache()
  
                      this.draftListArticles = []
                      this.tache_to_delete= new Tache()
  
                      this.to_confirm = false; this.bc_confirmed=false; this.add_tache=false;
                      this.add_article=false; this.edit_tache=false; this.delete_tache=false;
                      this.art_step=2
  
                      this.tacheForm.reset()
                      this.articleForm.reset()
                      this.choixBcForm.reset()
                      this.editTacheForm.reset()
                      this.code_marchee = ""
                      this.choixBcForm.controls['bondecommande_id'].enable();
                    }
                  }, (err: any)=>{ console.log(err) }
                )
              }
            }else{
  
              var x = document.getElementById("toast")
              x!.className = "show";
              setTimeout(function(){ x!.className = x!.className.replace("show", ""); }, 5000);
              
              this.bcIdSelected=null
              this.bcSelected=null
              this.taches = []
              this.tachesValidated = []
              this.tacheSelected= new Tache()

              this.draftListArticles = []
              this.tache_to_delete= new Tache()

              this.to_confirm = false; this.bc_confirmed=false; this.add_tache=false;
              this.add_article=false; this.edit_tache=false; this.delete_tache=false;
              this.art_step=2

              this.tacheForm.reset()
              this.articleForm.reset()
              this.choixBcForm.reset()
              this.editTacheForm.reset()
              this.code_marchee = ""
              this.choixBcForm.controls['bondecommande_id'].enable();
            }
          }, (err: any)=>{ console.log(err) }
        )
      }
    }
  }

  formatDate (date: any) {
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    let year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }
}
