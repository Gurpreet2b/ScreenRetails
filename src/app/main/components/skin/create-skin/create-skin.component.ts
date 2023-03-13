import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-skin',
  templateUrl: './create-skin.component.html',
  styleUrls: ['./create-skin.component.css'],
})
export class CreateSkinComponent implements OnInit {

  public loading = false;
  submitted = false;
  primary: any = '#00838f';
  Think: any = 5;
  HeaderLogo: any = 'right';
  FooterLogo: any = 'left';
  FooterBgColor: any;
  footerColor: any;
  FooterFontSize: any;
  FooterText: any;

  public HeaderTitle: any = '';
  public HeaderFontSize: any = '';
  public HeaderBgColor: any = '';
  public AlertBgColor: any = '';

  picture: File | undefined;
  public pictureFooterImg: File | undefined;
  public pictureAlertImg: File | undefined;
  SkinId: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    public fb: FormBuilder, private activeRoute: ActivatedRoute,
    private router: Router, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.SkinId = this.activeRoute.snapshot.params['id'] || 0;
    this.dragAreaClass = "dragarea";
    if (this.SkinId) {
      this.authService.SetRestaurantName(`Edit Skin`);
      this.GetSkinListById();
    } else {
      this.authService.SetRestaurantName(`Create Skin`);
      this.skinForm.reset();
    }
  }

  skinForm = this.fb.group({
    name: ['', Validators.required],
    border_thickness: [''],
    border_color: [''],

    header_custom_message: [''],
    header_custom_message_font_color: [0],
    header_background_color: [''],
    alert_background_color: [''],
    
    team_image_boolean: [''],
    show_alert_title: [''],
    show_alert_footer: [''],
    footer_font_size: [''],
    footer_background_color: [''],
    footer_text_color: [''],
    footer_text: ['']
  })

  // Getter method to access formcontrols
  get mySkinForm() {
    return this.skinForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    if (this.IsImageCheked === true) {
      if (this.picture) {

      } else {
        this.toastr.warning("Please Upload Image !!");
        return;
      }
    }
    this.skinForm.markAllAsTouched();
    if (!this.skinForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.skinForm.value };
    const formData = new FormData();
    formData.append('team_image_align', this.HeaderLogo);
    formData.append('alert_background_image', this.pictureAlertImg);
    formData.append('footer_background_image', this.pictureFooterImg);
    formData.append('footer_align', this.FooterLogo);
    if (this.picture) {
      formData.append('team_image', this.picture);
    } else {
      formData.append('team_image', '');
    }
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.SkinId === 0) {
      this.http.post('skins/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Skin Added Successfully !!");
          this.skinForm.reset();
          this.loading = false;
          this.router.navigate(['/skin-list']);
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
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
      this.http.patch(`skins/${this.SkinId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Skin Updated Successfully !!");
          this.skinForm.reset();
          this.loading = false;
          this.router.navigate(['/skin-list']);
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
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

  // Update Function
  private GetSkinListById() {
    this.loading = true;
    this.http.get(`skins/${this.SkinId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.skinForm.setValue({
          name: res.data.name,
          border_thickness: res.data.border_thickness,
          border_color: res.data.border_color,
          team_image_boolean: res.data.team_image_boolean,
          show_alert_title: res.data.show_alert_title,
          show_alert_footer: res.data.show_alert_footer,
          footer_font_size: res.data.footer_font_size,
          footer_background_color: res.data.footer_background_color,
          footer_text_color: res.data.footer_text_color,
          footer_text: res.data.footer_text,

          header_custom_message: res.data.header_custom_message,
          header_custom_message_font_color: res.data.header_custom_message_font_color,
          header_background_color: res.data.header_background_color,
          alert_background_color: res.data.alert_background_color,
        });
        this.IsImageCheked = res.data.team_image_boolean;
        this.Think = res.data.border_thickness;
        this.primary = res.data.border_color;
        this.HeaderLogo = res.data.team_image_align;
        this.pictureAlertImg = res.data.alert_background_image;
        this.pictureFooterImg = res.data.footer_background_image;

        this.AlertBgColor = res.data.alert_background_color;
        this.SkinUrl = res.data.team_image;
        this.HeaderBgColor = res.data.header_background_color;
        this.HeaderTitle = res.data.header_custom_message;
        this.FooterImageUrl = res.data.footer_background_image;

        this.FooterLogo = res.data.footer_align;
        this.FooterBgColor = res.data.footer_background_color;
        this.footerColor = res.data.footer_text_color;
        this.FooterFontSize = res.data.footer_font_size;
        this.FooterText = res.data.footer_text;
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

  IsImageCheked: any = false;
  IsTeamImage(event: any) {
    this.IsImageCheked = event.target.checked;
  }

  error: string;
  dragAreaClass: string;
  SelectedName: any;
  SkinUrl: any = '/assets/img/deva-ticker.png';
  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.SelectedName = event.target.files['0'].name

    const file = event.target.files[0];
    if (file.size > '1048576') {
      this.toastr.warning("File size cannot be larger than 1MB!");
      return;
    } else {
      this.picture = file;
    }
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.SkinUrl = (<FileReader>event.target).result;
      };
    }
  }

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      // let files: FileList = event.dataTransfer.files;
      this.SelectedName = event.dataTransfer.files['0'].name
      this.saveFiles(event);
    }
  }

  saveFiles(event: any) {
    let files: FileList = event.dataTransfer.files;
    this.SelectedName = event.dataTransfer.files['0'].name

    const file = event.dataTransfer.files[0];
    if (file.size > '1048576') {
      this.toastr.warning("File size cannot be larger than 1MB!");
      return;
    } else {
      this.picture = file;
    }
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.SkinUrl = (<FileReader>event.target).result;
      };
    }
  }

  AlertImageUrl: any = '';
  onFileChangeAlertImg(event: any) {
    let files: FileList = event.target.files;
    // this.SelectedName = event.target.files['0'].name

    const file = event.target.files[0];
    if (file.size > '1048576') {
      this.toastr.warning("File size cannot be larger than 1MB!");
      return;
    } else {
      this.pictureAlertImg = file;
    }
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.AlertImageUrl = (<FileReader>event.target).result;
      };
    }
  }

  FooterImageUrl: any = '';
  onFileChangeFooterImg(event: any) {
    let files: FileList = event.target.files;
    // this.SelectedName = event.target.files['0'].name

    const file = event.target.files[0];
    if (file.size > '1048576') {
      this.toastr.warning("File size cannot be larger than 1MB!");
      return;
    } else {
      this.pictureFooterImg = file;
    }
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.FooterImageUrl = (<FileReader>event.target).result;
      };
    }
  }

  // Header

  IsBorder(event: any) {
    if (event.target.value === '') {
      this.Think = 5;
    } else {
      this.Think = event.target.value;
    }
  }

  IsColor(event: any) {
    if (event.target.value === '') {
      this.primary = '#00838f';
    } else {
      this.primary = event.target.value;
    }
  }

  HeaderLeft() {
    this.HeaderLogo = 'left'
  }

  HeaderCenter() {
    this.HeaderLogo = 'center'
  }

  HeaderRight() {
    this.HeaderLogo = 'right'
  }

  // Custom header 

  IsHeaderTitle(event: any) {
    if (event.target.value === '') {
      this.HeaderTitle = '';
    } else {
      this.HeaderTitle = event.target.value;
    }
  }

  IsHeaderFontSize(event: any) {
    if (event.target.value === '') {
      this.HeaderFontSize = 5;
    } else {
      this.HeaderFontSize = event.target.value;
    }
  }

  IsHeaderBgColor(event: any) {
    if (event.target.value === '') {
      this.HeaderBgColor = '#00838f';
    } else {
      this.HeaderBgColor = event.target.value;
    }
  }

  IsAlertBgColor(event: any) {
    if (event.target.value === '') {
      this.AlertBgColor = '#00838f';
    } else {
      this.AlertBgColor = event.target.value;
    }
  }

  // Footer

  FooterLeft() {
    this.FooterLogo = 'left'
  }

  FooterCenter() {
    this.FooterLogo = 'center'
  }

  FooterRight() {
    this.FooterLogo = 'right'
  }

  IsFooterBg(event: any) {
    if (event.target.value === '') {
      this.FooterBgColor = '#00838f';
    } else {
      this.FooterBgColor = event.target.value;
    }
  }

  IsFooterColor(event: any) {
    if (event.target.value === '') {
      this.footerColor = '#00838f';
    } else {
      this.footerColor = event.target.value;
    }
  }

  IsFooterFont(event: any) {
    if (event.target.value === '') {
      this.FooterFontSize = 5;
    } else {
      this.FooterFontSize = event.target.value;
    }
  }

  IsFooterText(event: any) {
    if (event.target.value === '') {
      this.FooterText = '';
    } else {
      this.FooterText = event.target.value;
    }
  }

}