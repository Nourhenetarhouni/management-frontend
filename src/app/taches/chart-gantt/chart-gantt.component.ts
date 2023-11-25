import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import "dhtmlx-gantt";
import { gantt } from 'dhtmlx-gantt';


import { BondeCommande } from 'src/app/model/BondeCommande';
import { Tache } from 'src/app/model/Tache';
import { ArticleService } from 'src/app/service/article.service';
import { BondeCommandeService } from 'src/app/service/bonde-commande.service';
import { MarcheeService } from 'src/app/service/marchee.service';
import { TacheArticleAssocService } from 'src/app/service/tache-article-assoc.service';
import { TacheService } from 'src/app/service/tache.service';
import { TachepredecesseurService } from 'src/app/service/tachepredecesseur.service';

@Component({
  selector: 'app-chart-gantt',
  templateUrl: './chart-gantt.component.html',
  styleUrls: ['./chart-gantt.component.css']
})
export class ChartGanttComponent implements OnInit {
  @ViewChild("gantt_here", {static: true}) ganttContainer: ElementRef | undefined;
  
  data_chart_gantt: any = []
  is_done_tst = false

  constructor(
    private marchserv: MarcheeService,
    private bcserv: BondeCommandeService,
    private tachserv: TacheService,
    private tachpredserv: TachepredecesseurService,
    private taasserv: TacheArticleAssocService,
    private fb: FormBuilder,
    private artserv: ArticleService
  ) { }

  
  bcs!: BondeCommande []
  taches: any = []
  avanc_edit_stat: number[] = []
  avanc_err=false
  is_done = false
  edit_avanc_tache = false

  code_marchee=""
  bcId=""

  bc_selected=false; article_op=false

  err_marchee=false; err_msg="";

  ngOnInit(): void {
    gantt.config.readonly = true;
    gantt.config.sort = true;
    gantt.init(this.ganttContainer?.nativeElement);
  }


  importMarcheeByCode($event: any, from: any){
    this.err_marchee = false
    let code = from==1 ? $event : $event.target.value
    let task_links: any = []
    let i =0, j=0, id_count=1, id_count_link=1
    gantt.config.sort = true; 
    gantt.clearAll()
    this.marchserv.getMarcheebyCode(code).subscribe(
      (res: any)=>{
        this.bcs = res.bondes
        let task: any = []
        let x=0, y=0
        for(const bc of this.bcs){
          this.tachserv.getTachebyBcId(""+bc.id+"").subscribe(
            (res: any)=>{
              x += res.length
              let taches=res
              let old_date = new Date(new Date(bc.dateDebutNewBC).getTime()).toLocaleDateString()
              let task = {
                "id": id_count,
                "text": bc.id+" | "+bc.delais+" jours",
                "start_date": new Date(new Date(bc.dateDebutNewBC).getTime()).toLocaleDateString(),
                "duration": bc.delais,
                "progress": 0,
                "type": "project",
                "open": true,
              }
              gantt.addTask(task)
              
              let selector = "[data-task-id='"+id_count+"']"
              let task_tag = document.querySelectorAll(selector)!
              
              let parent_id = id_count; j++; id_count++
              
              let delai_tot = 0
              for(const tc_ of taches){
                this.taches.push(tc_)
                this.avanc_edit_stat.push(0)
                task_links.push({tcId: tc_.id, tcIdAnim: id_count})
                let task = {
                  "id": id_count,
                  "text": tc_.nom,
                  "start_date": new Date(new Date(tc_.dateDebutNewBC).getTime()).toLocaleDateString(),
                  "duration": tc_.delais,
                  "progress": tc_.avancement/100,
                  "parent": parent_id,
                }
                gantt.addTask(task)
                this.tachpredserv.findAllByTacheATravId(tc_.id).subscribe(
                  (res: any)=>{
                    x += res.length
                    for(var y=0; y<res.length; y++){
                      let targetId = task_links.findIndex((elem: any)=>{ return elem.tcId==tc_.id; })
                      let sourceId = task_links.findIndex((elem: any)=>{ return elem.tcId==res[y].tache_p_trav_id.id; })
                      let link = {
                        id:id_count_link,
                        source:task_links[sourceId].tcIdAnim,
                        target:task_links[targetId].tcIdAnim,
                        type:gantt.config.links.finish_to_start
                      }
                      id_count_link++;y++;
                      gantt.addLink(link)
                    }
                  }
                )
                gantt.config.sort = true; 
                delai_tot=delai_tot+tc_.delais
                old_date = new Date(new Date(bc.dateDebutNewBC).getTime() + delai_tot*24*60*60*1000).toLocaleDateString()
                j++;id_count++;y++;
              }
              if(x==y){
                this.is_done = true
              }
              i++;
            }
          )
        }
      }, (err: any)=>{
        this.err_msg="Marchée n'existe pas"
        this.err_marchee = true
        this.taches = []
        this.bc_selected = false
      }
    )
  }
  changeAvancement($event: any, tcId: any){
    this.avanc_edit_stat.forEach((v, i)=>{ this.avanc_edit_stat[i]=0; })
    this.tachpredserv.findAllByTacheATravId(tcId).subscribe(
      (res: any)=>{
        let is_done = true
        if(res.length>0){
          for(const art of res){
            let ind0 = this.taches.findIndex((e: any)=>{ return e.id==art.tache_p_trav_id.id })
            if(ind0!=-1){
              if(this.taches[ind0].avancement!=100){
                is_done = false
              }
            }
          }
        }
        if(is_done==true){
          let ind = this.taches.findIndex((e: any)=>{ return e.id==tcId })
          if($event.target.value!=""){
            this.taches[ind].avancement=parseInt($event.target.value)
          }else{
            this.taches[ind].avancement=0
          }
        }else if($event.target.value!="" && parseInt($event.target.value)!=0){
          let ind = this.taches.findIndex((e: any)=>{ return e.id==tcId })
          this.avanc_edit_stat[ind] = 1
        }
      }, (err: any)=>{

      }
    )
  }
  saveAvancements(){
    let qtt = this.taches.length
    let i = 0
    this.avanc_err = false
    let ind0 = this.avanc_edit_stat.filter((e: any)=>{ return e==1; })
    if(ind0.length>0){
      this.avanc_err = true
      return
    }
    if(qtt>0){
      for(const tc of this.taches){
        this.tachserv.changeTache(tc.id, tc).subscribe(
          (res: any)=>{
            i++
            if(qtt==i){
              this.edit_avanc_tache = false
              this.taches = []
              this.importMarcheeByCode(this.code_marchee, 1)
            }
          }, (err: any)=>{
            i++
            if(qtt==i){ }
          }
        )
      }
    }else{
      this.edit_avanc_tache = false
    }
    
  }
}
