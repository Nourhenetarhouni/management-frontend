import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tache } from '../model/Tache';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private apiServeUrl =environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  public addTache(bcId:number, tache: Tache): Observable<Tache>{
    return this.http.post<Tache>(`${this.apiServeUrl}/admin/bondecommandes/${bcId}/tache`, tache)
  }

  //récuperer la tache par code
  public getTachebyBcId(bcId:string): Observable<Tache>{
    return this.http.get<Tache>(`${this.apiServeUrl}/admin/bondecommandes/${bcId}/taches`);
  }

  //récuperer la tache par code
  public getTachebyCode(codetc:string): Observable<Tache>{
    return this.http.get<Tache>(`${this.apiServeUrl}/admin/tachebycode/${codetc}`);
  }

  changeTache(tcId:number, tache: any){
  return this.http.post<Tache>(`${this.apiServeUrl}/admin/tachebycode/${tcId}`, tache)
  }
}
