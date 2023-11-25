import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Organisation } from 'src/app/model/Organisation';
import { Secteur } from 'src/app/model/Secteur';
import { OrganisationServiceService } from 'src/app/service/organisation-service.service';
import { SecteurService } from 'src/app/service/secteur.service';

@Component({
  selector: 'app-edit-organisation',
  templateUrl: './edit-organisation.component.html',
  styleUrls: ['./edit-organisation.component.css']
})
export class EditOrganisationComponent implements OnInit {
 
  constructor(
    private route:ActivatedRoute,
    private orgservice:OrganisationServiceService,
    private fb: FormBuilder,
    private secteurService:SecteurService
  ) { }
  organisation=new Organisation();
  secteurs!: Secteur[];
  id!:number;
  not_found = false
  err = false; err_msg = "Vérifier tous les champs obligatoires"

  editFormOrg = this.fb.group({
    nom : ["", [Validators.required]],
    secteur_d_activite : ["", [Validators.required]],
    email : ["", [Validators.required]],
    pays : ["", [Validators.required]],
    region : ["", [Validators.required]],
    adresse : [""],
    tel : [""],
    type : ["", [Validators.required]],
    nomDG : ["", [Validators.required]],
    telDG : [""],
    emailDG : ["", [Validators.required]],
    nomAdmin : [""],
    telAdmin : [""],
    emailAdmin : [""],
  })

  ngOnInit(): void {
    this.id=this.route.snapshot.params['id'];
    this.organisation=new Organisation();
    this.getSecteurs()
    this.importOrgData()
  }
  importOrgData(){
    this.orgservice.getOrganisationbyId(this.id).subscribe(
      data=>{
        this.organisation=data;
        this.editFormOrg.patchValue({
          "nom": this.organisation.nom==null||this.organisation.nom=="" ? "" : this.organisation.nom,
          "secteur_d_activite": this.organisation.secteur_d_activite==null||this.organisation.secteur_d_activite=="" ? "" : this.organisation.secteur_d_activite,
          "email": this.organisation.email==null||this.organisation.email=="" ? "" : this.organisation.email,
          "adresse": this.organisation.adresse==null||this.organisation.adresse=="" ? "" : this.organisation.adresse,
          "pays": this.organisation.pays==null||this.organisation.pays=="" ? "" : this.organisation.pays,
          "region": this.organisation.region==null||this.organisation.region=="" ? "" : this.organisation.region,
          "tel": this.organisation.tel==null ? "" : this.organisation.tel,
          "type": this.organisation.type==null||this.organisation.type=="" ? "" : this.organisation.type,
          "nomDG": this.organisation.nomDG==null||this.organisation.nomDG=="" ? "" : this.organisation.nomDG,
          "telDG": this.organisation.telDG==null ? "" : this.organisation.telDG,
          "emailDG": this.organisation.emailDG==null||this.organisation.emailDG=="" ? "" : this.organisation.emailDG,
          "nomAdmin": this.organisation.nomAdmin==null||this.organisation.nomAdmin=="" ? "" : this.organisation.nomAdmin,
          "telAdmin": this.organisation.telAdmin==null ? "" : this.organisation.telAdmin,
          "emailAdmin": this.organisation.emailAdmin==null||this.organisation.emailAdmin=="" ? "" : this.organisation.emailAdmin,
        })
        console.log(this.organisation)
      },
      err => {
        this.not_found = true
      }
    )
  }
  //récuperer lregiona liste des secteurs d'activités
  public getSecteurs():void
  {
    this.secteurService.getSecteurs().subscribe(
      (response:Secteur[])=>{
        this.secteurs=response;
      },
      (error:HttpErrorResponse)=>{
        alert(error.message);
       }
    );
  }
  editOrganisation(){
    this.err = false
    let newOrg: Organisation | any = this.editFormOrg.value
    newOrg.id = this.organisation.id
    newOrg.code = this.organisation.code
    Object.keys(newOrg).map((key: any, index)=>{
      if(newOrg[key]==""){newOrg[key]=null;}
    });
    if(!this.editFormOrg.invalid){
      this.orgservice.editOrganisation(this.organisation.id, newOrg).subscribe(
        (res: any)=>{
          var x = document.getElementById("toast")
          x!.className = "show";
          setTimeout(function(){ x!.className = x!.className.replace("show", ""); }, 5000);
        }, (err: any)=>{
          alert(err)
        }
      )
    }else{
      console.log(this.editFormOrg.errors)
      this.err = true
    }
  }
}
