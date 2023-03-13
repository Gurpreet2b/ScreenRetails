import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, HttpService } from 'src/app/core/services';

@Component({
  selector: 'app-userLimitMessage',
  templateUrl: './userLimitMessage.component.html',
  styleUrls: ['./userLimitMessage.component.css']
})
export class UserLimitMessageComponent implements OnInit {

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
      let ExpiryDate = res.logo_data.split(' ')
      this.IsExpiryDate = ExpiryDate[1]
    });
  }

  IsChangeWarning(){
    this.authService.setShowWarning('false');
  }

}
