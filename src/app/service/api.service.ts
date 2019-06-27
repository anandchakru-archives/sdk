import { IBaseDB, IInviteDB, ICustomerInviteDB } from "../pojo/invite";
import { ReplaySubject, of, from, Observable } from 'rxjs';
import { resolve } from "q";

export class ApiService {
  public invite: IInviteDB = { title: 'Default Title' };
  public loaded = new ReplaySubject(1);
  private url = new URL(window.location.href).searchParams;
  private iOid = this.url.get('iOid');
  private ciOid = this.url.get('ciOid');
  constructor(private host: string = '//localhost:8080') {
    if (!this.supports()) {
      alert('EmbEr: Unable to make Ajax calls to the server.'); // EmbEr = Embarassing Error
    }
    if (this.iOid) {
      const url = this.host + '/repo/invite/search/byOid?oid=' + this.iOid + (this.ciOid ? ('&ciOid=' + this.ciOid) : ('')) + '&projection=preview';
      this.get(url).then((rsp: IBaseDB) => {
        this.invite = rsp as IInviteDB;
        this.loaded.next(this.invite);
      }).catch((e) => {
        console.log('Unable to fetch Invite: ' + e);
      });
    }
  }
  public upsertRsvp(customerInvite: ICustomerInviteDB): Observable<IBaseDB> {
    if (customerInvite.customerId) {
      return from(this.put(this.host + '/api/public/rsvp', customerInvite));
    } else {
      return from(this.post(this.host + '/api/public/rsvp', customerInvite));
    }
  }
  private supports() {
    return 'XMLHttpRequest' in window && 'JSON' in window && 'Promise' in window;
  };
  private get(url: string): Promise<IBaseDB> {
    return this.do('GET', url, undefined);
  }
  private put(url: string, data: IBaseDB): Promise<IBaseDB> {
    return this.do('PUT', url, data);
  }
  private post(url: string, data: IBaseDB): Promise<IBaseDB> {
    return this.do('POST', url, data);
  }
  private do(method: 'PUT' | 'POST' | 'GET', url: string, data: IBaseDB | undefined): Promise<IBaseDB> {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.onreadystatechange = () => {
        if (request.readyState !== 4) {
          return;
        }
        if (request.status >= 200 && request.status < 300) {
          resolve(this.parse(request));
        } else {
          reject({
            responseText: request.responseText,
            status: request.status,
            statusText: request.statusText
          });
        }
      };
      request.open(method, url, true);
      request.setRequestHeader('Content-type', 'application/json;charset=utf-8');
      request.ontimeout = (e) => {
        reject({
          status: 408,
          statusText: 'Request timeout'
        });
      };
      request.timeout = 600000;
      request.responseType = 'text';
      if (method === 'GET') {
        request.send();
      } else {
        request.send(JSON.stringify(data));
      }
    });
  }

  private parse(request: XMLHttpRequest): IBaseDB {
    let result: IBaseDB;
    try {
      result = JSON.parse(request.responseText) as IBaseDB;
    } catch (e) {
      result = {};
    }
    return result;
  }
}
