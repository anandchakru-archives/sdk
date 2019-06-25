import { Component, OnInit, EventEmitter, Output, OnDestroy, Injector, ElementRef, ViewChild, Input } from '@angular/core';
import { IInviteDB, ICustomerInviteDB } from 'src/app/pojos/invite';
import { AddToCalendarService } from 'src/app/services/add-to-calendar.service';
import { HttpClient } from '@angular/common/http';
import { Subject, interval } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'nivite-sdk-nivite-wrap',
  templateUrl: './nivite-wrap.component.html',
  styleUrls: ['./nivite-wrap.component.scss']
})
export class NiviteWrapComponent implements OnInit, OnDestroy {
  uns = new Subject();
  redirectTimer = 60;
  redirectUrl = '//jrvite.com';
  counter = this.redirectTimer;
  http: HttpClient;
  loading = true;
  savingrsvp = false;
  showEmailInRsvpModalForm = false;
  showEmailInRsvpModalPreviousCustomerInvt: ICustomerInviteDB;
  fg: FormGroup;

  @Input() invite: IInviteDB;
  @Input() inviteOid: string;
  @Input() customerInviteOid: string;

  @Output() loaded = new EventEmitter<IInviteDB>();
  @Output() err = new EventEmitter<string>();
  @Output() rsvp = new EventEmitter<{ status: string, payload: IInviteDB }>();

  @ViewChild('emailFormControl', { static: false }) emailFormControl: ElementRef;

  // tslint:disable-next-line: max-line-length
  constructor(private injector: Injector, private fb: FormBuilder, private route: ActivatedRoute, private router: Router, public atc: AddToCalendarService, public api: ApiService) {
    this.http = this.injector.get(HttpClient);
  }

  ngOnInit() {
    if (this.invite) {
      this.initialize();
    } else {
      const url = new URL(window.location.href).searchParams;
      if (!this.inviteOid) {
        this.inviteOid = url.get('iOid');
        this.customerInviteOid = url.get('ciOid');
      }
      if (this.inviteOid) {
        this.api.fetchInvite(this.inviteOid, this.customerInviteOid).subscribe((invite: IInviteDB) => {
          this.invite = invite;
          this.initialize();
        }, (error => {
          this.initialize();
          this.err.emit(error);
        }));
      } else {
        this.initialize();
        this.err.emit('Missing invite id in: ' + window.location.href);
      }
    }
  }

  ngOnDestroy() {
    this.uns.next();
    this.uns.complete();
  }

  getRsvp(): string {
    if (this.invite && this.invite.customerInvite) {
      switch (this.invite.customerInvite.rsvp) {
        case 'Y':
          return 'Yes';
        case 'N':
          return 'No';
        case 'M':
          return 'Maybe';
        default:
          break;
      }
    }
    return '';
  }
  getUnApproved(): string {
    if (this.invite && this.invite.customerInvite
      && this.invite.customerInvite.role === 'UNAPPROVED') {
      return '*';
    }
    return '';
  }
  getRsvpBadgeClass(): string {
    if (this.invite && this.invite.customerInvite) {
      switch (this.invite.customerInvite.rsvp) {
        case 'Y':
          return 'badge-success';
        case 'N':
          return 'badge-danger';
        case 'M':
          return 'badge-warning';
        default:
          break;
      }
    }
    return '';
  }
  getRsvpTextClass(): string {
    if (this.invite && this.invite.customerInvite) {
      switch (this.invite.customerInvite.rsvp) {
        case 'Y':
          return 'text-success';
        case 'N':
          return 'text-danger';
        case 'M':
          return 'text-warning';
        default:
          break;
      }
    }
    return '';
  }
  navigateToMaps() {
    if (this.invite && this.invite.addrUrl) {
      window.open(this.invite.addrUrl, '_blank');
    }
  }
  isHostOrCollab(): boolean {
    if (this.invite && this.invite.customerInvite && this.invite.customerInvite.role) {
      return this.invite.customerInvite.role === 'HOST' || this.invite.customerInvite.role === 'COLLAB';
    }
    return false;
  }
  isYnm() {
    return (this.invite && this.invite.customerInvite && this.invite.customerInvite.rsvp
      && (this.invite.customerInvite.rsvp === 'Y' || this.invite.customerInvite.rsvp === 'N' || this.invite.customerInvite.rsvp === 'M'));
  }
  isYOrNOrM(rsvp: 'Y' | 'N' | 'M'): boolean {
    return this.invite && this.invite.customerInvite && this.invite.customerInvite.rsvp && (this.invite.customerInvite.rsvp === rsvp);
  }
  private initialize() {
    setTimeout(() => {
      this.loading = false;
      this.initRsvpForm();
      if (!this.invite) {
        interval(1000).pipe(takeWhile(i => !this.invite), takeUntil(this.uns)).subscribe((i: number) => {
          if (i % 10 === 0) {
            if (!this.invite && this.inviteOid) {
              this.api.fetchInvite(this.inviteOid, this.customerInviteOid).subscribe((invite: IInviteDB) => {
                this.invite = invite;
                this.initRsvpForm();
              });
            }
          }
          if (i >= (this.redirectTimer - 1)) {
            window.location.href = this.redirectUrl;
          }
          this.counter--;
        });
      } else {
        this.loaded.emit(this.invite);
      }
    }, 100);
  }
  private initRsvpForm() {
    if (this.invite) {
      this.fg = this.fb.group({
        email: (this.invite.customerInvite && this.invite.customerInvite.customer
          && this.invite.customerInvite.customer.email) ? this.invite.customerInvite.customer.email : '',
        ac: (this.invite.customerInvite && this.invite.customerInvite.adultCount) ? this.invite.customerInvite.adultCount : 1,
        kc: (this.invite.customerInvite && this.invite.customerInvite.kidCount) ? this.invite.customerInvite.kidCount : 1,
        longMsg: (this.invite.customerInvite && this.invite.customerInvite.longMsg ? this.invite.customerInvite.longMsg : ''),
        _customerId: (this.invite.customerInvite && this.invite.customerInvite.customer
          && this.invite.customerInvite.customer) ? this.invite.customerInvite.customer.customerId : null
      });
      if (this.invite && !this.invite.customerInvite) {
        this.showEmailInRsvpModalForm = true;
      }
    }
  }

  resetRsvpForm() {
    this.resetChangeEmail();
    this.fg.patchValue({
      email: (this.invite.customerInvite && this.invite.customerInvite.customer
        && this.invite.customerInvite.customer.email) ? this.invite.customerInvite.customer.email : this.fg.get('email').value,
      ac: (this.invite.customerInvite && this.invite.customerInvite.adultCount)
        ? this.invite.customerInvite.adultCount : 1,
      kc: (this.invite.customerInvite && this.invite.customerInvite.kidCount)
        ? this.invite.customerInvite.kidCount : 1,
      longMsg: (this.invite.customerInvite && this.invite.customerInvite.longMsg
        ? this.invite.customerInvite.longMsg : '')
    });
    if (this.invite && !this.invite.customerInvite) {
      this.showEmailInRsvpModalForm = true;
    }
  }

  public resetChangeEmail() {
    if (this.showEmailInRsvpModalForm) {
      this.invite.customerInvite = this.showEmailInRsvpModalPreviousCustomerInvt;
      this.showEmailInRsvpModalForm = false;
    }
  }

  changeEmail(event: Event) {
    this.showEmailInRsvpModalPreviousCustomerInvt = { ...this.invite.customerInvite };
    this.invite.customerInvite = { customer: {} };
    this.showEmailInRsvpModalForm = true;
    this.fg.patchValue({
      email: '',
      ac: 1,
      kc: 1,
      longMsg: ''
    });
    if (event) {
      event.preventDefault();
    }
    setTimeout(() => {
      this.emailFormControl.nativeElement.focus();
    }, 100);
    return false;
  }
  saveRsvp(rsvp: 'Y' | 'N' | 'M') {
    this.savingrsvp = true;
    this.rsvp.emit({ status: 'savingrsvp', payload: this.invite });
    const customerInvite = (this.invite.customerInvite ? this.invite.customerInvite : { customer: {} });
    if (this.invite && this.invite.customerInvite && this.invite.customerInvite.customer) {
      customerInvite.customerId = this.invite.customerInvite.customer.customerId;
      customerInvite.customerEmail = this.invite.customerInvite.customer.email;
    }
    if (this.showEmailInRsvpModalPreviousCustomerInvt && this.showEmailInRsvpModalPreviousCustomerInvt.oid) {
      customerInvite.referredByOid = this.showEmailInRsvpModalPreviousCustomerInvt.oid;
    }
    customerInvite.inviteOid = this.invite.oid;
    customerInvite.inviteId = this.invite.inviteId;
    customerInvite.customerEmail = this.fg.get('email').value;
    customerInvite.adultCount = this.fg.get('ac').value;
    customerInvite.kidCount = this.fg.get('kc').value;
    customerInvite.longMsg = this.fg.get('longMsg').value;
    customerInvite.rsvp = rsvp;
    this.api.upsertRsvp(customerInvite).subscribe((customerInviteSaved: ICustomerInviteDB) => {
      if ((this.showEmailInRsvpModalPreviousCustomerInvt && this.showEmailInRsvpModalPreviousCustomerInvt.oid !== customerInviteSaved.oid)
        || !this.customerInviteOid) {
        this.router.navigate([], { relativeTo: this.route, queryParams: { iOid: this.inviteOid, ciOid: customerInviteSaved.oid } });
      }
      this.invite.customerInvite = customerInviteSaved;
      this.showEmailInRsvpModalForm = false;
      this.showEmailInRsvpModalPreviousCustomerInvt = undefined;
      this.resetRsvpForm();
      this.savingrsvp = false;
      this.rsvp.emit({ status: 'savedrsvp', payload: this.invite });
    }, (error) => {
      this.savingrsvp = false;
    });
  }
}
