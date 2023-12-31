import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjouterOrganisationComponent } from './ajouter-organisation/ajouter-organisation.component';
import { GererComptesComponent } from './CPM/gerer-comptes/gerer-comptes.component';
import { GestionUtulisateurComponent } from './CPM/gestion-utulisateur/gestion-utulisateur.component';
import { NouveauSecteurComponent } from './CPM/nouveau-secteur/nouveau-secteur.component';
import { SecteurComponent } from './CPM/secteur/secteur.component';
import { SendEmailUserComponent } from './CPM/send-email-user/send-email-user.component';
import { UserDetailComponent } from './CPM/user-detail/user-detail.component';
import { DetailComponent } from './detail/detail.component';
import { EntreprisePopupComponent } from './entreprise-popup/entreprise-popup.component';
//import { ArticlespecifieeComponent } from './espaceMyCPM/articlespecifiee/articlespecifiee.component';
//import { DetailOrganisationComponent } from './espaceMyCPM/detail-organisation/detail-organisation.component';

import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AdminCPMGuard } from './guards/admin-cpm.guard';
import { AdminMYCPMGuard } from './guards/admin-mycpm.guard';
import { DemandeComponent } from './Inscription/demande/demande.component';
import { DoinscriptionComponent } from './Inscription/doinscription/doinscription.component';
import { FileUploadComponent } from './Inscription/file-upload/file-upload.component';
import { FirstInscriptionComponent } from './Inscription/first-inscription/first-inscription.component';
import { FirstPageComponent } from './Inscription/first-page/first-page.component';
import { InscriptionetdemandesComponent } from './Inscription/inscriptionetdemandes/inscriptionetdemandes.component';
import { ListeDemandesComponent } from './Inscription/liste-demandes/liste-demandes.component';
import { LoginComponent } from './Inscription/login/login.component';
import { OneDemandeComponent } from './Inscription/one-demande/one-demande.component';
import { RegisterComponent } from './Inscription/register/register.component';
import { SendMailComponent } from './Inscription/send-mail/send-mail.component';
import { WorningEmailComponent } from './Inscription/worning-email/worning-email.component';
import { ManagementGuard } from './management.guard';

import { MenuComponent } from './menu/menu.component';
import { OrganisationComponent } from './organisation/organisation.component';
import { GestionMetiersComponent } from './sectionOrganisation/gestion-metiers/gestion-metiers.component';
import { ArticleComponent } from './Articles/article/article.component';
import { TypesComponent } from './Articles/types/types.component';
import { ConsulterMarcheesComponent } from './Marchee/consulter-marchees/consulter-marchees.component';
import { MenuMycpmComponent } from './espaceMyCPM/menu-mycpm/menu-mycpm.component';
import { MarcheeComponent } from './Marchee/marchee/marchee.component';
import { EntreprisesComponent } from './sectionOrganisation/entreprises/entreprises.component';
import { DetailOrganisationComponent } from './sectionOrganisation/detail-organisation/detail-organisation.component';
import { ArticlespecifieeComponent } from './sectionOrganisation/articlespecifiee/articlespecifiee.component';
import { UserProfileComponent } from './Inscription/user-profile/user-profile.component';
import { AddTacheComponent } from './taches/add-tache/add-tache.component';
import { TachesComponent } from './taches/taches.component';
import { ChartGanttComponent } from './taches/chart-gantt/chart-gantt.component';
import { EditOrganisationComponent } from './sectionOrganisation/edit-organisation/edit-organisation.component';

const routes: Routes = [
  { path:'firstPage',component:FirstPageComponent},
  { path:'sendToUser/:id',component:SendEmailUserComponent},
  { path:'inscritEmployee',component:FirstInscriptionComponent},
  { path:'passerdemande',component:DoinscriptionComponent},
  { path:'upload',component:FileUploadComponent},
  { path:'nouveauSecteur',component:NouveauSecteurComponent},
  { path:'warningMail/:id',component:WorningEmailComponent},
  { path:'DemandeDetail/:id',component:OneDemandeComponent},
  { path:'login',component:LoginComponent},
  { path:'register',component:RegisterComponent},
  { path:'send/:id',component:SendMailComponent},
  { path:'forbidden', component:ForbiddenComponent},
  { path:'userDetail/:id',component:UserDetailComponent},
  { path:'cpm',component:MenuComponent,
    children:[
      { path:'DetailOrg/:id', component:DetailOrganisationComponent},
      { path:'userProfile',component:UserProfileComponent},
      { path:'addOrganisation',component:AjouterOrganisationComponent},
      { path:'editOrganisation/:id',component:EditOrganisationComponent},
      { path:'organisations',component:OrganisationComponent},
      { path:'detail',component:DetailComponent},
      { path:'secteur',component:SecteurComponent,canActivate:[AdminCPMGuard]},
      { path:'Demande',component:DemandeComponent,canActivate:[AdminCPMGuard]},
      { path:'gererComptes',component:GererComptesComponent,canActivate:[AdminCPMGuard]},
      { path:'listeDemande',component:ListeDemandesComponent,canActivate:[AdminCPMGuard]},
      { path:'gestionUtulisateur',component:GestionUtulisateurComponent},
      { path:'table',component:FileUploadComponent},
    ]
  },
  { path:'mycpm',component:MenuMycpmComponent,children:[
    { path:'marchee',component:MarcheeComponent},
    { path:'popup',component:EntreprisePopupComponent,canActivate:[AdminMYCPMGuard]},
    { path:'gererComptes',component:GererComptesComponent},
    { path:'articlesSpecifiees/:id',component:ArticlespecifieeComponent},
    { path:'metiers',component:GestionMetiersComponent},
    { path:'articles',component:ArticleComponent},
    { path:'types',component:TypesComponent},
    { path:'consulterMarchees',component:ConsulterMarcheesComponent}
  ]},
  { path:'taches',component:MenuMycpmComponent,
    children:[
      { path:'',component: TachesComponent},
      { path:'create-tache',component:AddTacheComponent},
      { path:'chart',component:ChartGanttComponent},
    ]
  },
  {path:'**',redirectTo:'mycpm',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
