import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  Permission: any;
  public loading = false;

  constructor(
    private router: Router,
    private http: HttpService,private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.http.get('login/', null).subscribe((res: any) => {
    // });
    this.GetInfoWork();
  }
  GetInfoWork() {
    this.http.get(`info/`, null).subscribe((res: any) => {
      this.authService.setShowWarning(res.show_popup);
      this.authService.setUserLimitCrossed(res.user_limit_crossed);
    });
  }

  onSubmit() {
    this.loading = true;
    this.form.markAllAsTouched();
    const formData = new FormData();

    formData.append('username', btoa(this.form.value.username));
    formData.append('password', btoa(this.form.value.password));
    Object.keys(this.form.value).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, this.form.value[key])
      }
    });

    this.http.post('login/', formData).subscribe((res: any) => {
      this.loading = false;
      if(res.status === true){
        this.loading = false;
        let UserName = res.user.username;
        let StartPage = '/' + res.user.start_page;
        this.authService.setUserName(UserName);
        this.authService.setShowInfo(res.show_info);
        this.authService.setCurrentUser({ token: res.token });
        localStorage.setItem("setLanguage", JSON.stringify('en'));
        if (res.user.start_page) {
          this.router.navigate([StartPage]);
        } else {
          this.router.navigate(['/dashboard']);
        }
        this.Permission = res.policy;
        localStorage.setItem(btoa("Permission"), btoa(JSON.stringify(this.Permission)));
        localStorage.setItem(btoa("SkinIdList"), btoa(JSON.stringify(res.skin_id_lists)));
        setInterval(() => {
          window.location.reload(); 
          }, 500);
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.loading = false;
    },error => {
      this.toastr.error("Server not reachable");
      this.loading = false;
    });
  }

  // onSubmit() {

  //   this.form.markAllAsTouched(); 

  //   if (!this.form.valid) {
  //     return;
  //   }


  //   this.http.post('auth/', this.form.value).subscribe((res: any) => {
  //     this.authService.setCurrentUser({ token: res.access });
  //     this.router.navigate(['/dashboard']);
  //   });
  // }

}
