import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IInviteDB, ICustomerInviteDB } from '../pojos/invite';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http: HttpClient;
  constructor(private injector: Injector) {
    this.http = this.injector.get(HttpClient);
  }
  fetchInvite(inviteOid: string, customerInviteOid: string): Observable<IInviteDB> {
    return this.http.get<IInviteDB>('http://localhost:8080/repo/invite/search/byOid?oid='
      + inviteOid + (customerInviteOid ? ('&ciOid=' + customerInviteOid) : ('')) + '&projection=preview');
  }
  upsertRsvp(customerInvite: ICustomerInviteDB): Observable<ICustomerInviteDB> {
    if (customerInvite.customerId) {
      return this.http.put<ICustomerInviteDB>('http://localhost:8080/api/public/rsvp', customerInvite);
    } else {
      return this.http.post<ICustomerInviteDB>('http://localhost:8080/api/public/rsvp', customerInvite);
    }
  }
}
