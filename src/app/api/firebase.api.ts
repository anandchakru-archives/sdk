import { ISdkApi } from "./api";
import { ICustomerInviteDB, IInviteDB, IBaseDB } from "../pojo/invite";
import { Observable, EMPTY, from, } from "rxjs";
import { map } from "rxjs/operators";


export class FirebaseSdkApi extends ISdkApi {
  private firebase = (window as any).firebase;
  private fdb: any;

  getInviteFromDB(callback?: ((invite: IInviteDB) => void) | undefined): void {
    if (!this.fdb) {
      this.fdb = this.firebase.firestore();
    }
    this.fdb.collection('nivites').doc(this.iOid).get().then((document: any) => {
      if (!document.exists) {
        console.log('Could not find invite.');
      }
      this.invite = document.data();
      this.invite.oid = this.iOid ? this.iOid : '';
      if (this.ciOid) {
        this.fdb.collection('nivites/' + this.iOid + '/customerInvites').doc(this.ciOid).get().then((ciDoc: any) => {
          if (ciDoc.exists) {
            this.invite.customerInvite = ciDoc.data();
            if (this.invite.customerInvite) {
              this.invite.customerInvite.oid = this.ciOid ? this.ciOid : '';
              this.invite.customerInvite.customer = {
                oid: this.invite.customerInvite.customerUid,
                uid: this.invite.customerInvite.customerUid,
                name: this.invite.customerInvite.customerName,
                email: this.invite.customerInvite.customerEmail
              };
            }
          }
          this.broadcastInvite();
          callback && callback(document.val());
        }).catch((e: any) => {
          console.log('Error fetching customerInvite:' + e);
          this.broadcastInvite();
          callback && callback(document.val());
        });
      }
    });
  }

  upsertRsvp(customerInvite: ICustomerInviteDB): Observable<IBaseDB> {
    if (customerInvite.oid) {           // UPDATE
      customerInvite.customerId = 0;    // firebase does not allow undefined to be saved
      customerInvite.inviteId = 0;      // firebase does not allow undefined to be saved
      return from(new Promise((resolve, reject) => {
        return this.fdb.collection('nivites/' + this.iOid + '/customerInvites').doc(customerInvite.oid).set(customerInvite, { merge: true })
          .then((error: any) => {
            if (!error) {
              resolve(customerInvite);
            } else {
              reject(customerInvite);
            }
          });
      })).pipe(map((rsp: any) => {
        return customerInvite;
      }));
    } else {                            // INSERT
      customerInvite.customerId = 0;    // firebase does not allow undefined to be saved
      customerInvite.inviteId = 0;      // firebase does not allow undefined to be saved
      return from(new Promise((resolve, reject) => {
        return this.fdb.collection('nivites/' + this.iOid + '/customerInvites').add(customerInvite)
          .then((ref: any) => {
            this.ciOid = ref.id;
            customerInvite.oid = ref.id;
            resolve(customerInvite);
          });
      })).pipe(map((rsp: any) => {
        return customerInvite;
      }));
    }
  }
}