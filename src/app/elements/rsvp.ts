import { ServiceFactory } from "../service/factory";
import { ApiService } from "../service/api.service";
import { NiviteNamedNodeMap, ICustomerInviteDB } from "../pojo/invite";

export class NiviteRsvpModal {
  private dom: HTMLDivElement;
  private form: HTMLFormElement | undefined;
  private formEmailDiv: HTMLDivElement | undefined;
  private formHeadCountDiv: HTMLDivElement | undefined;
  private formLongMsgDiv: HTMLDivElement | undefined;
  private formRsvpButtonsDiv: HTMLDivElement | undefined;
  constructor(private api: ApiService = ServiceFactory.instance().get('api')) {
    this.dom = document.createElement('div');
    this.dom.id = 'nivite-rsvp-modal';
    const nivite = document.getElementById('nivite');
    nivite && nivite.append(this.dom);
    this.paint();
  }
  private paint() {
    this.dom.addEventListener("click", (event: Event) => {
      if (event && event.target) {
        const attr = ((event.target as HTMLElement).attributes as NiviteNamedNodeMap).niviteclick;
        switch (attr && attr.value) {
          case 'saveRsvpY':
            this.saveRsvp('Y');
            break;
          case 'saveRsvpM':
            this.saveRsvp('M');
            break;
          case 'saveRsvpN':
            this.saveRsvp('N');
            break;
          case 'showFormEmailDiv':
            this.showFormEmailDiv();
          default:
            break;
        }
      }
    });
    this.dom.innerHTML = `
      <div class="modal fade" id="niviteRsvpModal" tabindex="-1" role="dialog" aria-labelledby="niviteRsvpModalTitle"
      aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="niviteRsvpModalTitle">
                Respond <strong class="${this.getTextBadgeClass()}">
                  ${this.getRsvp()} ${this.getUnApproved()} </strong>
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form id="nivite-rsvp-modal-form"></form>
              <div class="pt-2 float-right pointer" id="niviteRsvpModalNotYourEmail" niviteclick="showFormEmailDiv">
                  ${this.notYourEmail()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    this.formEmailDiv = document.createElement('div');
    this.formEmailDiv.innerHTML = `
      <label for="niviteRsvpModalFormEmail">Email address</label>
      <div class="input-group">
        <input type="email" class="form-control" id="niviteRsvpModalFormEmail"
          aria-describedby="Your email address" placeholder="Enter email" #emailFormControl>
      </div>
      <small class="d-none d-sm-block form-text text-muted">
        Email address for communications
      </small>
    `
    if (this.api.invite.customerInvite) { // swing animation only if invite.customerInvite is available
      this.formEmailDiv.classList.add('form-group', 'swing');
    }
    this.form = this.dom.querySelector('form#nivite-rsvp-modal-form') as HTMLFormElement;
    this.form.append(this.formEmailDiv);

    this.formHeadCountDiv = document.createElement('div');
    this.formHeadCountDiv.innerHTML = `
      <div class="col">
        <div class="form-group">
          <label for="niviteRsvpModalFormAdultCount">Adults</label>
          <input type="number" class="form-control" id="niviteRsvpModalFormAdultCount"
            aria-describedby="Number of adults">
          <small class="d-none d-sm-block form-text text-muted">Number of adults</small>
        </div>
      </div>
      <div class="col">
        <div class="form-group">
          <label for="niviteRsvpModalFormKidCount">Kids</label>
          <input type="number" class="form-control" id="niviteRsvpModalFormKidCount"
            aria-describedby="Number of kids">
          <small class="d-none d-sm-block form-text text-muted">Number of kids (~12 years old)</small>
        </div>
      </div>
    `
    this.formHeadCountDiv.classList.add('row');
    this.form.append(this.formHeadCountDiv);

    this.formLongMsgDiv = document.createElement('div');
    this.formLongMsgDiv.innerHTML = `
      <label for="niviteRsvpModalFormLongMsg">Message</label>
      <textarea type="number" class="form-control" id="niviteRsvpModalFormLongMsg"
      aria-describedby="Optional message to the host" rows="3"></textarea>
      <small class="d-none d-sm-block form-text text-muted">Optional message to the host</small>
    `
    this.formLongMsgDiv.classList.add('form-group');
    this.form.append(this.formLongMsgDiv);

    this.formRsvpButtonsDiv = document.createElement('div');
    this.formRsvpButtonsDiv.innerHTML = `
      <button type="button" class="btn btn-success" niviteclick="saveRsvpY">
        <span class="d-inline mr-2"><i class="fas fa-check"></i></span>
        <span class="d-sm-inline d-none">Yes</span>
      </button>
      <button type="button" class="btn btn-warning" niviteclick="saveRsvpM">
        <span class="d-inline mr-2"><i class="fas fa-question"></i></span>
        <span class="d-sm-inline d-none">Maybe</span>
      </button>
      <button type="button" class="btn btn-danger" niviteclick="saveRsvpN">
        <span class="d-inline mr-2"><i class="fas fa-times"></i></span>
        <span class="d-sm-inline d-none">No</span>
      </button>
    `
    this.formRsvpButtonsDiv.classList.add('d-flex');
    this.formRsvpButtonsDiv.classList.add('btn-group');
    this.form.append(this.formRsvpButtonsDiv);
    //
    this.hideFormEmailDiv();

    $('#niviteRsvpModal').on('hidden.bs.modal', (e) => {
      this.resetRsvpForm();
    })
  }

  getRsvp() {
    if (this.api.invite && this.api.invite.customerInvite) {
      switch (this.api.invite.customerInvite.rsvp) {
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
    if (this.api.invite && this.api.invite.customerInvite
      && this.api.invite.customerInvite.role === 'UNAPPROVED') {
      return '*';
    }
    return '';
  }
  getRsvpBadgeClass(): string {
    if (this.api.invite && this.api.invite.customerInvite) {
      switch (this.api.invite.customerInvite.rsvp) {
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
  getTextBadgeClass(): string {
    if (this.api.invite && this.api.invite.customerInvite) {
      switch (this.api.invite.customerInvite.rsvp) {
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
  notYourEmail() {
    if (this.api.invite.customerInvite && this.api.invite.customerInvite.customer
      && this.api.invite.customerInvite.customer.email) {
      return `<span class="small text-muted">Not</span>
      <a class="small pointer" href="#">${this.api.invite.customerInvite.customer.email}</a>
      <span class="small text-muted">?</span>
      `
    }
    return '';
  }
  private showFormEmailDiv() {
    if (this.formEmailDiv && this.form) {
      this.formEmailDiv.classList.remove('d-none');
      $('#niviteRsvpModal').modal('handleUpdate')
      const nye = this.dom.querySelector('#niviteRsvpModalNotYourEmail');
      if (nye) {
        nye.classList.add('d-none');
      }
    }
  }
  private hideFormEmailDiv() {
    if (this.formEmailDiv) {
      const frm = this.formEmailDiv && this.formEmailDiv.parentElement;
      if (frm) {
        if (this.api.invite.customerInvite) {
          this.formEmailDiv.classList.add('d-none');
          $('#niviteRsvpModal').modal('handleUpdate')
          const nye = this.dom.querySelector('#niviteRsvpModalNotYourEmail');
          if (nye) {
            nye.classList.remove('d-none');
            nye.innerHTML = this.notYourEmail();
          }
          //
          const email = this.api.invite.customerInvite.customer && this.api.invite.customerInvite.customer.email
          this.setupForm('' + email,
            '' + this.api.invite.customerInvite.adultCount,
            '' + this.api.invite.customerInvite.kidCount,
            '' + this.api.invite.customerInvite.longMsg);
        } else {
          this.setupForm('', '', '', '');
        }
      } else {
        if (this.api.invite.customerInvite) {
          const email = this.api.invite.customerInvite.customer && this.api.invite.customerInvite.customer.email
          this.setupForm('' + email,
            '' + this.api.invite.customerInvite.adultCount,
            '' + this.api.invite.customerInvite.kidCount,
            '' + this.api.invite.customerInvite.longMsg);
        } else {
          this.setupForm('', '', '', '');
        }
      }
    }
  }
  private setupForm(email: string, ac: string, kc: string, lm: string) {
    if (this.formEmailDiv && email) {
      const emailInput = this.formEmailDiv.querySelector('#niviteRsvpModalFormEmail');
      if (emailInput) {
        (emailInput as HTMLInputElement).value = email;
      }
    }
    if (this.formHeadCountDiv) {
      const acInput = this.formHeadCountDiv.querySelector('#niviteRsvpModalFormAdultCount');
      if (acInput) {
        (acInput as HTMLInputElement).value = ac;
      }
      const kcInput = this.formHeadCountDiv.querySelector('#niviteRsvpModalFormKidCount');
      if (kcInput) {
        (kcInput as HTMLInputElement).value = kc;
      }
    }
    if (this.formLongMsgDiv) {
      const longMsg = this.formLongMsgDiv.querySelector('#niviteRsvpModalFormLongMsg');
      if (longMsg) {
        (longMsg as HTMLInputElement).value = lm;
      }
    }
  }
  private resetRsvpForm() {
    this.hideFormEmailDiv();
  }

  private saveRsvp(rsvp: 'Y' | 'N' | 'M') {
    let customerInvite: ICustomerInviteDB;
    const emailIp = this.formEmailDiv && this.formEmailDiv.querySelector('input');
    const acInput = this.formHeadCountDiv && this.formHeadCountDiv.querySelector('#niviteRsvpModalFormAdultCount') as HTMLInputElement;
    const kcInput = this.formHeadCountDiv && this.formHeadCountDiv.querySelector('#niviteRsvpModalFormKidCount') as HTMLInputElement;
    const longMsgIp = this.formLongMsgDiv && this.formLongMsgDiv.querySelector('#niviteRsvpModalFormLongMsg') as HTMLInputElement;
    if (this.api.invite && this.api.invite.customerInvite && this.api.invite.customerInvite.customer) {
      const referredByOid = this.api.invite.customerInvite.oid;
      customerInvite = this.api.invite.customerInvite;
      if (emailIp) {
        if (emailIp.value === this.api.invite.customerInvite.customer.email) {
          customerInvite.customerId = this.api.invite.customerInvite.customer.customerId;
          customerInvite.customerEmail = this.api.invite.customerInvite.customer.email;
        } else {
          customerInvite.customerInviteId = undefined;
          customerInvite.customerId = undefined;
          customerInvite.customerEmail = emailIp.value;
          customerInvite.referredByOid = referredByOid;
        }
      }
    } else {
      customerInvite = { customer: {} };
      customerInvite.customerEmail = emailIp ? emailIp.value : '';
    }

    customerInvite.inviteOid = this.api.invite.oid;
    customerInvite.inviteId = this.api.invite.inviteId;
    customerInvite.adultCount = acInput ? +acInput.value : 0;
    customerInvite.kidCount = kcInput ? +kcInput.value : 0;
    customerInvite.longMsg = longMsgIp ? longMsgIp.value : '';
    customerInvite.rsvp = rsvp;
    this.api.upsertRsvp(customerInvite).subscribe((customerInviteSaved: ICustomerInviteDB) => {
      if (customerInvite.referredByOid) {
        const ciOidIndx = window.location.href.indexOf('&ciOid=');
        const newurl = window.location.href.substr(0, ciOidIndx > 0 ? ciOidIndx : window.location.href.length) + '&ciOid=' + customerInviteSaved.oid;
        console.log('Navigate to:' + newurl);
        // window.location.href = newurl;
      }
      this.api.invite.customerInvite = customerInviteSaved;
      if (!this.api.invite.customerInvite.customer) {
        this.api.invite.customerInvite.customer = {
          customerId: customerInviteSaved.customerId,
          email: customerInviteSaved.customerEmail,
          name: customerInviteSaved.customerName,
          oid: customerInviteSaved.customerOid
        }
      }
      this.resetRsvpForm();
    }, (error) => {
      // todo;
    });

  }
}