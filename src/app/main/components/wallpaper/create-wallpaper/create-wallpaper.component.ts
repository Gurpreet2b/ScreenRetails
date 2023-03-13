import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-create-wallpaper',
  templateUrl: './create-wallpaper.component.html',
  styleUrls: ['./create-wallpaper.component.css'],
})
export class CreateWallpaperComponent implements OnInit {

  public wallpaperId: any;
  public loading = false;
  public submitted = false;
  public WallpaperPicture: any;
  public format: any;
  public WallpaperUrl: any;
  public SelectedName: any;
  public SelectedSize: any;
  public WallpaperEdit: any;
  public WallpaperEditId: any;
  public WallpaperImageList: any = [];

  constructor(private http: HttpService,
    private toastr: ToastrService, public translate: TranslateService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Create Wallpaper`);
    this.wallpaperId = this.activeRoute.snapshot.params['id'] || 0;
    this.WallpaperEdit = this.activeRoute.snapshot.params['edit'] || '';
    if (this.wallpaperId) {
      this.GetWallpaperListById();
    }
  }

  // Image File Upload functionality Start

  OnFileImageModel(){
    this.GetImageDatebase(1);
  }

  UploadImageDatebase() {
    this.loading = true;
    const formData = new FormData();
    formData.append('image', this.WallpaperPicture);
    this.http.post(`image_database/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res;
        this.GetImageDatebase(1);
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
      } else {
        this.toastr.error(error);
        this.loading = false;
      }
    });
  }

  formImageWallpaper = new FormGroup({
    search: new FormControl(''),
  });

  onSearchImageWallpaper(formValue: any) {
    this.GetImageDatebase(1)
  }

  GetImageDatebase(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formImageWallpaper.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`image_database/?search=${search}`, null,{ params: params }).subscribe((res: any) => {
      const responseData = res;

      if (res.status === true) {
        this.totalItemsImage = responseData.count;
        this.WallpaperImageList = res.data;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberImage = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpImage) {
        this.PageTotalNumberImage.push(i);
      }
    }, error => {
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
      } else {
        this.toastr.error(error);
        this.loading = false;
      }
    });
  }

  PageJumpImage: any = 10;
  PageTotalNumberImage: any = [];
  currentPageImage: number = 1;
  totalItemsImage: number | undefined;
  onPageImageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPageImage = event;
      this.GetImageDatebase(event)
    } else {
      this.currentPageImage = Number(event.target.value);
      this.GetImageDatebase(this.currentPageImage)
    }
  }

  deleteImage(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteImageWallpaper(id);
    }
  }
  onDeleteImageWallpaper(id: number) {
    this.loading = true;
    this.http.delete(`image_database/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Image Deleted Successfully");
        this.GetImageDatebase(this.currentPageImage);
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.toastr.error(res.error);
        this.loading = false;
      }
    }, error => {
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
      } else {
        this.toastr.error(error);
        this.loading = false;
      }
    });
  }

  ImageUrlSelected: any = '';
  IsImageUrlSelected(url: any) {
    this.ImageUrlSelected = url.image.full;
    this.WallpaperUrl = url.image.full;
    this.SelectedName = url.name
    this.onDismissImage();
  }

  onDismissImage() {
    const target = "#FileUploadWallpaperImageModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
  }

  // Image File Upload functionality End


  // Create And Update Wallpaper function Start

  wallpaperForm = this.fb.group({
    name: ['', Validators.required],
    position: ['center'],
    display_time: ['60'],
    scheduled: [false],
    start_date_time: [''],
    end_date_time: [''],
  })

  // Getter method to access formcontrols
  get myWallpaperForm() {
    return this.wallpaperForm.controls;
  }

  OnSubmit(val: any) {
    this.submitted = true;
    this.wallpaperForm.markAllAsTouched();
    if (!this.wallpaperForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.wallpaperForm.value };
    const formData = new FormData();
    formData.append('image', this.WallpaperUrl)
    // formData.append('image_url', this.WallpaperUrl)
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    if (this.WallpaperEdit === '') {
      this.http.post('wallpaperalert/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Wallpaper Added Successfully !!");
          this.authService.setCurrentUser({ token: res.token });
          if (val === 'next') {
            this.router.navigate([`/wallpaper/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/wallpaper/draft`]);
          }
          this.wallpaperForm.reset();
          this.loading = false;
        } else {
          this.toastr.error(res.error);
          this.loading = false;
        }
      }, error => {
        if (error.error.code === 'token_not_valid') {
          this.authService.logout();
          this.router.navigate(['/signin']);
          this.loading = false;
        } else {
          this.toastr.error(error);
          this.loading = false;
        }
      });
    } else {
      this.http.patch(`wallpaperalert/${this.WallpaperEditId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Wallpaper Updated Successfully !!");
          this.authService.setCurrentUser({ token: res.token });
          if (val === 'next') {
            this.router.navigate([`/wallpaper/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/create-alerts/draft`]);
          }
          this.wallpaperForm.reset();
          this.loading = false;
        } else {
          this.toastr.error(res.error);
          this.loading = false;
        }
      }, error => {
        if (error.error.code === 'token_not_valid') {
          this.authService.logout();
          this.router.navigate(['/signin']);
          this.loading = false;
        } else {
          this.toastr.error(error);
          this.loading = false;
        }
      });
    }
  }

  // Create And Update Wallpaper function End

  // Wallpaper List By Id Function 
  GetWallpaperListById() {
    this.loading = true;
    this.http.get(`wallpaperalert/${this.wallpaperId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.WallpaperEditId = res.data.id;
        let StartDate = this.dtPipe.transform(res.data.start_date_time, 'yyyy-MM-ddTHH:mm');
        let EndDate = this.dtPipe.transform(res.data.end_date_time, 'yyyy-MM-ddTHH:mm');
        this.WallpaperUrl = res.data.image;
        this.authService.setCurrentUser({ token: res.token });
        this.wallpaperForm.setValue({
          name: res.data.name,
          position: res.data.position,
          display_time: res.data.display_time,
          scheduled: res.data.scheduled,
          start_date_time: StartDate,
          end_date_time: EndDate,
        });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
      } else {
        this.toastr.error(error);
        this.loading = false;
      }
    });
  }

  onFileWallpaperChange(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file.size > '2097152') {
      this.toastr.warning("File size cannot be larger than 2MB!");
      return;
    } else {
      this.WallpaperPicture = file;
    }
    // this.SelectedName = event.target.files[0].name;
    // let SelectedSize = event.target.files[0].size / 1024;
    // this.SelectedSize = SelectedSize;
    // if (file) {
    //   var reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = (event) => {
    //     this.WallpaperUrl = (<FileReader>event.target).result;
    //   };
    // }
  }

}