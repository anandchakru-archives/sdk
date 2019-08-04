import { IInviteDB, IBaseDB, ICustomerInviteDB } from "../pojo/invite";
import { Observable, ReplaySubject } from "rxjs";
import { CE_LOADED } from "../const/constants";

export abstract class ISdkApi {
  public loaded = new ReplaySubject(1);
  public invite: IInviteDB = { title: 'Default Title' };
  private url = new URL(window.location.href).searchParams;
  public iOid = this.url.get('iOid');         // [required] Invite oid - identifies invite
  public ciOid = this.url.get('ciOid');       // [optional] CustomerInvite oid - identifies customerInvite
  public lport = this.url.get('lp');          // [optional] Local & Port http://localhost:8080 and not https://api.nivite.com
  public disablAlert = this.url.get('da');    // [optional] Disable-built-In-Alert
  public sample = this.url.get('sj');         // [optional] Fall back to sdk's sample.json, if backend is down/unreachable
  public lsample = this.url.get('lsj');       // [optional] Fall back to local sample.json, if backend is down/unreachable
  private api = this.url.get('plug');         // [optional] Default - firebase, work in progress for api.nivite.com, github.com

  abstract getInviteFromDB(callback?: (invite: IInviteDB) => void): void;
  abstract upsertRsvp(customerInvite: ICustomerInviteDB): Observable<IBaseDB>;

  dispatchCustomEvent(id: string, data: any) {
    const nivite = document.getElementById('nivite');
    if (nivite) {
      const customEvent = document.createEvent('CustomEvent');
      customEvent.initCustomEvent(id, true, false, data);
      nivite.dispatchEvent(customEvent);
    }
  }
  broadcastInvite() {
    this.loaded.next(this.invite);
    this.dispatchCustomEvent(CE_LOADED, this.invite);
  }
}