import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Demande } from 'src/app/model/Demande';
import { Organisation } from 'src/app/model/Organisation';
import { Secteur } from 'src/app/model/Secteur';
import { DemandeService } from 'src/app/service/demande.service';
import { OrganisationServiceService } from 'src/app/service/organisation-service.service';
import { SecteurService } from 'src/app/service/secteur.service';

@Component({
  selector: 'app-doinscription',
  templateUrl: './doinscription.component.html',
  styleUrls: ['./doinscription.component.css']
})
export class DoinscriptionComponent implements OnInit {
demande=new Demande();
demandes !:Demande[];
secteurs!:Secteur[]
imgURL:any;
userFile:any;
 message:string='';
 notification=0
 organisation=new Organisation()

public imagePath:any;
  constructor( private orgService:OrganisationServiceService,private _servicedemande:DemandeService, private secteurService:SecteurService) { }

  ngOnInit(): void {
    this.getSecteurs();

  }






  // methode pour l' upload d'image


  public onAddDemande(addForm: NgForm): void {


    const formData=new FormData();
    const demande=addForm.value;
    formData.append('demande',JSON.stringify(demande));
    formData.append('file',this.userFile)
    if((demande.nom=="CPMGROUP")&&(demande.code=="CPMGROUP")){
      this.organisation.nom=this.demande.nom;
      this.organisation.code=this.demande.code;
      this.organisation.secteur_d_activite=this.demande.secteur_d_activite;
      this.organisation.email=this.demande.email;
      this.organisation.pays=this.demande.pays;
      this.organisation.region=this.demande.region;
      this.organisation.adresse=this.demande.adresse;
      this.organisation.tel=this.demande.telOrg;
      this.organisation.type=this.demande.type;
      this.organisation.nomDG=this.demande.nomDG;
      this.organisation.telDG=this.demande.telDG;
      this.organisation.emailDG=this.demande.emailDG;
      this.organisation.nomAdmin=this.demande.nomAdmin;
      this.organisation.telAdmin=this.demande.telAdmin;
      this.organisation.emailAdmin=this.demande.emailAdmin
      this.organisation.filename=this.demande.filename;
      this.organisation.document=this.demande.documentpath;
       console.log(this.organisation)
       this.saveNewOrganisation(this.organisation);
    }


 else{
     this._servicedemande.createDemande(formData).subscribe(
       (response: Demande) => {
         console.log(response);
        this.notification=1
        addForm.reset();
       },
       (error: HttpErrorResponse) => {
         alert(error.message);
         console.log("erreur");
         //addForm.reset();
       }
     );
      }  
   
}

saveNewOrganisation(organisation:Organisation){
  this.orgService.addOrganisation(organisation).subscribe(
    (data:Organisation)=>{
      this.organisation=data
      console.log(data);
      alert("organisation enregistrer")
      alert(" l id de l'organisation est"+this.organisation.id)
       //ajouter email,code ,idORG,idRole a la table prospect
    },

      ( ( error: any) =>{
        console.log(error)
      alert(" organisation n'est pas enregistrer !")})
  )
      }

onSelectFile(event:any){
  if (event.target.files.length>0){
    const file=event.target.files[0];
    this.userFile=file;
    //this.f['profile'].setValue(file);
    var mimeType =event.target.files[0].type;
    if(mimeType.match(/image\/*/)==null){
 this.message="Only images are suported.";
 return;
    }
    var reader= new FileReader();
    this.imagePath=file;
    reader.readAsDataURL(file);
    reader.onload=(_event)=>{
      this.imgURL=reader.result;
    }
  }
   }
   

/*public onAddDemande(addForm: NgForm): void {
  // document.getElementById('add-employee-form').click();

  const demande=addForm.value;
  const formData=new FormData();
  formData.append('user',JSON.stringify(demande));
  formData.append('file',this.userFile);
   this._servicedemande.addDemande2(formData).subscribe(
     (response: Demande) => {
       console.log(response);
       console.log("accepteeeee");
      addForm.reset();
     },
     (error: HttpErrorResponse) => {
       alert(error.message);
       console.log("erreur");
      
     }
   );
 
}*/

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


    


  // 5edmet abbes(video)
 /* if( event.target.files.length>0){
    const file=event.target.files[0];
    this.userFile=file;
    //this.f['profile].setValue(file)
    var mimeType=event.target.files[0];*/
   // if(mimeType.match(/image\*/)==null){
     /* this.message="only images are supported";
      return;
    }



    var reader=new FileReader();
    this.imagePath=file;
    reader.readAsDataURL(file);
    reader.onload=(_event)=>{
      this.imgURL=reader.result;
    }
  }

}*/



}
  
