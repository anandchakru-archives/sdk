import { IBaseDB, IInviteDB, ICustomerInviteDB } from "../pojo/invite";
import { ReplaySubject, of, from, Observable } from 'rxjs';
import { CE_LOADED, CE_ALERT } from "../const/constants";

export class ApiService {
  private url = new URL(window.location.href).searchParams;

  public invite: IInviteDB = { title: 'Default Title' };
  public loaded = new ReplaySubject(1);
  public iOid = this.url.get('iOid');         // [required] Invite oid - identifies invite
  public ciOid = this.url.get('ciOid');       // [optional] CustomerInvite oid - identifies customerInvite
  public lport = this.url.get('lp');          // [optional] Local & Port http://localhost:8080 and not https://api.nivite.com
  public disablAlert = this.url.get('da');    // [optional] Disable-built-In-Alert
  public sample = this.url.get('sj');         // [optional] Fall back to sdk's sample.json, if backend is down/unreachable
  public lsample = this.url.get('lsj');       // [optional] Fall back to local sample.json, if backend is down/unreachable
  constructor(private host: string = '//api.nivite.com') {
    if (!this.supports()) {
      alert('EmbEr: Unable to make Ajax calls to the server.'); // EmbEr = Embarassing Error
    }
    if (this.lport) {
      // if &lport=8080, use http://localhost:8080 instead of api.nivite.com
      this.host = 'http://localhost:' + this.lport;
    }
    if (this.iOid) {
      const url = this.host + '/repo/invite/search/byOid?oid=' + this.iOid + (this.ciOid ? ('&ciOid=' + this.ciOid) : ('')) + '&projection=preview';
      this.get(url).then((rsp: IBaseDB) => {
        this.invite = rsp as IInviteDB;
        this.broadcastInvite();
      }).catch((e) => {
        console.log('Unable to fetch Invite: ' + JSON.stringify(e));
        this.loadsample();
      });
    } else {
      this.loadsample();
    }
  }
  public upsertRsvp(customerInvite: ICustomerInviteDB): Observable<IBaseDB> {
    if (customerInvite.customerId) {
      return from(this.put(this.host + '/api/public/rsvp', customerInvite));
    } else {
      return from(this.post(this.host + '/api/public/rsvp', customerInvite));
    }
  }
  public dispatchCustomEvent(id: string, data: any) {
    const nivite = document.getElementById('nivite');
    if (nivite) {
      const customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(id, true, false, data);
      nivite.dispatchEvent(customEvent);
    }
  }
  private broadcastInvite() {
    this.loaded.next(this.invite);
    this.dispatchCustomEvent(CE_LOADED, this.invite);
  }
  private loadsample() {
    if (this.sample || this.lsample) {
      this.dispatchCustomEvent(CE_ALERT, { type: 'warning', msg: 'Not an actual Invite. Using sample.json for demo.', data: {} });
      this.get(this.lsample ? 'sample.json' : '//nivite.github.io/sdk/sample.json').then((rsp: IBaseDB) => {
        this.invite = rsp as IInviteDB;
        this.broadcastInvite();
      }, () => {
        this.dispatchCustomEvent(CE_ALERT, { type: 'danger', msg: 'Unable to load sample.json. Please report the issue.', data: {} });
      });
    } else {
      this.dispatchCustomEvent(CE_ALERT, { type: 'danger', msg: 'Unable to reach backend, please try again after sometime. If you want use a sample data, append `&sj=1` in the url', data: {} });
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
