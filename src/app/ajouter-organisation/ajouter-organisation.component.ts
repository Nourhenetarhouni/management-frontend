import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { EntreprisePopupComponent } from '../entreprise-popup/entreprise-popup.component';
import { Organisation } from '../model/Organisation';
import { Secteur } from '../model/Secteur';
import { EntrepriseServiceService } from '../service/entreprise-service.service';
import { OrganisationServiceService } from '../service/organisation-service.service';
import { SecteurService } from '../service/secteur.service';

@Component({
  selector: 'app-ajouter-organisation',
  templateUrl: './ajouter-organisation.component.html',
  styleUrls: ['./ajouter-organisation.component.css']
})
export class AjouterOrganisationComponent implements OnInit {
 
  idOrgan!: number;
  secteurs!: Secteur[];
  err = false; err_msg = "Vérifier tous les champs obligatoires"
  

  constructor(private dialogRef:MatDialog,private organisationService:OrganisationServiceService,private EntrepriseService:EntrepriseServiceService,private secteurService:SecteurService) { }

  ngOnInit(): void {
    this.getSecteurs();
    this.organisationService.getOneOrganisation(2).subscribe(
      (response:Organisation)=>{
        console.log(response);
      },
      (error:HttpErrorResponse)=>{
        alert(error.message);
       }
    );
      }
  
  openDialog()
    {
      const dialogConfig = new MatDialogConfig();
      // The user can't close the dialog by clicking outside its body
      dialogConfig.disableClose = true;
      dialogConfig.id = "modal-component";
      dialogConfig.height = "350px";
      dialogConfig.width = "600px";
      // https://material.angular.io/components/dialog/overview
      const modalDialog = this.dialogRef.open(EntreprisePopupComponent, dialogConfig);
  }
 

  errors = {
    org_nom: {org_nom_err: false, org_nom_msg: "Nom d'organisation est déjà existe"},
    org_code: {org_code_err: false, org_code_msg: "Code d'organisation est déjà existe"},
    org_email: {org_email_err: false, org_email_msg: "Vérifier le format d'email"},
    org_tel: {org_tel_err: false, org_tel_msg: "Vérifier le format de téléphone"},
    dg_tel: {dg_tel_err: false, dg_tel_msg: "Vérifier le format de téléphone"},
    dg_email: {dg_email_err: false, dg_email_msg: "Vérifier le format de téléphone"},
  }
  //ajouter une organisation
  public onAddOrganisation(addOrganisationForm:NgForm):void{
    this.errors.org_email.org_email_err = false;this.errors.org_tel.org_tel_err = false;
    this.errors.org_nom.org_nom_err = false;this.errors.org_code.org_code_err = false;
    this.errors.dg_tel.dg_tel_err = false;this.errors.dg_email.dg_email_err = false;
    this.err = false
    if(
      addOrganisationForm.value.nom == ""||addOrganisationForm.value.code == ""
      ||addOrganisationForm.value.secteur_d_activite == ""||addOrganisationForm.value.email == ""
      ||addOrganisationForm.value.pays == ""||addOrganisationForm.value.region == ""
      ||addOrganisationForm.value.adresse == ""||addOrganisationForm.value.type == ""
      ||addOrganisationForm.value.nomDG == ""||addOrganisationForm.value.telDG == ""
      ||addOrganisationForm.value.emailDG == ""
    ){
      this.err = true
      return
    }
    if(!this.isEmail(addOrganisationForm.value.email)){ this.errors.org_email.org_email_err = true; return }
    if(addOrganisationForm.value.tel==0||addOrganisationForm.value.tel.length<4||addOrganisationForm.value.tel.length>15){
      this.errors.org_tel.org_tel_err = true;
      return
    }
    if(addOrganisationForm.value.telDG==0||addOrganisationForm.value.telDG.length<4||addOrganisationForm.value.telDG.length>15){
      this.errors.dg_tel.dg_tel_err = true; return
    }
    if(!this.isEmail(addOrganisationForm.value.emailDG)){ this.errors.dg_email.dg_email_err = true; return }
    this.organisationService.getOrganisations().subscribe(
      (res: any)=>{
        let orgs: [] = res
        let filt_by_nom = orgs.filter((e: any)=>{ return e.nom==addOrganisationForm.value.nom; }).length
        let filt_by_code = orgs.filter((e: any)=>{ return e.code==addOrganisationForm.value.code; }).length
        if(filt_by_nom>0){
          this.errors.org_nom.org_nom_err = true;
          return
        }else if(filt_by_code>0){
          this.errors.org_code.org_code_err = true;
          return
        }else{
          this.organisationService.addOrganisation(addOrganisationForm.value).subscribe(
             (Response:Organisation)=>{
              console.log(Response);
            
             // this.getOrganisations();
              addOrganisationForm.reset();
            },
            (error:HttpErrorResponse)=>{
              error.message;
            }
          );
        }
      }, (err: any)=>{}
    )
  }
  //récuperer la liste des secteurs d'activités
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
  
  isEmail(email: any){
    var regex = /^(([^<>()[]\.,;:s@]+(.[^<>()[]\.,;:s@]+)*)|(.+))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
    if (regex.test(email)){
      return true
    }else{
      return false
    }
  }
  isPhone(tel: any){
    var regex = new RegExp(/^(06|07)[0-9]{8}/gi);
    if (regex.test(tel)){
      return true
    }else{
      return false
    }
  }

  
   
    
   
   
   
    /* this.EntrepriseService.addEntreprise(addEntrepriseForm.value).subscribe(
      (Response:Entreprise)=>{
        console.log(Response);
       // this.getOrganisations();
        addEntrepriseForm.reset();
      },
      (error:HttpErrorResponse)=>{error.message;
        addEntrepriseForm.reset();
      }
    );*/
  
  
  

}
