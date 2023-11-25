import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Article } from '../model/Article';
import { TacheArticleAssoc } from '../model/TacheArticleAssoc';

@Injectable({
  providedIn: 'root'
})
export class TacheArticleAssocService {
  private apiServeUrl =environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public addArticleToTache(tcId:number,articleId:number,tache:any): Observable<TacheArticleAssoc>{
    return this.http.post<TacheArticleAssoc>(`${this.apiServeUrl}/admin/tache/${tcId}/article/${articleId}/articlesbytache`,tache);
  }

}
