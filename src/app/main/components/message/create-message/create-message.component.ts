import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
declare const tinymce: any;

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.css'],
})
export class CreateMessageComponent implements OnInit {

  public loading = false;
  MessageId: any;
  GeMessageListById: any;
  submitted: boolean;
  messageId: any;
  public Think: any;
  public HeaderBorder: any;
  public HeaderLogo: any;
  public HeaderTextImg: any = '/assets/img/logo.png';
  public FooterLogo: any;
  public FooterBgColor: any;
  public footerColor: any;
  public FooterFontSize: any;
  public FooterText: any = '';
  public DateTimePopup = new Date();
  AddNewRow: any;
  SkinId: any;

  configTiny = {
    init: {
      plugins: 'link, table, preview, advlist, searchreplace, code, autolink, lists, autoresize, image',
      default_link_target: '_blank',
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | link image table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
      height: 400,
      branding: false,
      table_responsive_width: true,
      image_advtab: true,
      image_caption: true,
      autoresize_bottom_margin: 20,
      // paste_block_drop: true,
      file_picker_callback: function (cb, value, meta) {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = function () {
          const file = input.files[0];
          if (file.size > 1048576) {
            alert('File size cannot be larger than 1MB!')
            return;
          } else {
            const reader = new FileReader();
            reader.onload = function () {
              const id = "blobid" + new Date().getTime();
              const blobCache = tinymce.activeEditor.editorUpload.blobCache;
              const base64 = (<string>reader.result).split(",")[1];
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);
              cb(blobInfo.blobUri());
            };
            reader.readAsDataURL(file);
          }
        };

        input.click();
      }

    },
  }

  OnDropImage(event: any) {
    if (event.event.dataTransfer.files[0].size > 1048576) {
      this.toastr.warning('File size cannot be larger than 1MB!')
      event.event.preventDefault();
      return;
    }
  }


  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '35rem',
    minHeight: '0',
    maxHeight: '20rem',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      [
        // 'undo',
        // 'redo',
        // 'bold',
        // 'italic',
        'underline',
        // 'strikeThrough',
        // 'subscript',
        'superscript',
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        // 'heading',
        // 'fontName'
      ],
      [
        // 'fontSize',
        // 'textColor',
        // 'backgroundColor',
        'customClasses',
        // 'link',
        // 'unlink',
        // 'insertImage',
        'insertVideo',
        // 'insertHorizontalRule',
        'removeFormat',
        // 'toggleEditorMode'
      ]
    ]
  };


  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, public fb: FormBuilder,
    private router: Router, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }


  ngOnInit(): void {
    //this.authService.SetRestaurantName(`Add Templates`);
    this.MessageId = this.activeRoute.snapshot.params['id'] || 0;
    if (this.MessageId) {
      this.authService.SetRestaurantName(`Edit Message Template`);
      this.GetMessageListById();
    } else {
      this.authService.SetRestaurantName(`Create Message Template`);
      this.messageForm.reset();
    }
  }

  ClosePreview() {
    this.AddNewRow.splice(this.AddNewRow.length - 1, 1);
    const target = "#SurveyHtmlModal";
    $(target).hide();
    $('.modal-backdrop').remove();
  }



  OnPreviewRestart() {
    this.show = 0;
  }
  show: any = 0;

  SurveyTitle: any = '';
  IsSurveyTitle(event: any) {
    this.SurveyTitle = event.target.value;
    this.IsSurveyScript();
  }

  ScriptSurveyHTML: any;
  IsSurveyScript() {
    let SurveyContainer = <HTMLElement>document.querySelector("#SurveyHtmlModal");
    document.getElementById("alert-Survey-border").style.border = `${this.Think}px solid ${this.HeaderBorder}`;
    document.getElementById("Header-Survey-img").style.textAlign = `${this.HeaderLogo}`;

    document.getElementById("header-Survey-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="50" height="50">`;
    document.getElementById("header-Survey-text").innerHTML = `${this.SurveyTitle}`;

    document.getElementById("footer-Survey-align").style.textAlign = `${this.FooterLogo}`;
    document.getElementById("footer-Survey-BgColor").style.backgroundColor = `${this.FooterBgColor}`;
    document.getElementById("footer-Survey-color").style.color = `${this.footerColor}`;
    document.getElementById("footer-Survey-fontSize").style.fontSize = `${this.FooterFontSize}`;
    document.getElementById("footer-Survey-fontSize").innerHTML = `${this.FooterText}`;

    this.ScriptSurveyHTML = SurveyContainer.innerHTML;
  }

  private GetSkinListById() {
    this.loading = true;
    this.http.get(`skins/${this.SkinId}`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.Think = res.data.border_thickness;
        this.HeaderBorder = res.data.border_color;
        this.HeaderLogo = res.data.team_image_align;
        this.HeaderTextImg = res.data.team_image;

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
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        
      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }


  // IsRSVPScript() {
  //   let RSVPContainer = <HTMLElement>document.querySelector("#RSVPHtmlModal");
  //   document.getElementById("alert-RSVP-border").style.border = `${this.Think}px solid ${this.HeaderBorder}`;
  //   document.getElementById("Header-RSVP-img").style.textAlign = `${this.HeaderLogo}`;

  //   document.getElementById("header-text-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="50" height="50">`;
  //   document.getElementById("header-RSVP-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="50" height="50">`;
  //   document.getElementById("header-RSVP-text").innerHTML = `${this.AlertRSVPEditTitle}`;
  //   document.getElementById("body-RSVP-text").innerHTML = `${this.AlertRSVPEditBody}`;
  //   document.getElementById("ques1-RSVP").innerHTML = `${this.question1RSVP}`;
  //   document.getElementById("quesOption1-RSVP").innerHTML = `${this.questionOption1RSVP}`;
  //   document.getElementById("quesOption2-RSVP").innerHTML = `${this.questionOption2RSVP}`;

  //   if (this.questionSelected2RSVP) {
  //     document.getElementById("ques2-RSVP").innerHTML = `${this.question2RSVP}`;
  //   } else {
  //     document.getElementById("ques2-RSVP").innerHTML = ``;
  //   }

  //   document.getElementById("footer-RSVP-align").style.textAlign = `${this.FooterLogo}`;
  //   document.getElementById("footer-RSVP-BgColor").style.backgroundColor = `${this.FooterBgColor}`;
  //   document.getElementById("footer-RSVP-color").style.color = `${this.footerColor}`;
  //   document.getElementById("footer-RSVP-fontSize").style.fontSize = `${this.FooterFontSize}`;
  //   document.getElementById("footer-RSVP-fontSize").innerHTML = `${this.FooterText}`;

  //   this.ScriptRSVPHTML = RSVPContainer.innerHTML;
  // }

  // private GetSkinListById() {
  //   this.loading = true;
  //   this.http.get(`skins/${this.SkinId}`).subscribe((res: any) => {
  //     if (res.status === true) {
  //       this.loading = false;
  //       this.Think = res.data.border_thickness;
  //       this.HeaderBorder = res.data.border_color;
  //       this.HeaderLogo = res.data.team_image_align;
  //       this.HeaderTextImg = res.data.team_image;

  //       this.FooterLogo = res.data.footer_align;
  //       this.FooterBgColor = res.data.footer_background_color;
  //       this.footerColor = res.data.footer_text_color;
  //       this.FooterFontSize = res.data.footer_font_size;
  //       this.FooterText = res.data.footer_text;
  //       this.authService.setCurrentUser({ token: res.token });
  //     } else {
  //       this.loading = false;
  //       this.toastr.warning(res.message);
  //     }
  //   }, error => {
  //     if (error.error.code === 'token_not_valid') {
  //       this.authService.logout();
  //       this.router.navigate(['/signin']);
  //       this.loading = false;
  //     } else {
  //       this.toastr.error(error);
  //       this.loading = false;
  //     }
  //   });
  // }


  messageForm = this.fb.group({
    name: ['', Validators.required],
    body: ['', Validators.required],
  })

  get myMessageForm() {
    return this.messageForm.controls;
  }
  OnSubmit(): any {
    this.submitted = true;
    this.messageForm.markAllAsTouched();
    if (!this.messageForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.messageForm.value };
    const formData = new FormData();
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });


    this.loading = true;
    if (this.MessageId === 0) {
      this.http.post('templates/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Message Added Successfully !!");
          this.messageForm.reset();
          this.loading = false;
          this.router.navigate(['/message']);
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.error);
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        if (error.error.code === 'token_not_valid') {
          this.authService.logout();
          this.router.navigate(['/signin']);
          this.loading = false;
          
        } else if (error.status === 400) {
          this.toastr.error("Server Bad Request");
        } else if (error.status === 403) {
          this.toastr.error("Forbidden Error");
        } else if (error.status === 404) {
          this.toastr.error("Server not Found");
        } else if (error.status === 500) {
          this.toastr.error("Internal Server Error");
        } else {
          this.toastr.error("Server not reachable");
          this.loading = false;
        }
      });
    }
    else {
      this.http.patch(`templates/${this.MessageId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Message Updated Successfully !!");
          this.messageForm.reset();
          this.loading = false;
          this.router.navigate(['/message']);
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.error);
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        if (error.error.code === 'token_not_valid') {
          this.authService.logout();
          this.router.navigate(['/signin']);
          this.loading = false;
          
        } else if (error.status === 400) {
          this.toastr.error("Server Bad Request");
        } else if (error.status === 403) {
          this.toastr.error("Forbidden Error");
        } else if (error.status === 404) {
          this.toastr.error("Server not Found");
        } else if (error.status === 500) {
          this.toastr.error("Internal Server Error");
        } else {
          this.toastr.error("Server not reachable");
          this.loading = false;
        }
      });
    }
  }

  private GetMessageListById() {
    this.loading = true;
    this.http.get(`templates/${this.MessageId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
        this.messageForm.setValue({
          name: res.data.name,
          body: res.data.body,
        });
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
        
      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }



}
