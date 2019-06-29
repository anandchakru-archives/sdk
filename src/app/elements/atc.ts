import { ServiceFactory } from "../service/factory";
import { ApiService } from "../service/api.service";
import { NiviteNamedNodeMap } from "../pojo/invite";
import { CalendarService } from "../service/calendar.service";
import { CE_SHOW_ATC } from "../const/constants";

export class NiviteAtcModal {
  // attributes
  private dom: HTMLDivElement;
  constructor(private api: ApiService = ServiceFactory.instance().get('api'),
    private atc: CalendarService = ServiceFactory.instance().get('calendar')) {
    this.dom = document.createElement('div');
    this.dom.id = 'nivite-atc-modal';
    const nivite = document.getElementById('nivite');
    nivite && nivite.append(this.dom);
    this.paint();
    this.listen();
  }
  private paint() {
    this.dom.addEventListener("click", (event: Event) => {
      if (event && event.target) {
        const attr = ((event.target as HTMLElement).attributes as NiviteNamedNodeMap).niviteclick;
        if (attr) {
          switch (attr.value) {
            case 'apple':
              this.atc.apple(this.api.invite);
              break;
            case 'google':
              this.atc.google(this.api.invite);
              break;
            case 'microsoft':
              this.atc.microsoft(this.api.invite);
              break;
            case 'yahoo':
              event.preventDefault();
              event.stopPropagation();
              this.atc.yahoo(this.api.invite);
              break;
            default:
              break;
          }
        }
      }
    }, true);
    this.dom.innerHTML = `<div class="modal fade" id="niviteCalendarModal" tabindex="-1" role="dialog"
    aria-labelledby="niviteCalendarModalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="niviteCalendarModalTitle">Select Calendar</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="btn-group d-flex">
            <button class="btn text-white bg-apple d-none d-lg-block" niviteclick="apple"> <!-- visible if width >= 992px; not working in iOS 12, will enable once iOS13 fixes this -->
              <span class="d-inline mr-2" niviteclick="apple"><i class="fab fa-apple" niviteclick="apple"></i></span>
              <span class="d-sm-inline d-none" niviteclick="apple">Apple</span>
            </button>
            <button class="btn text-white bg-google" niviteclick="google">
              <span class="d-inline mr-2" niviteclick="google"><i class="fab fa-google" niviteclick="google"></i></span>
              <span class="d-sm-inline d-none" niviteclick="google">Google</span>
            </button>
            <button class="btn text-white bg-microsoft" niviteclick="microsoft">
              <span class="d-inline mr-2" niviteclick="microsoft"><i class="fab fa-microsoft" niviteclick="microsoft"></i></span>
              <span class="d-sm-inline d-none" niviteclick="microsoft">Microsoft</span>
            </button>
            <button class="btn text-white bg-yahoo" niviteclick="yahoo">
              <span class="d-inline mr-2"><i class="fab fa-yahoo"></i></span>
              <span class="d-sm-inline d-none">Yahoo</span>
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary bg-white text-dark" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>`;
  }
  listen() {
    document.addEventListener(CE_SHOW_ATC, (event) => {
      $('#niviteCalendarModal').modal('show');
    });
  }

}