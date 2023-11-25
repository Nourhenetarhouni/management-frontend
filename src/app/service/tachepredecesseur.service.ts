import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TachepredecesseurService {
  private apiServeUrl =environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  
  public findAllByTacheATravId(tacheATravId:number): Observable<any>{
    return this.http.get<any>(`${this.apiServeUrl}/admin/tachespredecesseurs/tachebyatravid/${tacheATravId}`)
  }

  public findById(tpId:number): Observable<any>{
    return this.http.get<any>(`${this.apiServeUrl}/admin/tachespredecesseurs/${tpId}/byid`)
  }

  public all(): Observable<any>{
    return this.http.get<any>(`${this.apiServeUrl}/admin/tachespredecesseurs`)
  }

  public add(tacheATravId: any, tachePTravId: any): Observable<any>{
    return this.http.post<any>(`${this.apiServeUrl}/admin/tachespredecesseurs/add/${tacheATravId}/${tachePTravId}`, [])
  }

  public delete(tacheATravId: any, tachePTravId: any): Observable<any>{
    return this.http.post<any>(`${this.apiServeUrl}/admin/tachespredecesseurs/delete/${tacheATravId}/${tachePTravId}`, [])
  }
}