import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-domains-list',
  templateUrl: './domains-list.component.html',
  styleUrls: ['./domains-list.component.css'],
})
export class DomainsListComponent implements OnInit {

  public loading = false;
  DomainList: any = [];
  // formDomain: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Domains`);
    this.GetDomainList();
  }

  formDomain = new FormGroup({
    search: new FormControl(''),
  });

  onSearchDomain(formValue: any) {
    this.GetDomainList();
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetDomainList() {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formDomain.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    // params = params.append('page', page.toString())
    this.loading = true;
    this.http.get(`domain/?search=${search}`, null).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res;
        this.DomainList = res.data;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        
      } else if(error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if(error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if(error.status === 404) {
        this.toastr.error("Server not Found");
      } else if(error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

}