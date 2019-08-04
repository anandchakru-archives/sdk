
import { ServiceFactory } from "../service/factory";
import { NiviteNamedNodeMap } from "../pojo/invite";
import { CE_NAVIGATE, CE_RSVP_SAVED } from "../const/constants";
import { ISdkApi } from "../api/api";

export class NiviteNav {
  // attributes
  private dom: HTMLDivElement;
  constructor(private api: ISdkApi = ServiceFactory.instance().get('api')) {
    this.dom = document.createElement('div');
    this.dom.id = 'nivite-nav';
    const nivite = document.getElementById('nivite');
    nivite && nivite.append(this.dom);
    this.paint();
    this.listen();
  }
  private paint() {
    this.dom.addEventListener("click", (event: Event) => {
      if (event && event.target) {
        const attr = ((event.target as HTMLElement).attributes as NiviteNamedNodeMap).niviteclick;
        switch (attr && attr.value) {
          case 'navigateToMaps':
            this.navigateToMaps();
            break;
          default:
            break;
        }
      }
    });
    this.dom.innerHTML = `
    <nav class="nivite navbar navbar-dark bg-nivite text-white fixed-top shadow">
    <a class="navbar-brand" href="//jrvite.com">Nivite <span class="nivite-moto d-block">The nerdy way!</span></a>
    <a class="nav-link btn btn-sm btn-outline-warning my-2 mr-0" data-toggle="modal" data-target="#niviteRsvpModal">
      <i class="fas fa-paper-plane mr-2"></i>Rsvp
      <span class="badge ${this.getRsvpBadgeClass()}">${this.getRsvp()} ${this.getUnApproved()}</span>
    </a>
    <button *ngIf="invite" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#niviteNavBar"
      aria-controls="niviteNavBar" aria-expanded="true" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="niviteNavBar">
      <a class="nav-link btn btn-sm btn-outline-warning my-2 mr-0" niviteclick="navigateToMaps"><i
          class="fas fa-map-marker-alt mr-2"></i>Navigate</a>
      <a class="nav-link btn btn-sm btn-outline-warning my-2 mr-0" data-toggle="modal"
        data-target="#niviteCalendarModal"><i class="fas fa-calendar-alt mr-2"></i>Add to
        Calendar</a>
    </div>
  </nav>
`;
  }
  listen() {
    // When Navigate clicked, open maps.
    document.addEventListener(CE_NAVIGATE, (event) => {
      this.navigateToMaps();
    });
    // Refresh on RSVP save
    document.addEventListener(CE_RSVP_SAVED, (event) => {
      this.paint();
    });
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
  navigateToMaps() {
    if (this.api.invite && this.api.invite.addrUrl) {
      window.open(this.api.invite.addrUrl, '_blank');
    }
  }
}