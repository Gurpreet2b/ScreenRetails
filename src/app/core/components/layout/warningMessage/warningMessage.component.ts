import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, HttpService } from 'src/app/core/services';

@Component({
  selector: 'app-warningMessage',
  templateUrl: './warningMessage.component.html',
  styleUrls: ['./warningMessage.component.css']
})
export class WarningMessageComponent implements OnInit {

  public IsWarning = false;
  public IsExpiryDate: any;
  public userLimitCrossed = false;

  constructor(public activeModal: NgbActiveModal,
    private http: HttpService, public authService: AuthService,) { }

  ngOnInit(): void {
    this.GetInfoWork();
  }

  GetInfoWork() {
    this.http.get(`info/`, null).subscribe((res: any) => {
      this.IsWarning = res.working;
      // this.userLimitCrossed = res.user_limit_crossed;
      let ExpiryDate = res.logo_data.split(' ')
      this.IsExpiryDate = ExpiryDate[1]
    });
  }

  IsChangeWarning(){
    this.authService.setShowWarning('false');
  }

}
