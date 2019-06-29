import { CE_ALERT } from "../const/constants";
import { IAlert, NiviteNamedNodeMap } from "../pojo/invite";

export class NiviteAlert {
  private alert: IAlert = { msg: '', type: 'success' };
  private url = new URL(window.location.href).searchParams;
  private disabled = this.url.get('dbia'); // Disable-build-In-Alert

  constructor(private dom: HTMLDivElement = document.createElement('div')) {
    if (!this.disabled) {
      this.dom.id = 'nivite-alert-modal';
      const nivite = document.getElementById('nivite');
      nivite && nivite.append(this.dom);
      this.paint();
      this.listen();
    }
  }
  paint() {
    this.dom.innerHTML = `<div class="modal fade" id="niviteAlertModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body p-0 alert-${this.alert.type} rounded">
            <button type="button" class="close mt-1" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <div class="alert alert-${this.alert.type} m-0 mr-3 p-2" role="alert">
              ${this.alert.msg}
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }
  listen() {
    document.addEventListener(CE_ALERT, (event) => {
      this.alert = (event as CustomEvent).detail as IAlert;
      this.paint();
      $('#niviteAlertModal').modal('show').on('hidden.bs.modal', (e) => { this.alert = { msg: '', type: 'success' } });
    });
  }

}