import { DatePipe, JsonPipe } from '@angular/common';
import { Component, HostListener, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.css'],
})
export class CreateSurveyComponent implements OnInit {

  public loading = false;
  public submitted = false;
  public SkinList: any = []
  public SkinId: any;
  public SurveyForm: any;
  public SurveyList: any = [];
  public Think: any;
  public HeaderBorder: any;

  public HeaderTitle: any = '';
  public HeaderFontSize: any = '';
  public HeaderBgColor: any = '';
  public AlertBgColor: any = '';

  public FooterImageUrl: any = '/assets/img/dewa-lines.png';
  public HeaderLogo: any;
  public HeaderTextImg: any = '/assets/img/deva-logo.png';
  public FooterLogo: any;
  public FooterBgColor: any;
  public footerColor: any;
  public FooterFontSize: any;
  public FooterText: any = '';
  public AnswerImageUrl: any;
  public DateTimePopup = new Date();
  public SurveyId: any;
  public SurveyType: any;
  public SurveyEdit: any;
  public SurveyEditId: any;
  public SurveyTemplateList: any = [];
  public surveyTemplateName: any;
  public SuveryImageList: any = [];
  public DefaultSettingList: any = {};
  public Permission: any = [];
  public RoleAssign: any = [];
  public RoleName: any;

  constructor(private http: HttpService,
    private toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService, private _sanitizer: DomSanitizer) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Create Survey`);
    this.Permission = this.authService.getPermission();
    this.RoleName = this.Permission.role;
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.GetSkinList();
    this.GetDefaultSettings();
    this.AddNewRow[0].choice = 'single-choice';
    this.SurveyId = this.activeRoute.snapshot.params['id'] || 0;
    this.SurveyType = this.activeRoute.snapshot.params['type'] || '';
    this.SurveyEdit = this.activeRoute.snapshot.params['edit'] || '';
    this.GetSurveyTemplateList();
    if (this.SurveyEdit === 'EditTemplate') {
      this.GetSurveyAlertTemplateById();
    } else {
      if (this.SurveyId) {
        this.GetSurveyAlertById();
      }
    }
  }

  GetSurveyTemplateList() {
    this.loading = true;
    this.http.get(`surveyalert/template_list/`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.SurveyTemplateList = res.data;
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

  IsTemplateSurvey(event: any) {
    this.SurveyId = event.target.value;
    // this.surveyForm.controls['title'].setValue(this.surveyTemplateName.name);
    this.GetSurveyAlertTemplateById();
  }

  // Question and Answer Add and Remove functionality End

  OnSelectedChoice(event: any, index: any) {
    let selectedVal = event.target.value;
    this.AddNewRow[index].choice = selectedVal;
  }

  AddNewRow = [{
    rowAns: [{
      answer1: '',
      Url: '',
      selectedVal: false
    }],
    question: '',
    choice: '',
    answer: '',
    UrlQuestion: '',
    intermAnswer: '',
    intermUrl: '',
    minNumber: '0',
    minLabel: '',
    maxNumber: '10',
    maxLabel: ''
  }];


  OnPreviewRestart() {
    this.show = 0;
  }

  show: any = 0;
  OnNextSubmit(index: any, lastIndex: any) {
    this.show = index + 1
    if (lastIndex === true) {
      this.AddNewRow.push({
        'rowAns': [{ answer1: '', Url: '', selectedVal: false }], 'question': '', 'choice': 'Submitted', 'answer': '', 'intermAnswer': '',
        minNumber: '', minLabel: '', maxNumber: '', maxLabel: '', intermUrl: '', UrlQuestion: ''
      });
    }
  }

  ClosePreview() {
    // this.AddNewRow.splice(this.AddNewRow.length - 1, 1);
    // const target = "#SurveyHtmlModal";
    // $(target).hide();
    // $('.modal-backdrop').remove();
  }

  IsAddOption(index: any) {
    this.AddNewRow[index].rowAns.push({ answer1: '', Url: '', selectedVal: false });
  }


  IsRemoveOption(index: any, indexRow: any) {
    this.AddNewRow[index].rowAns.splice(indexRow, 1)
  }

  onAddRows() {
    this.AddNewRow.push({
      'rowAns': [{ answer1: '', Url: '', selectedVal: false }], 'question': '', 'choice': '', 'answer': '', 'intermAnswer': '',
      minNumber: '', minLabel: '', maxNumber: '', maxLabel: '', intermUrl: '', UrlQuestion: ''
    });
    this.AddNewRow[this.AddNewRow.length - 1].choice = 'single-choice';
  }

  onRemoveRow(index: any) {
    this.AddNewRow.splice(index, 1);
  }

  // Question and Answer Add and Remove functionality End

  IsColorValue: any;
  SetInterval: any = 1;
  IsColorChange(event: any) {
    this.IsColorValue = event.target.value;
    this.SkinId = event.target.value;
    if (this.SkinId) {
      this.GetSkinListById();
      this.SetInterval = setInterval(() => {
        this.IsSurveyScript();
        if (this.SetInterval > 2) {
          clearInterval(this.SetInterval);
        }
      }, 2000);
    }
  }

  // Pop-up Alert Submit and By id data function Start

  surveyForm = this.fb.group({
    title: ['', Validators.required],
    type: ['classic_survey'],
    allow_to_close: [false],
    anonymous_survey: [false],
    lifetime_boolean: [null],
    lifetime: [null],
    lifetime_choice: ['hours'],
    recurrence: [null],
    scheduled: [false],
    schedule_start_date: [null],
    schedule_end_date: [null],
    width: [500],
    height: [400],
    position: ['bottom-right'],
    resizable: [false],
    fullscreen_or_size: ['sized'],
  })

  get mySurveyForm() {
    return this.surveyForm.controls;
  }

  OnSubmit(item: any) {
    this.submitted = true;
    this.surveyForm.markAllAsTouched();
    if (!this.surveyForm.valid) {
      return;
    }

    if (this.AddNewRow[0].question === '') {
      this.toastr.warning("Atleast one question required !!");
      return;
    }
    if (this.AddNewRow[0].rowAns[0].answer1 === '') {
      this.toastr.warning("Atleast one answer required !!");
      return;
    }
    const dataToSubmit = { ...this.surveyForm.value };
    const formData = new FormData();
    // formData.append('html', this.ScriptSurveyHTML);
    formData.append('name', this.surveyForm.value.title);
    formData.append('questions', JSON.stringify(this.AddNewRow));
    formData.append('skin', this.SkinId);
    if (item === 'template') {
      formData.append('template', 'true');
    }
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    if (this.SurveyEdit === '') {
      this.http.post('surveyalert/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Survey Added Successfully !!");
          this.surveyForm.reset();
          if (item === '') {
            this.router.navigate([`/create-survey/send-user/${responseData.id}/${responseData.alert_type}`]);
          }
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
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
    } else {
      this.http.patch(`surveyalert/${this.SurveyEditId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Survey Updated Successfully !!");
          this.surveyForm.reset();
          if (item === '') {
            this.router.navigate([`/create-survey/send-user/${responseData.id}/${responseData.alert_type}`]);
          }
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
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

  // Pop Alert Get By ID 
  GetSurveyAlertById() {
    this.loading = true;
    this.http.get(`alerts_database/${this.SurveyId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.SurveyEditId = res.data.survey_alert.id;
        let StartDate = this.dtPipe.transform(res.data.survey_alert.schedule_start_date, 'yyyy-MM-ddTHH:mm');
        let EndDate = this.dtPipe.transform(res.data.survey_alert.schedule_end_date, 'yyyy-MM-ddTHH:mm');
        this.surveyForm.setValue({
          title: res.data.survey_alert.title,
          type: res.data.survey_alert.type,
          allow_to_close: res.data.survey_alert.allow_to_close,
          anonymous_survey: res.data.survey_alert.anonymous_survey,
          lifetime: res.data.survey_alert.lifetime,
          lifetime_boolean: res.data.survey_alert.lifetime_boolean,
          lifetime_choice: res.data.survey_alert.lifetime_choice,
          recurrence: '',
          scheduled: res.data.survey_alert.scheduled,
          schedule_start_date: StartDate,
          schedule_end_date: EndDate,
          width: res.data.survey_alert.width,
          height: res.data.survey_alert.height,
          position: res.data.survey_alert.position,
          resizable: res.data.survey_alert.resizable,
          fullscreen_or_size: res.data.survey_alert.fullscreen_or_size,
        });
        this.IsCheckedSurvey = res.data.survey_alert.type,
          this.SkinId = res.data.survey_alert.skin;
        this.authService.setCurrentUser({ token: res.token });
        this.AddNewRow = JSON.parse(res.data.survey_alert.questions);
        this.AddNewRow.splice(this.AddNewRow.length - 1, 1);
        this.show = 0;
        if (this.SkinId) {
          this.GetSkinListById();
          this.SetInterval = setInterval(() => {
            this.IsSurveyScript();
            if (this.SetInterval > 2) {
              clearInterval(this.SetInterval);
            }
          }, 2000);
        }
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

  // Survey Template Alert Get By ID 
  GetSurveyAlertTemplateById() {
    this.loading = true;
    this.http.get(`surveyalert/${this.SurveyId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.SurveyEditId = res.data.id;
        let StartDate = this.dtPipe.transform(res.data.schedule_start_date, 'yyyy-MM-ddTHH:mm');
        let EndDate = this.dtPipe.transform(res.data.schedule_end_date, 'yyyy-MM-ddTHH:mm');
        this.surveyForm.setValue({
          title: res.data.title,
          type: res.data.type,
          allow_to_close: res.data.allow_to_close,
          anonymous_survey: res.data.anonymous_survey,
          lifetime: res.data.lifetime,
          lifetime_boolean: res.data.lifetime_boolean,
          lifetime_choice: res.data.lifetime_choice,
          recurrence: '',
          scheduled: res.data.scheduled,
          schedule_start_date: StartDate,
          schedule_end_date: EndDate,
          width: res.data.width,
          height: res.data.height,
          position: res.data.position,
          resizable: res.data.resizable,
          fullscreen_or_size: res.data.fullscreen_or_size,
        });
        this.IsCheckedSurvey = res.data.type,
          this.SkinId = res.data.skin;
        this.authService.setCurrentUser({ token: res.token });
        this.AddNewRow = JSON.parse(res.data.questions);
        this.AddNewRow.splice(this.AddNewRow.length - 1, 1);
        this.show = 0;
        if (this.SkinId) {
          this.GetSkinListById();
          this.SetInterval = setInterval(() => {
            this.IsSurveyScript();
            if (this.SetInterval > 2) {
              clearInterval(this.SetInterval);
            }
          }, 2000);
        }
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

  // Pop-up Alert Submit and By id data function End

  // Skin List All Data
  GetSkinList() {
    this.loading = true;
    this.http.get(`skins/?location=survey`, null).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res;
        this.SkinList = res.data;
        this.SkinId = res.data[0].id
        this.GetSkinListById();
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

  // Skin List By Id Data
  private GetSkinListById() {
    this.loading = true;
    this.http.get(`skins/${this.SkinId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.Think = res.data.border_thickness;
        this.HeaderBorder = res.data.border_color;
        this.HeaderLogo = res.data.team_image_align;
        this.HeaderTextImg = res.data.team_image;

        this.AlertBgColor = res.data.alert_background_color;
        this.HeaderBgColor = res.data.header_background_color;
        this.HeaderTitle = res.data.header_custom_message;
        this.HeaderFontSize = res.data.header_custom_message_font_color;

        this.FooterImageUrl = res.data.footer_background_image;

        this.FooterLogo = res.data.footer_align;
        this.FooterBgColor = res.data.footer_background_color;
        this.footerColor = res.data.footer_text_color;
        this.FooterFontSize = res.data.footer_font_size;
        this.FooterText = res.data.footer_text;
        this.IsSurveyScript();
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

  // Popup Survey Function Start
  SurveyTitle: any = '';
  IsSurveyTitle(event: any) {
    this.SurveyTitle = this._sanitizer.sanitize(SecurityContext.HTML, event.target.value);
    // this.SurveyTitle = event.target.value;
    this.IsSurveyScript();
  }
  // Popup Survey Function End

  // RSVP Survey Preview Script css and img Function Start
  ScriptSurveyHTML: any;
  IsSurveyScript() {
    let SurveyContainer = <HTMLElement>document.querySelector("#SurveyHtmlModal");
    document.getElementById("survey-width").style.width = `${this.surveyForm.value.width}px`;
    document.getElementById("survey-width").style.height = `${this.surveyForm.value.height}px`;
    document.getElementById("survey-width").style.boxShadow = `0 0 0 ${this.Think}px ${this.HeaderBorder} inset`;
    document.getElementById("survey-width").style.backgroundColor = `${this.AlertBgColor}`;
    // let MaxHeight = Number(this.surveyForm.value.height) - 250;
    // document.getElementById("survey-max-height").style.maxHeight = `${MaxHeight}px`;
    document.getElementById("survey-Bg-color").style.backgroundColor = `${this.AlertBgColor}`;
    document.getElementById("survey-header-Bg-color").style.backgroundColor = `${this.HeaderBgColor}`
    document.getElementById("survey-header-text-skin").innerHTML = `${this.HeaderTitle}`;;
    document.getElementById("survey-footer-img").innerHTML = `<img src="${this.FooterImageUrl}" alt="Logo" width="180" height="55">`;

    // document.getElementById("survey-Survey-border").style.border = `${this.Think}px solid ${this.HeaderBorder}`;
    document.getElementById("Header-Survey-img").style.textAlign = `${this.HeaderLogo}`;

    document.getElementById("header-Survey-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo">`;
    document.getElementById("header-Survey-text").innerHTML = `${this.SurveyTitle}`;

    document.getElementById("footer-Survey-align").style.textAlign = `${this.FooterLogo}`;
    document.getElementById("footer-Survey-BgColor").style.backgroundColor = `${this.FooterBgColor}`;
    document.getElementById("footer-Survey-color").style.color = `${this.footerColor}`;
    document.getElementById("footer-Survey-fontSize").style.fontSize = `${this.FooterFontSize}`;
    document.getElementById("footer-Survey-fontSize").innerHTML = `${this.FooterText}`;

    this.ScriptSurveyHTML = SurveyContainer.innerHTML;
  }
  // RSVP Alert Preview Script css and img Function End

  // Upload Question Answer Image Function Start

  onFileChangeQues(event: any) {
    const file = event.target.files[0];
    if (file.size > '1048576') {
      this.toastr.warning("File size cannot be larger than 1MB!");
      return;
    } else {
      this.picture = file;

      // this.loading = true;
      // const formData = new FormData();
      // formData.append('image', this.picture);
      // this.http.post(`image_database/`, formData).subscribe((res: any) => {
      //   if (res.status === true) {
      //     const responseData = res;
      //     let AnswerImageUrl = res.data.image;
      //     this.AddNewRow[index].UrlQuestion = AnswerImageUrl;
      //     this.loading = false;
      //     this.authService.setCurrentUser({ token: res.token });
      //   } else {
      //     this.loading = false;
      //     this.toastr.warning(res.message);
      //   }
      // }, error => {
      //   if (error.error.code === 'token_not_valid') {
      //     this.authService.logout();
      //     this.router.navigate(['/signin']);
      //     this.loading = false;
      //   } else {
      //     this.toastr.error("Server not reachable");
      //     this.loading = false;
      //   }
      // });
    }
  }

  IndexMain: any;
  IndexRow: any;
  SelectedName: any;
  picture: File | undefined;
  // onFileChange(event: any, index: any, indexRow: any) {
  //   this.IndexMain = index;
  //   this.IndexRow = indexRow;
  //   this.IndexMainInterm = false;
  //   this.SelectedName = event.target.files['0'].name
  //   const file = event.target.files[0];
  //   if (file.size > '1048576') {
  //     this.toastr.warning("File size cannot be larger than 1MB!");
  //     return;
  //   } else {
  //     this.picture = file;
  //     this.UploadAnswerImage();
  //   }
  // }

  // IndexMainInterm: any = false;
  // onFileChangeInterm(event: any, index: any) {
  //   this.IndexMain = index;
  //   this.IndexMainInterm = true;
  //   this.SelectedName = event.target.files['0'].name
  //   const file = event.target.files[0];
  //   if (file.size > '1048576') {
  //     this.toastr.warning("File size cannot be larger than 1MB!");
  //     return;
  //   } else {
  //     this.picture = file;
  //     this.UploadAnswerImage();
  //   }
  // }

  // UploadAnswerImage() {
  //   this.loading = true;
  //   const formData = new FormData();
  //   formData.append('image', this.picture);
  //   this.http.post(`image_database/`, formData).subscribe((res: any) => {
  //     if (res.status === true) {
  //       const responseData = res;
  //       this.AnswerImageUrl = res.data.image;
  //       if (this.IndexMainInterm === true) {
  //         this.AddNewRow[this.IndexMain].intermUrl = this.AnswerImageUrl;
  //       } else {
  //         this.AddNewRow[this.IndexMain].rowAns[this.IndexRow].Url = this.AnswerImageUrl;
  //       }
  //       this.loading = false;
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
  //       this.toastr.error("Server not reachable");
  //       this.loading = false;
  //     }
  //   });
  // }

  // Upload Answer Image Function End

  IsCheckedSurvey: any;
  IsSurveyCheck(item: any) {
    this.IsCheckedSurvey = item;
  }

  // Image File Upload functionality Start

  IndexQues: any;
  OnChoiceAns: any = '';
  OnFileImageModel(TextName: any, index: any) {
    this.IndexQues = index;
    this.OnChoiceAns = TextName;
    this.GetImageDatebase(1);
  }

  OnFileImageModelInterm(TextName: any, index: any) {
    this.IndexMain = index;
    this.OnChoiceAns = TextName;

    this.GetImageDatebase(1);
  }

  OnFileImageModelAns(TextName: any, index: any, indexRow: any) {
    this.IndexMain = index;
    this.IndexRow = indexRow;
    this.OnChoiceAns = TextName;
    this.GetImageDatebase(1);
  }

  UploadImageDatebase() {
    this.loading = true;
    const formData = new FormData();
    formData.append('image', this.picture);
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

  formImageSurvey = new FormGroup({
    search: new FormControl(''),
  });

  onSearchImageSurvey(formValue: any) {
    this.GetImageDatebase(1)
  }

  GetImageDatebase(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formImageSurvey.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`image_database/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;

      if (res.status === true) {
        this.totalItemsImage = responseData.count;
        this.SuveryImageList = res.data;
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
      this.onDeleteImageSurvey(id);
    }
  }
  onDeleteImageSurvey(id: number) {
    this.loading = true;
    this.http.delete(`image_database/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Image Deleted Successfully");
        this.GetImageDatebase(this.currentPageImage);
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.toastr.error(res.message);
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

  IsImageUrlSelected(url: any) {
    if (this.OnChoiceAns === 'QuestionCheck') {
      this.AddNewRow[this.IndexQues].UrlQuestion = url.image.full;
    } if (this.OnChoiceAns === 'AnswerSingleCheck') {
      this.AddNewRow[this.IndexMain].rowAns[this.IndexRow].Url = url.image.full;
    } if (this.OnChoiceAns === 'AnswerintermCheck') {
      this.AddNewRow[this.IndexMain].intermUrl = url.image.full;
    } else {

    }

    // this.SelectedName = url.name
    this.onDismissImage();
  }

  onDismissImage() {
    $('modal-open').remove();
    const target = "#FileUploadSurveyImageModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
    $("body").addClass("modal-overflow");
  }

  // Image File Upload functionality End

  // Default Settings Check function
  GetDefaultSettings() {
    this.loading = true;
    this.http.get(`default_settings/`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.DefaultSettingList = res.result;
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