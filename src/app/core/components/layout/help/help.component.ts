import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
})
export class HelpComponent implements OnInit {

  constructor(private http: HttpService,
    private activeRoute: ActivatedRoute, private router: Router,
    public authService: AuthService, public translate: TranslateService,) {
      translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
   
  }

}
