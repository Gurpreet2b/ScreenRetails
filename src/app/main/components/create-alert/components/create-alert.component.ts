import { DatePipe } from '@angular/common';
import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import SkinData from 'src/app/core/services/skin.json';
import { environment } from '../../../../../environments/environment';
import * as $ from 'jquery';
import { style } from '@angular/animations';
import { delay } from 'rxjs';
declare const tinymce: any;

@Component({
  selector: 'app-create-alert',
  templateUrl: './create-alert.component.html',
  styleUrls: ['./create-alert.component.css'],
  template: './preview.html'
})
export class CreateAlertComponent implements OnInit {

  public loading = true;
  public PopupAlertLoading = false;
  public TickerAlertLoading = false;
  public RSVPAlertLoading = false;
  public TemplateLoading = false;
  public submitted = false;
  public SkinList: any = [];
  public SkinId: any;
  public HeaderBorder: any = '#ffffff00';
  public Think: any = 5;
  public HeaderLogo: any = 'left';
  public HeaderImageAlign: boolean;
  public HeaderTitle: any = '';
  public HeaderFontSize: any = '';
  public HeaderBgColor: any = '';
  public AlertBgColor: any = '';

  public FooterImageUrl: any = '';
  public FooterImgUrl: any = '';
  public TickerImg: any = '';
  public FooterLogo: any = 'left';
  public FooterBgColor: any;
  public footerColor: any;
  public FooterFontSize: any;
  public FooterText: any = '';
  public ScriptHTML: any;
  public ScriptScrollingHTML: any;
  public ScriptRSVPHTML: any;
  public DefaultSettingList: any = {};
  public DateTimePopup = new Date();
  public MessageTemplateList: any = [];
  public MessageId: any = '';
  show_alert_footer: boolean;
  team_image_align: any;
  show_alert_title: boolean;
  ShowFooter: boolean;
  public IsCheckPreview: any = false;
  public SkinListLocal: any

  constructor(private http: HttpService,
    public toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService, private _sanitizer: DomSanitizer) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  configTinyTitle = {
    init: {
      plugins: 'autoresize, fontselect, link, table, preview, advlist, searchreplace, code, autolink, lists',
      default_link_target: '_blank',
      toolbar: 'bold italic strikethrough forecolor backcolor | fontfamily | link table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
      content_style: "@import url('https://fonts.cdnfonts.com/css/dubai?family=Dubai&display=dubai'); body { font-family: Dubai; }",
      font_formats: "Dubai=dubai",
      font_family_formats: 'Andale Mono=andale mono,times; Dubai=dubai; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
      height: 250,
      branding: false,
      autoresize_bottom_margin: 20,
      paste_block_drop: true,
    },
  }

  configTiny = {
    init: {
      plugins: 'link, table, preview, advlist, searchreplace, code, autolink, lists, autoresize, image link unlink',
      default_link_target: '_blank',
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | fontfamily link unlink | image table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
      content_style: "@import url('https://fonts.cdnfonts.com/css/dubai?family=Dubai&display=dubai'); body { font-family: Dubai; }",
      font_formats: "Dubai=dubai",
      font_family_formats: 'Andale Mono=andale mono,times; Dubai=dubai; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
      height: 400,
      branding: false,
      table_responsive_width: true,
      // paste_block_drop: true,
      image_advtab: true,
      image_caption: true,
      autoresize_bottom_margin: 20,

      file_picker_callback: function(cb, value, meta) {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = () => {
          const file = input.files[0];
          if(file.size > 1048576){
            alert('File size cannot be larger than 1MB!')
            return;
          } else {
            const reader = new FileReader();
            reader.onload = function() {
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
    if(event.event.dataTransfer.files[0].size > 1048576){
      this.toastr.warning('File size cannot be larger than 1MB!')
      event.event.preventDefault();
      return;
    }
  }

  configTinyTicker = {
    init: {
      plugins: 'link, table, preview, advlist, searchreplace, code, autolink, lists, autoresize, link',
      default_link_target: '_blank',
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | fontfamily link unlink | table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
      content_style: "@import url('https://fonts.cdnfonts.com/css/dubai?family=Dubai&display=dubai'); body { font-family: Dubai; }",
      font_formats: "Dubai=dubai",
      font_family_formats: 'Andale Mono=andale mono,times; Dubai=dubai; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
      height: 400,
      branding: false,
      table_responsive_width: true,
      autoresize_bottom_margin: 20,
      paste_block_drop: true,
    },
  }

  public AlertId: any;
  public AlertType: any;
  public AlertEdit: any;
  public popupAlertId: any;
  public TickerAlertId: any;
  public RSVPAlertId: any;
  public ScheduleId: any;
  public IsActivePopupAlert: any = false;
  public IsActiveTickerAlert: any = false;
  public IsActiveRsvpAlert: any = false;

  public Permission: any = [];
  public RoleName: any;
  public RoleAssign: any = [];
  public PolicyAlertSetting: any = [];
  public SkinIdListLocalStorge: any = [];
  public AlertTabType: any = 'popup';

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Create Alert`);
    this.AlertId = this.activeRoute.snapshot.params['id'] || 0;
    this.AlertType = this.activeRoute.snapshot.params['type'] || '';
    this.AlertEdit = this.activeRoute.snapshot.params['edit'] || '';
    this.SechduleData.schedule_choice = 'once'
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.PolicyAlertSetting = JSON.parse(this.Permission.alert_setting_list);
    this.RoleName = this.Permission.role;

    

    // this.GetSkinList('popup');
    // this.IsScript();
    // this.IsScrollingScript();
    // this.IsRSVPScript();
    this.GetDefaultSettings();

    this.SechduleData.schedule_date_start = this.dtPipe.transform(this.DateTimePopup, 'yyyy-MM-dd');
    this.SechduleData.once_start_date = this.dtPipe.transform(this.DateTimePopup, 'yyyy-MM-ddTHH:mm:ss');
    let currentTime = new Date().getTime();
    let updatedTIme = new Date(currentTime + 60 * 60 * 1000);
    this.SechduleData.once_end_date = this.dtPipe.transform(updatedTIme, 'yyyy-MM-ddTHH:mm:ss');
    this.SechduleData.alert_start_time = this.dtPipe.transform(currentTime, 'HH:mm');
    this.SechduleData.alert_end_time = this.dtPipe.transform(updatedTIme, 'HH:mm');
    this.SechduleData.lifetime_given = true;
    const date = new Date();
    date.setDate(date.getDate() + 1);
    this.SechduleData.end_after_date = this.dtPipe.transform(date, 'yyyy-MM-dd');

    this.SkinIdListLocalStorge = this.authService.getSkinIdList();
    if (this.SkinIdListLocalStorge.length > 0) {
      this.SkinListLocal = SkinData;
      this.GetLocalSkinList(this.SkinListLocal);
    }

    if (this.AlertEdit === 'Edit') {
      if (this.AlertType === 'PopupAlert') {
        this.IsActivePopupAlert = true;
        this.AlertTabType = 'popup';
        this.GetPopupAlertById();
      } else if (this.AlertType === 'TickerAlert') {
        this.IsActivePopupAlert = '';
        this.AlertTabType = 'ticker';
        this.GetTickerAlertById();
        this.IsActiveTickerAlert = true;
      } else if (this.AlertType === 'RsvpAlert') {
        this.IsActivePopupAlert = '';
        this.IsActiveRsvpAlert = true;
        this.AlertTabType = 'rsvp';
        this.GetRSVPAlertById();
      } else {
        this.IsActivePopupAlert = true;
      }
    } else if (this.AlertEdit === 'EditDraft') {
      if (this.AlertType === 'PopupAlert') {
        this.IsActivePopupAlert = true;
        this.AlertTabType = 'popup';
        this.GetPopupAlertDraftById();
      } else if (this.AlertType === 'TickerAlert') {
        this.IsActivePopupAlert = '';
        this.AlertTabType = 'ticker';
        this.GetTickerAlertDraftById();
        this.IsActiveTickerAlert = true;
      } else if (this.AlertType === 'RsvpAlert') {
        this.IsActivePopupAlert = '';
        this.IsActiveRsvpAlert = true;
        this.AlertTabType = 'rsvp';
        this.GetRSVPAlertDraftById();
      } else {
        this.IsActivePopupAlert = true;
      }
    } else if (this.AlertEdit === 'EditMessage') {
      if (this.AlertType === 'PopupAlert') {
        this.IsActivePopupAlert = true;
        this.MessageId = this.AlertId;
        this.AlertEdit = '';
        this.AlertTabType = 'popup';
        this.GetMessageListById();
      } else if (this.AlertType === 'TickerAlert') {
        this.IsActivePopupAlert = '';
        this.MessageId = this.AlertId;
        this.AlertEdit = '';
        this.AlertTabType = 'ticker';
        this.GetMessageListById();
        this.IsActiveTickerAlert = true;
      } else if (this.AlertType === 'RsvpAlert') {
        this.IsActivePopupAlert = '';
        this.IsActiveRsvpAlert = true;
        this.MessageId = this.AlertId;
        this.AlertEdit = '';
        this.AlertTabType = 'rsvp';
        this.GetMessageListById();
      }
    }
    else {
      if (this.AlertType === 'PopupAlert') {
        this.IsActivePopupAlert = true;
        this.AlertTabType = 'popup';
        this.GetPopupAlertById();
      } else if (this.AlertType === 'TickerAlert') {
        this.IsActivePopupAlert = '';
        this.AlertTabType = 'ticker';
        this.GetTickerAlertById();
        this.IsActiveTickerAlert = true;
      } else if (this.AlertType === 'RsvpAlert') {
        this.IsActivePopupAlert = '';
        this.IsActiveRsvpAlert = true;
        this.AlertTabType = 'rsvp';
        this.GetRSVPAlertById();
      } else {
        this.IsActivePopupAlert = true;
      }
    }
    this.GetMessageList();
  }


  // Local Skin List All Data
  GetLocalSkinList(res: any) {
    let SkinList = res.data;
    this.SkinList = [];
    for (let i = 0; i < this.SkinIdListLocalStorge.length; i++) {
      const element = this.SkinIdListLocalStorge[i];
      let SkinData = SkinList.filter((x: any) => x.id === element);
      this.SkinList.push(SkinData[0]);
    }
    this.SkinId = this.SkinList[0].id;
    this.GetLocalSkinListById(this.SkinId);
  }

  // Local Skin List By Id Data
  async GetLocalSkinListById(skinId: any) {
    let SkinData = this.SkinList.filter((x: any) => x.id === skinId);
    let res = SkinData[0];

    this.Think = res.border_thickness;
    this.HeaderBorder = res.border_color;
    this.HeaderLogo = res.team_image_align;
    if (this.AlertTabType === 'popup') {
      this.HeaderTextImg = environment.apiUrl + res.team_image;
    }
    if (this.AlertTabType === 'rsvp') {
      this.HeaderTextImg = environment.apiUrl + res.team_image;
    }
    if (res.name === 'White') {
      this.IsWhiteColor = true;
    } else {
      this.IsWhiteColor = false;
    }
    this.HeaderTextImgTicker = environment.apiUrl + res.team_image;
    this.AlertBgColor = res.alert_background_color;
    this.HeaderBgColor = res.header_background_color;
    this.HeaderTitle = res.header_custom_message;
    this.HeaderTitleCheck = res.header_custom_message;
    this.HeaderFontSize = res.header_custom_message_font_color;
    this.ShowFooter = res.show_alert_footer;
    this.IsColorValue = res.show_alert_footer;
    this.ShowFooterImgCheck = res.show_alert_footer;

    this.FooterImageUrl = environment.apiUrl + res.footer_background_image;
    this.FooterImgUrl = environment.apiUrl + res.alternate_footer_image;
    this.FooterLogo = res.footer_align;
    this.FooterBgColor = res.footer_background_color;
    this.footerColor = res.footer_text_color;
    this.FooterFontSize = res.footer_font_size;
    this.FooterText = res.footer_text;
    await new Promise(f => setTimeout(f, 2000));
    this.IsScript();
    this.IsScrollingScript();
    this.IsRSVPScript();
  }

  OnAlertTabChange(type: any) {
    this.AlertTabType = type;
    this.IsWhiteColor = true;
    this.ShowFooterImgCheck = false;
    this.ShowFooter = false;
    this.IsSechduleEnabled = false;
    this.IsSechduleEnabledTicker = false;
    this.IsSechduleEnabledRSVP = false;
    this.SechduleData.schedule_choice = 'once';
    this.IsShowSchedule = false;
    this.SechduleData.enabled = false;
    this.IsOnceSchedule = true;
    this.IsDailySchedule = false;
    // this.GetSkinList(type);
    this.GetLocalSkinList(this.SkinListLocal);
    this.GetMessageList();
  }

  IsMessageRes: any = false;
  GetMessageList() {
    this.loading = true;
    this.http.get(`alerts_template/?page=0&type=${this.AlertTabType}`, null).subscribe((res: any) => {
      this.IsMessageRes = res.status;
      this.OnLoadAllApiResponseCheck();
      if (res.status === true) {
        this.MessageTemplateList = res.data;
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

  IsOnLoadCompleted: any = false;
  OnLoadAllApiResponseCheck(){
    if (this.IsMessageRes === true && this.IsDefaultSettingsRes === true) {
      this.IsOnLoadCompleted = true;
      console.log("IsOnLoadCompleted");
      console.log('this.IsMessageRes', this.IsMessageRes);
      console.log('this.IsDefaultSettingsRes', this.IsDefaultSettingsRes);
    }
  }

  OnLoadAllApiResponseCheckEdit(){
    if (this.IsMessageRes === true && this.IsDefaultSettingsRes === true || this.IsPopupAlertByIdRes === true || this.IsPopupAlertDraftByIdRes === true) {
      this.IsOnLoadCompleted = true;
      console.log("IsOnLoadCompleted Edit");
      console.log('this.IsMessageRes', this.IsMessageRes);
      console.log('this.IsDefaultSettingsRes', this.IsDefaultSettingsRes);
      console.log('this.IsPopupAlertByIdRes', this.IsPopupAlertByIdRes);
      console.log('this.IsPopupAlertDraftByIdRes', this.IsPopupAlertDraftByIdRes);
    }
  }

  OnLoadAllApiResponseCheckEditTicker(){
    if (this.IsMessageRes === true && this.IsDefaultSettingsRes === true || this.IsTickerAlertByIdRes === true || this.IsTickerAlertDraftByIdRes === true) {
      this.IsOnLoadCompleted = true;
      console.log("IsOnLoadCompleted Edit");
    }
  }

  IsChangeMessageTemplate(event: any) {
    this.MessageId = event.target.value;
    this.GetMessageListById();
  }

  GetMessageListById() {
    this.loading = true;
    this.IsOnLoadCompleted = false;
    this.http.get(`alerts_template/${this.MessageId}/`).subscribe( async (res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.IsOnLoadCompleted = true;
        if (this.AlertTabType === 'popup') {
          this.alertForm.setValue({
            title: res.data.popup_alert.title,
            body: res.data.popup_alert.body,
            high_priority: res.data.popup_alert.high_priority,
            acknowledgement_required: res.data.popup_alert.acknowledgement_required,
            self_distructive: res.data.popup_alert.self_distructive,
            auto_close: res.data.popup_alert.auto_close,
            auto_close_time: res.data.popup_alert.auto_close_time,
            allow_manual_close: res.data.popup_alert.allow_manual_close,
            lifetime_given: res.data.popup_alert.lifetime_given,
            lifetime: res.data.popup_alert.lifetime,
            lifetime_option: res.data.popup_alert.lifetime_option,
            add_print_button: res.data.popup_alert.add_print_button,
            allow_feedback: res.data.popup_alert.allow_feedback,
            scheduled: '',
            schedule_option: '',
            schedule_time_start: '',
            schedule_time_end: '',
            reminder: res.data.popup_alert.reminder,
            reminder_time_list: res.data.popup_alert.reminder_time_list,
            width: res.data.popup_alert.width,
            height: res.data.popup_alert.height,
            position: res.data.popup_alert.position,
            resizable: res.data.popup_alert.resizable,
            fullscreen: res.data.popup_alert.fullscreen,
            device_type: res.data.popup_alert.device_type,
            call_alert: res.data.popup_alert.call_alert,
            email_alert: res.data.popup_alert.email_alert,
            sms_alert: res.data.popup_alert.sms_alert,
            teams_alert: res.data.popup_alert.teams_alert,
            template_name: res.data.template_name,
          });
          this.SkinId = res.data.popup_alert.skin;
          this.AlertEditTitlePreviewName = res.data.popup_alert.name;
          this.AlertEditTitlePreview = res.data.popup_alert.name;
          this.AlertEditBodyPreview = res.data.popup_alert.body_text;
          this.IsAcknowledgement = res.data.popup_alert.acknowledgement_required;
          this.IsHeart = res.data.popup_alert.allow_feedback;
          this.IsClose = res.data.popup_alert.auto_close;

          if (res.data.popup_alert.scheduled_data.enabled) {
            this.IsSechduleEnabled = true;
            this.IsSechduleEnabledTicker = false;
            this.SechduleData.enabled = res.data.popup_alert.scheduled_data.enabled;
            this.SechduleData.schedule_choice = res.data.popup_alert.scheduled_data.schedule_choice;

            this.ScheduleId = res.data.popup_alert.scheduled_data.id;
            let ScheduleChoice = res.data.popup_alert.scheduled_data.schedule_choice;
            this.OnShowSchedule(ScheduleChoice)
            this.WeeklyDay = JSON.parse(res.data.popup_alert.scheduled_data.weekly_day);

            this.SechduleData.once_start_date = res.data.popup_alert.scheduled_data.once_start_date;
            this.SechduleData.once_end_date = res.data.popup_alert.scheduled_data.once_end_date;
            this.SechduleData.daily_day_choice = res.data.popup_alert.scheduled_data.daily_day_choice;
            this.SechduleData.weekly_choice = res.data.popup_alert.scheduled_data.weekly_choice;
            this.SechduleData.schedule_date_start = res.data.popup_alert.scheduled_data.schedule_date_start;
            this.SechduleData.schedule_end_choice = res.data.popup_alert.scheduled_data.schedule_end_choice;
            this.SechduleData.end_after_occurrence = res.data.popup_alert.scheduled_data.end_after_occurrence;
            this.SechduleData.end_after_date = res.data.popup_alert.scheduled_data.end_after_date;
            this.SechduleData.alert_start_time = res.data.popup_alert.scheduled_data.alert_start_time;
            this.SechduleData.alert_end_time = res.data.popup_alert.scheduled_data.alert_end_time;
          }

          if (!this.PolicyAlertSetting[2].checked) {
            this.DefaultSettingList.allow_manual_close = true;
            this.IsClose = true;
            this.IsRSVPClose = true;
          } else {
            this.IsClose = true;
            this.IsRSVPClose = true;
          }
          this.authService.setCurrentUser({ token: res.token });
          if (this.SkinId) {
            this.GetLocalSkinListById(this.SkinId);
            await new Promise(f => setTimeout(f, 2000));
            this.IsScript();
          }
        } else if (this.AlertTabType === 'ticker') {
          this.tickerForm.setValue({
            title: res.data.ticker_alert.title,
            body: res.data.ticker_alert.body,
            high_priority: res.data.ticker_alert.high_priority,
            acknowledgement_required: res.data.ticker_alert.acknowledgement_required,
            unobtrusive: res.data.ticker_alert.unobtrusive,
            self_distructive: res.data.ticker_alert.self_distructive,
            auto_close: res.data.ticker_alert.auto_close,
            auto_close_time: res.data.ticker_alert.auto_close_time,
            allow_manual_close: res.data.ticker_alert.allow_manual_close,
            lifetime_given: res.data.ticker_alert.lifetime_given,
            lifetime: res.data.ticker_alert.lifetime,
            lifetime_option: res.data.ticker_alert.lifetime_option,
            speed: res.data.ticker_alert.speed,
            allow_feedback: res.data.ticker_alert.allow_feedback,
            scheduled: '',
            schedule_option: '',
            schedule_time_start: '',
            schedule_time_end: '',
            scroll_direction: 'left',
            reminder: res.data.ticker_alert.reminder,
            reminder_time_list: res.data.ticker_alert.reminder_time_list,
            position: res.data.ticker_alert.position,
            device_type: res.data.ticker_alert.device_type,
            call_alert: res.data.ticker_alert.call_alert,
            email_alert: res.data.ticker_alert.email_alert,
            sms_alert: res.data.ticker_alert.sms_alert,
            teams_alert: res.data.ticker_alert.teams_alert,
            template_name: res.data.template_name,
          });
          this.SkinId = res.data.ticker_alert.skin;
          this.AlertScrollingEditTitle = res.data.ticker_alert.name;
          this.AlertScrollingEditBody = res.data.ticker_alert.body_text;
          this.AlertScrollingEditTitlePreview = res.data.ticker_alert.name;
          this.AlertScrollingEditBodyPreview = res.data.ticker_alert.body_text;
          this.IsTickerClose = res.data.ticker_alert.auto_close;
          this.AlertScrollingEditTitlePreviewName = res.data.ticker_alert.name;
          if (res.data.ticker_alert.scheduled_data.enabled) {
            this.IsSechduleEnabledTicker = true;
            this.SechduleData.enabled = res.data.ticker_alert.scheduled_data.enabled;
            this.SechduleData.schedule_choice = res.data.ticker_alert.scheduled_data.schedule_choice;
            this.ScheduleId = res.data.ticker_alert.scheduled_data.id;
            let ScheduleChoice = res.data.ticker_alert.scheduled_data.schedule_choice;
            this.OnShowSchedule(ScheduleChoice)
            this.WeeklyDay = JSON.parse(res.data.ticker_alert.scheduled_data.weekly_day);

            this.SechduleData.once_start_date = res.data.ticker_alert.scheduled_data.once_start_date;
            this.SechduleData.once_end_date = res.data.ticker_alert.scheduled_data.once_end_date;
            this.SechduleData.daily_day_choice = res.data.ticker_alert.scheduled_data.daily_day_choice;
            this.SechduleData.weekly_choice = res.data.ticker_alert.scheduled_data.weekly_choice;
            this.SechduleData.schedule_date_start = res.data.ticker_alert.scheduled_data.schedule_date_start;
            this.SechduleData.schedule_end_choice = res.data.ticker_alert.scheduled_data.schedule_end_choice;
            this.SechduleData.end_after_occurrence = res.data.ticker_alert.scheduled_data.end_after_occurrence;
            this.SechduleData.end_after_date = res.data.ticker_alert.scheduled_data.end_after_date;
            this.SechduleData.alert_start_time = res.data.ticker_alert.scheduled_data.alert_start_time;
            this.SechduleData.alert_end_time = res.data.ticker_alert.scheduled_data.alert_end_time;
          }

          if (!this.PolicyAlertSetting[2].checked) {
            this.DefaultSettingList.allow_manual_close = true;
            this.IsTickerClose = true;
          } else {
            this.IsTickerClose = true;
          }

          this.authService.setCurrentUser({ token: res.token });
          if (this.SkinId) {
            this.GetLocalSkinListById(this.SkinId);
            await new Promise(f => setTimeout(f, 2000));
            this.IsScrollingScript();
          }
        } else {
          this.RSVPForm.setValue({
            title: res.data.rsvp_alert.title,
            body: res.data.rsvp_alert.body,
            high_priority: res.data.rsvp_alert.high_priority,
            acknowledgement_required: false,
            self_distructive: res.data.rsvp_alert.self_distructive,
            auto_close: res.data.rsvp_alert.auto_close,
            auto_close_time: res.data.rsvp_alert.auto_close_time,
            allow_manual_close: true,
            lifetime_given: res.data.rsvp_alert.lifetime_given,
            lifetime: res.data.rsvp_alert.lifetime,
            lifetime_option: res.data.rsvp_alert.lifetime_option,
            allow_feedback: res.data.rsvp_alert.allow_feedback,
            question_1: res.data.rsvp_alert.question_1,
            question1_option_1: res.data.rsvp_alert.question1_option_1,
            question1_option_2: res.data.rsvp_alert.question1_option_2,
            question_2_selected: res.data.rsvp_alert.question_2_selected,
            question_2: res.data.rsvp_alert.question_2,
            scheduled: '',
            schedule_option: '',
            schedule_time_start: '',
            schedule_time_end: '',
            reminder: '',
            reminder_time_list: '',
            width: res.data.rsvp_alert.width,
            height: res.data.rsvp_alert.height,
            position: res.data.rsvp_alert.position,
            resizable: res.data.rsvp_alert.resizable,
            fullscreen: res.data.rsvp_alert.fullscreen,
            device_type: res.data.rsvp_alert.device_type,
            template_name: res.data.template_name,
          });
          this.SkinId = res.data.rsvp_alert.skin;
          this.AlertRSVPEditTitlePreview = res.data.rsvp_alert.name;
          this.AlertRSVPEditTitlePreviewName = res.data.rsvp_alert.name;
          this.AlertRSVPEditBodyPreview = res.data.rsvp_alert.body_text;
          this.IsRSVPClose = res.data.rsvp_alert.auto_close;
          this.questionSelected2RSVP = res.data.rsvp_alert.question_2_selected;
          if (res.data.rsvp_alert.scheduled_data.enabled) {
            this.IsSechduleEnabledRSVP = true;
            this.SechduleData.enabled = res.data.rsvp_alert.scheduled_data.enabled;
            this.SechduleData.schedule_choice = res.data.rsvp_alert.scheduled_data.schedule_choice;
            this.ScheduleId = res.data.rsvp_alert.scheduled_data.id;
            let ScheduleChoice = res.data.rsvp_alert.scheduled_data.schedule_choice;
            this.OnShowSchedule(ScheduleChoice)
            this.WeeklyDay = JSON.parse(res.data.rsvp_alert.scheduled_data.weekly_day);
            this.SechduleData.once_start_date = res.data.rsvp_alert.scheduled_data.once_start_date;
            this.SechduleData.once_end_date = res.data.rsvp_alert.scheduled_data.once_end_date;
            this.SechduleData.daily_day_choice = res.data.rsvp_alert.scheduled_data.daily_day_choice;
            this.SechduleData.weekly_choice = res.data.rsvp_alert.scheduled_data.weekly_choice;
            this.SechduleData.schedule_date_start = res.data.rsvp_alert.scheduled_data.schedule_date_start;
            this.SechduleData.schedule_end_choice = res.data.rsvp_alert.scheduled_data.schedule_end_choice;
            this.SechduleData.end_after_occurrence = res.data.rsvp_alert.scheduled_data.end_after_occurrence;
            this.SechduleData.end_after_date = res.data.rsvp_alert.scheduled_data.end_after_date;
            this.SechduleData.alert_start_time = res.data.rsvp_alert.scheduled_data.alert_start_time;
            this.SechduleData.alert_end_time = res.data.rsvp_alert.scheduled_data.alert_end_time;
          }

          if (!this.PolicyAlertSetting[2].checked) {
            this.DefaultSettingList.allow_manual_close = true;
            this.IsClose = true;
            this.IsRSVPClose = true;
          } else {
            this.IsClose = true;
            this.IsRSVPClose = true;
          }

          this.authService.setCurrentUser({ token: res.token });
          if (this.SkinId) {
            this.GetLocalSkinListById(this.SkinId);
            await new Promise(f => setTimeout(f, 2000));
            this.IsRSVPScript();
          }

        }
       
      } else {
        this.loading = false;
        this.IsOnLoadCompleted = true;
        this.toastr.warning(res.message);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        this.IsOnLoadCompleted = true;
        
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
        this.IsOnLoadCompleted = true;
      }
    });
  }

  // Popup Alert Editor Title and body Function Start

  // Schedule Function Start


  dayCount: number = 1;
  OnDailyEveryDay(event) {
    let numberData = event.target.value
    if (numberData === 'every-1st-day') {
      this.dayCount = 1;
    } else if (numberData === 'every-2nd-day') {
      this.dayCount = 2;
    } else if (numberData === 'every-3rd-day') {
      this.dayCount = 3;
    }else if (numberData === 'every-4th-day') {
      this.dayCount = 4;
    }else if (numberData === 'every-5th-day') {
      this.dayCount = 5;
    }else if (numberData === 'every-6th-day') {
      this.dayCount = 6;
    }else if (numberData === 'every-7th-day') {
      this.dayCount = 7;
    }else if (numberData === 'every-8th-day') {
      this.dayCount = 8;
    }else if (numberData === 'every-9th-day') {
      this.dayCount = 9;
    }else if (numberData === 'every-10th-day') {
      this.dayCount = 10;
    }
    const date = new Date();
    date.setDate(date.getDate() + this.dayCount);
    this.SechduleData.end_after_date = this.dtPipe.transform(date, 'yyyy-MM-dd');
  }

  weekCount: number = 7;
  OnWeeklyEveryWeek(event) {
    let numberData = event.target.value
    if (numberData === 'every-1st-weekly') {
      this.weekCount = 7;
    } else if (numberData === 'every-2nd-weekly') {
      this.weekCount = 14;
    } else if (numberData === 'every-3rd-weekly') {
      this.weekCount = 21;
    }else if (numberData === 'every-4th-weekly') {
      this.weekCount = 28;
    }else if (numberData === 'every-5th-weekly') {
      this.weekCount = 35;
    }else if (numberData === 'every-6th-weekly') {
      this.weekCount = 42;
    }else if (numberData === 'every-7th-weekly') {
      this.weekCount = 49;
    }else if (numberData === 'every-8th-weekly') {
      this.weekCount = 56;
    }else if (numberData === 'every-9th-weekly') {
      this.weekCount = 63;
    }else if (numberData === 'every-10th-weekly') {
      this.weekCount = 70;
    }
    const date = new Date();
    date.setDate(date.getDate() + this.weekCount);
    this.SechduleData.end_after_date = this.dtPipe.transform(date, 'yyyy-MM-dd');
  }

  IsSechduleEnabled: any = false;
  IsSechduleEnabledTicker: any = false;
  IsSechduleEnabledRSVP: any = false;
  IsLifeTimeSelected: any = false;

  SechduleEnabled(event: any) {
    this.IsCheckPreview = false;
    this.IsSechduleEnabled = event.target.checked;
    if (event.target.checked === false) {
      this.SechduleData.lifetime_given = true;
    } else {
      this.SechduleData.lifetime_given = false;
      this.alertForm.value.lifetime_given = false;
    }
  }

  SechduleEnabledTicker(event: any) {
    this.IsCheckPreviewTicker = false;
    this.IsSechduleEnabledTicker = event.target.checked;
    if (event.target.checked === true) {
      this.tickerForm.value.lifetime_given = false;
    }
  }

  SechduleEnabledRSVP(event: any) {
    this.IsCheckPreviewRSVP = false;
    this.IsSechduleEnabledRSVP = event.target.checked;
    if (event.target.checked === true) {
      this.RSVPForm.value.lifetime_given = false;
    }
  }

  IsShowSchedule = false;
  IsOnceSchedule = true;
  IsDailySchedule = false;
  IsWeeklySchedule = false;
  IsMonthlySchedule = false;
  IsYearlySchedule = false;
  SechduleData: any = {
    enabled: false,
    daily_day_choice: 'every-1st-day',
    weekly_choice: 'every-1st-weekly',
    monthly_date: '1',
    month_count_date: 'every-1st-month',
    monthly_day_count: '1st',
    monthly_day_choice: 'Sunday',
    month_count_day: 'every-1st-month',
    yearly_date: '1',
    yearly_month_date: 'January',
    yearly_day: 'Sunday',
    yearly_day_count: '1st',
    yearly_month_day: 'January',
    yearly_choice: 'bydate',
    monthly_choice: 'bydate',
    schedule_end_choice: 'noenddate'
  };

  WeeklyDay: any = {
    Sunday: true,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  }

  OnShowSchedule(item: any) {
    if (item === 'once') {
      this.IsShowSchedule = false;
      this.IsOnceSchedule = true;
      this.IsDailySchedule = false;
      this.IsWeeklySchedule = false;
      this.IsMonthlySchedule = false;
      this.IsYearlySchedule = false;

      this.SechduleData.once_start_date = this.dtPipe.transform(this.DateTimePopup, 'yyyy-MM-ddTHH:mm:ss');
      let currentTime = new Date().getTime();
      let updatedTIme = new Date(currentTime + 60 * 60 * 1000);
      this.SechduleData.once_end_date = this.dtPipe.transform(updatedTIme, 'yyyy-MM-ddTHH:mm:ss');
    } else if (item === 'daily') {
      this.IsShowSchedule = true;
      this.IsDailySchedule = true;
      this.IsOnceSchedule = false;
      this.IsWeeklySchedule = false;
      this.IsMonthlySchedule = false;
      this.IsYearlySchedule = false;
      this.dayCount = 1;
      const date = new Date();
      date.setDate(date.getDate() + this.dayCount);
      this.SechduleData.end_after_date = this.dtPipe.transform(date, 'yyyy-MM-dd');
    }
     else if (item === 'weekly') {
      this.IsShowSchedule = true;
      this.IsWeeklySchedule = true;
      this.IsOnceSchedule = false;
      this.IsDailySchedule = false;
      this.IsMonthlySchedule = false;
      this.IsYearlySchedule = false;
      this.weekCount = 7;
      const date = new Date();
      date.setDate(date.getDate() + this.weekCount);
      this.SechduleData.end_after_date = this.dtPipe.transform(date, 'yyyy-MM-dd');
    } else if (item === 'monthly') {
      this.IsShowSchedule = true;
      this.IsMonthlySchedule = true;
      this.IsOnceSchedule = false;
      this.IsDailySchedule = false;
      this.IsWeeklySchedule = false;
      this.IsYearlySchedule = false;

    } else if (item === 'yearly') {
      this.IsShowSchedule = true;
      this.IsYearlySchedule = true;
      this.IsOnceSchedule = false;
      this.IsDailySchedule = false;
      this.IsWeeklySchedule = false;
      this.IsMonthlySchedule = false;

    } else {
      this.IsShowSchedule = false;
      this.IsOnceSchedule = true;
      this.IsDailySchedule = false;
      this.IsWeeklySchedule = false;
      this.IsMonthlySchedule = false;
      this.IsYearlySchedule = false;

      this.SechduleData.once_start_date = this.dtPipe.transform(this.DateTimePopup, 'yyyy-MM-ddTHH:mm:ss');
      let currentTime = new Date().getTime();
      let updatedTIme = new Date(currentTime + 60 * 60 * 1000);
      this.SechduleData.once_end_date = this.dtPipe.transform(updatedTIme, 'yyyy-MM-ddTHH:mm:ss');
    }
  }

  OnSubmitSchedule(item: any, AlertType: any) {
    this.IsScript();
    this.submitted = true;
    const formData = new FormData();
    formData.append('enabled', this.SechduleData.enabled);
    formData.append('schedule_choice', this.SechduleData.schedule_choice);
    formData.append('once_start_date', this.SechduleData.once_start_date);
    formData.append('once_end_date', this.SechduleData.once_end_date);
    formData.append('daily_day_choice', this.SechduleData.daily_day_choice);
    formData.append('weekly_choice', this.SechduleData.weekly_choice);
    formData.append('weekly_day', JSON.stringify(this.WeeklyDay));
    formData.append('monthly_choice', this.SechduleData.monthly_choice);
    formData.append('monthly_date', this.SechduleData.monthly_date);
    formData.append('month_count_date', this.SechduleData.month_count_date);
    formData.append('monthly_day_count', this.SechduleData.monthly_day_count);
    formData.append('monthly_day_choice', this.SechduleData.monthly_day_choice);
    formData.append('month_count_day', this.SechduleData.month_count_day);
    formData.append('yearly_choice', this.SechduleData.yearly_choice);
    formData.append('yearly_date', this.SechduleData.yearly_date);
    formData.append('yearly_month_date', this.SechduleData.yearly_month_date);
    formData.append('yearly_choice', this.SechduleData.yearly_choice);
    formData.append('yearly_day', this.SechduleData.yearly_day);
    formData.append('yearly_day_count', this.SechduleData.yearly_day_count);
    formData.append('yearly_month_day', this.SechduleData.yearly_month_day);
    formData.append('schedule_date_start', this.SechduleData.schedule_date_start);
    formData.append('schedule_end_choice', this.SechduleData.schedule_end_choice);
    formData.append('end_after_occurrence', this.SechduleData.end_after_occurrence);
    formData.append('end_after_date', this.SechduleData.end_after_date);
    formData.append('alert_start_time', this.SechduleData.alert_start_time);
    formData.append('alert_end_time', this.SechduleData.alert_end_time);

    this.loading = true;
    this.http.post('schedule/', formData).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res.data;
        this.ScheduleId = res.data.id;
        if (AlertType === 'popup') {
          this.OnSubmit(item);
        } else if (AlertType === 'ticker') {
          this.OnTickerSubmit(item);
        } else if (AlertType === 'RSVP') {
          this.OnRSVPSubmit(item);
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

  // Schedule Function End


  AlertEditTitle: any = '';
  AlertEditTitlePreview: any = '';
  AlertEditTitlePreviewName: any = '';
  async IsEditorTitle(event: any) {
    if (event.event.target.innerText !== undefined) {
      this.AlertEditTitlePreview = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
      this.AlertEditTitlePreviewName = event.event.target.innerText;
    } else {
      this.AlertEditTitlePreview = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertEditTitlePreview);
    }
    
    this.AlertEditTitle = this.alertForm.value.title;
    this.IsCheckPreview = false;
    
    await new Promise(f => setTimeout(f, 2000));
    this.IsScript();
  }

  AlertEditBody: any = '';
  AlertEditBodyPreview: any = '';
  HeaderTextImg: any = '';
  async IsEditorBody(event: any) {
    if (event.event.target.innerText !== undefined) {
      this.AlertEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
    } else {
      this.AlertEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertEditBodyPreview);
    }
    
    this.AlertEditBody = this.alertForm.value.body;
    this.IsCheckPreview = false;
    await new Promise(f => setTimeout(f, 2000));
    this.IsScript();
  }

  IsWidthHeight() {
    this.IsCheckPreview = false;
    this.IsScript();
  }

  IsRSVPWidthHeight() {
    this.IsCheckPreviewRSVP = false;
    this.IsRSVPScript();
  }
  // Popup Alert Editor Title and body Function End

  // Popup Alert Tab Alert Settings Acknowledgement Function
  IsAcknowledgement: any = false;
  OnChangeAcknowledgement(event: any) {
    if (event.target.checked === true) {
      this.IsAcknowledgement = true;
      this.IsScript();
    } else {
      this.IsAcknowledgement = false;
      this.IsScript();
    }
    this.IsCheckPreview = false;
    this.IsScript();
  }

  // Popup Alert Preview Print Function
  // IsPrintf: any = false;
  // OnChangePrintf(event: any) {
  //   if (event.target.checked === true) {
  //     this.IsPrintf = true;
  //     this.IsScript();
  //   } else {
  //     this.IsPrintf = false;
  //     this.IsScript();
  //   }
  //   this.IsScript();
  // }

  // Popup Alert Preview Heart Function

  IsHeart: any = false;
  OnChangeHeart(event: any) {
    if (event.target.checked === true) {
      this.IsHeart = true;
      this.IsScript();
    } else {
      this.IsHeart = false;
      this.IsScript();
    }
    this.IsCheckPreview = false;
    this.IsScript();
  }

  // Popup Alert Preview Close Function


  IsClose: any = false;
  OnChangeClose(event: any) {
    if (event.target.checked === true) {
      this.IsClose = true;
      this.IsScript();
    } else {
      this.IsClose = false;
      this.DefaultSettingList.autoclose_boolean = true;
      this.IsScript();
    }
    this.IsCheckPreview = false;
    this.IsScript();
  }

  IsAutoClose(event: any) {
    if (event.target.checked) {
      this.DefaultSettingList.allow_manual_close = true;
      this.IsClose = true;
      this.IsScript();
    } else {
      this.DefaultSettingList.allow_manual_close = true;
      this.IsClose = true;
      this.IsScript();
    }
    this.IsCheckPreview = false;
    this.IsScript();
  }

  IsAutoCloseRSVP(event: any) {
    if (event.target.checked) {
      this.DefaultSettingList.allow_manual_close = true;
      this.IsRSVPClose = true;
      this.IsRSVPScript();
    } else {
      this.DefaultSettingList.allow_manual_close = true;
      this.IsRSVPClose = true;
      this.IsRSVPScript();
    }
    this.IsCheckPreviewRSVP = false;
    this.IsRSVPScript();
  }

  IsRSVPClose: any = false;
  OnChangeCloseRSVP(event: any) {
    if (event.target.checked === true) {
      this.IsRSVPClose = true;
      this.IsRSVPScript();
    } else {
      this.IsRSVPClose = false;
      this.DefaultSettingList.autoclose_boolean = true;
      this.IsRSVPScript();
    }
    this.IsCheckPreviewRSVP = false;
    this.IsRSVPScript();
  }

  IsAutoCloseTicker(event: any) {
    if (event.target.checked) {
      this.DefaultSettingList.allow_manual_close = true;
      this.IsTickerClose = true;
      this.IsScrollingScript();
    } else {
      this.DefaultSettingList.allow_manual_close = true;
      this.IsTickerClose = true;
      this.IsScrollingScript();
    }
    this.IsCheckPreviewTicker = false;
    this.IsScrollingScript();
  }

  IsTickerClose: any = false;
  OnChangeCloseTicker(event: any) {
    if (event.target.checked === true) {
      this.IsTickerClose = true;
      this.IsScrollingScript();
    } else {
      this.IsTickerClose = false;
      this.DefaultSettingList.autoclose_boolean = true;
      this.IsScrollingScript();
    }
    this.IsCheckPreviewTicker = false;
    this.IsScrollingScript();
  }

  // Popup Alert Preview Script css and img Function
  myContainer: any = '';
  IsScript() {
    this.myContainer = {};
    this.myContainer = <HTMLElement>document.querySelector("#alertHtmlModal");
    if (document.getElementById("alert-width") !== null) {
      if (this.alertForm.value.fullscreen === 'fullscreen') {
        document.getElementById("alert-width").style.width = `100vw`;
        document.getElementById("alert-width").style.height = `99vh`;
      } else {
        document.getElementById("alert-width").style.width = `${this.alertForm.value.width}px`;
        document.getElementById("alert-width").style.height = `${this.alertForm.value.height}px`;
      }
  
      document.getElementById("alert-width").style.boxShadow = `0 0 0 ${this.Think}px ${this.HeaderBorder} inset`;
      document.getElementById("alert-width").style.backgroundColor = `${this.AlertBgColor}`;
    }

    if (this.ShowFooter === true || this.ShowFooter === null) {
      if (document.getElementById("alert-border") !== null || document.getElementById("header-Bg-color") !== null || document.getElementById("Header-img") !== null) {
        document.getElementById("alert-border").style.backgroundColor = `${this.AlertBgColor}`;
        document.getElementById("header-Bg-color").style.backgroundColor = `${this.HeaderBgColor}`;
        document.getElementById("Header-img").style.textAlign = `${this.HeaderLogo}`;
      }

      if (this.alertForm.value.fullscreen !== 'fullscreen') {
        if (document.getElementById("alert-max-height") !== null) {
          let MaxHeight = Number(this.alertForm.value.height) - 280;
          document.getElementById("alert-max-height").style.maxHeight = `${MaxHeight}px`;
        }
      } else {
        if (document.getElementById("alert-max-height") !== null) {
          let MaxHeight = Number(100) - 32;
          document.getElementById("alert-max-height").style.maxHeight = `${MaxHeight}vh`;
        }
      }
      if (document.getElementById("header-text-skin") !== null || document.getElementById("header-text-img") !== null) {
        document.getElementById("header-text-skin").innerHTML = `${this.HeaderTitle}`;
        document.getElementById("header-text-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="180" height="auto">`;
      }
      document.getElementById("footer-img").innerHTML = `<img src="${this.FooterImageUrl}" alt="Logo" width="180" height="55">`;
      // document.getElementById("footer-align").style.textAlign = `${this.FooterLogo}`;
      if (document.getElementById("footer-BgColor") !== null) {
        document.getElementById("footer-BgColor").style.backgroundColor = `${this.FooterBgColor}`;
        document.getElementById("footer-color").style.color = `${this.footerColor}`;
        document.getElementById("footer-fontSize").style.fontSize = `${this.FooterFontSize}`;
        document.getElementById("footer-text").innerHTML = `${this.FooterText}`;
      }
    } else {
      if (document.getElementById("header-text-img-white") !== null || document.getElementById("footer-img") !== null) {
        document.getElementById("header-text-img-white").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="110" height="auto">`;
        document.getElementById("footer-img").innerHTML = `<img src="${this.FooterImgUrl}" alt="Logo" width="50%" height="auto" style="float:right;">`;
      }
    }
    if (this.alertForm.value.fullscreen !== 'fullscreen') {
      if (document.getElementById("alert-max-height-check") !== null) {
        if (this.IsAcknowledgement && this.AlertEditTitle === '' || this.AlertEditTitle === null || this.AlertEditTitle === undefined) {
          let MaxHeight = Number(this.alertForm.value.height) - 240;
          document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}px`;

        } else if (this.AlertEditTitle === '' || this.AlertEditTitle === null || this.AlertEditTitle === undefined) {
          let MaxHeight = Number(this.alertForm.value.height) - 220;
          document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}px`;

        } else if (this.IsAcknowledgement) {
          let MaxHeight = Number(this.alertForm.value.height) - 290;
          document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}px`;

        } else {
          let MaxHeight = Number(this.alertForm.value.height) - 270;
          document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}px`;
        }
        
      }
    } else {
      if (document.getElementById("alert-max-height-check") !== null) {
        let MaxHeight = Number(100) - 40;
        document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}vh`; 
      }
    }

    if (document.getElementById("header-text") !== null || document.getElementById("body-text") !== null) {
      document.getElementById("header-text").innerHTML = `${this.AlertEditTitle}`;
      document.getElementById("header-text-scroll").innerHTML = `<style> #header-text::-webkit-scrollbar {
            display: none;
        } </style>`;
      document.getElementById("body-text").innerHTML = `${this.AlertEditBody}`;
    }
    // if (this.myContainer !== null) {
    if (this.myContainer) {
      this.ScriptHTML = this.myContainer.innerHTML;
    }
  }

  // Scrolling Alert Editor Title, body and Range Function Start
  AlertScrollingEditTitle: any = '';
  AlertScrollingEditTitlePreview: any = '';
  AlertScrollingEditTitlePreviewName: any = '';
  IsScrollingEditorTitle(event: any) {
    this.IsCheckPreviewTicker = false;
    if (event.event.target.innerText !== undefined) {

      this.AlertScrollingEditTitlePreview = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
      this.AlertScrollingEditTitle = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);

      this.AlertScrollingEditTitlePreviewName = event.event.target.innerText;
      // this.AlertScrollingEditTitle = event.event.target.innerText;
    } else {
      this.AlertScrollingEditTitlePreview = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertScrollingEditTitlePreview);
      this.AlertScrollingEditTitle = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertScrollingEditTitle);
    }
    this.AlertScrollingEditTitle = this.tickerForm.value.title;
    this.IsScrollingScript();
  }

  AlertScrollingEditBody: any = '';
  AlertScrollingEditBodyPreview: any = '';
  async IsScrollingEditorBody(event: any) {
    this.IsCheckPreviewTicker = false;
    if (event.event.target.innerText !== undefined) {
      this.AlertScrollingEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
      // this.AlertScrollingEditBody = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
    } else {
      this.AlertScrollingEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertScrollingEditBodyPreview);
      // this.AlertScrollingEditBody = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertScrollingEditBody);
    }
    this.AlertScrollingEditBody = this.tickerForm.value.body;
    await new Promise(f => setTimeout(f, 2000));
    this.IsScrollingScript();
  }

  // Scrolling Alert Editor Title, body and Range Function End

  // Scrolling Alert Preview Script css and img Function Start
  IsScrollingScript() {
    let test = '&nbsp; &nbsp;'
    let ScrollingContainer = <HTMLElement>document.querySelector("#ScrollingHtmlModal");
    // document.getElementById("alert-Scroll-border").style.border = `${this.Think}px solid ${this.HeaderBorder}`;
    document.getElementById("alert-Scroll-border").style.boxShadow = `0 0 0 2px ${this.HeaderBorder} inset`;
    document.getElementById("alert-Scroll-border").style.backgroundColor = `${this.AlertBgColor}`;

    document.getElementById("header-scroll-img").innerHTML = `<img src="${this.HeaderTextImgTicker}" alt="Logo" width="" height="52">`;
    document.getElementById("header-scroll-text").innerHTML = `${this.AlertScrollingEditTitle} ${test} ${this.AlertScrollingEditBody}`;
    document.getElementById("header-scroll-texts").innerHTML = `${this.AlertScrollingEditTitle} ${test} ${this.AlertScrollingEditBody}`;
    document.getElementById("header-scroll-text").style.fontSize = `24px`;
    // document.getElementById("header-scroll-text").style.color = `#fff`;

    this.ScriptScrollingHTML = ScrollingContainer.innerHTML;
  }
  // Scrolling Alert Preview Script css and img Function End

  // RSVP Alert Editor Title, body, Range and Questions Function Start
  AlertRSVPEditTitle: any = '';
  AlertRSVPEditTitlePreview: any = '';
  AlertRSVPEditTitlePreviewName: any = '';
  IsRSVPEditorTitle(event: any) {
    this.IsCheckPreviewRSVP = false;
    if (event.event.target.innerText !== undefined) {
      this.AlertRSVPEditTitlePreview = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
      this.AlertRSVPEditTitlePreviewName = event.event.target.innerText;
    } else {
      this.AlertRSVPEditTitlePreview = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertRSVPEditTitlePreview);
      this.AlertRSVPEditTitlePreviewName = this.AlertRSVPEditTitlePreviewName;
    }
    this.AlertRSVPEditTitle = this.RSVPForm.value.title;
    this.IsRSVPScript();
  }

  AlertRSVPEditBody: any = '';
  AlertRSVPEditBodyPreview: any = '';
  async IsRSVPEditorBody(event: any) {
    this.IsCheckPreviewRSVP = false;
    if (event.event.target.innerText !== undefined) {
      this.AlertRSVPEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
    } else {
      this.AlertRSVPEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertRSVPEditBodyPreview);
    }
    this.AlertRSVPEditBody = this.RSVPForm.value.body;
    await new Promise(f => setTimeout(f, 2000));
    this.IsRSVPScript();
  }

  question1RSVP: any = 'Will you accept the invitation?'
  questionOption1RSVP: any = 'Yes'
  questionOption2RSVP: any = 'No'
  IsQuestion1(event: any) {
    this.question1RSVP = this._sanitizer.sanitize(SecurityContext.HTML, event.target.value);
    // this.question1RSVP = event.target.value;
    this.IsCheckPreviewRSVP = false;
    this.IsRSVPScript();
  }

  IsQuestionOption1(event: any) {
    this.questionOption1RSVP = this._sanitizer.sanitize(SecurityContext.HTML, event.target.value);
    // this.questionOption1RSVP = event.target.value;
    this.IsCheckPreviewRSVP = false;
    this.IsRSVPScript();
  }

  IsQuestionOption2(event: any) {
    this.questionOption2RSVP = this._sanitizer.sanitize(SecurityContext.HTML, event.target.value);
    // this.questionOption2RSVP = event.target.value;
    this.IsCheckPreviewRSVP = false;
    this.IsRSVPScript();
  }

  questionSelected2RSVP: any = false;
  OnQuestion2(event: any) {
    if (event.target.checked === true) {
      this.questionSelected2RSVP = true;
      this.question2RSVP = 'What is your reason?';
      this.IsRSVPScript();
    } else {
      this.questionSelected2RSVP = false;
      this.IsRSVPScript();
    }
    this.IsCheckPreviewRSVP = false;
    this.IsRSVPScript();
  }

  question2RSVP: any = 'What is your reason?';
  IsQuestion2RSVP(event: any) {
    this.question2RSVP = this._sanitizer.sanitize(SecurityContext.HTML, event.target.value);
    // this.question2RSVP = event.target.value;
    this.IsCheckPreviewRSVP = false;
    this.IsRSVPScript();
  }

  // RSVP Alert Editor Title, body, Range and Questions Function End

  // RSVP Alert Preview Script css and img Function Start
  IsRSVPScript() {
    let RSVPContainer = <HTMLElement>document.querySelector("#RSVPHtmlModal");
    if (document.getElementById("alert-RSVP-width") !== null) { 
      if (this.RSVPForm.value.fullscreen === 'fullscreen') {
        document.getElementById("alert-RSVP-width").style.width = `100vw`;
        document.getElementById("alert-RSVP-width").style.height = `99vh`;
        if (document.getElementById("RSVP-max-height") !== null) {
          let MaxHeight = Number(100) - 40;
          document.getElementById("RSVP-max-height").style.maxHeight = `${MaxHeight}vh`;
        }
      } else {
        document.getElementById("alert-RSVP-width").style.width = `${this.RSVPForm.value.width}px`;
        document.getElementById("alert-RSVP-width").style.height = `${this.RSVPForm.value.height}px`;
        if (document.getElementById("RSVP-max-height") !== null) {
          let MaxHeight = Number(this.RSVPForm.value.height) - 300;
          document.getElementById("RSVP-max-height").style.maxHeight = `${MaxHeight}px`;
        }
      }
      document.getElementById("alert-RSVP-width").style.boxShadow = `0 0 0 ${this.Think}px ${this.HeaderBorder} inset`;
      document.getElementById("alert-RSVP-width").style.backgroundColor = `${this.AlertBgColor}`;
      // document.getElementById("alert-RSVP-width").style.border = `${this.Think}px solid ${this.HeaderBorder}`;
    }
    
    if (this.ShowFooter === true || this.ShowFooter === null) {
      if (document.getElementById("alert-RSVP-border") !== null || document.getElementById("Header-RSVP-img") !== null || document.getElementById("header-RSVP-Bg-color") !== null) {
        document.getElementById("alert-RSVP-border").style.backgroundColor = `${this.AlertBgColor}`;
        document.getElementById("Header-RSVP-img").style.textAlign = `${this.HeaderLogo}`;
        document.getElementById("header-RSVP-Bg-color").style.backgroundColor = `${this.HeaderBgColor}`;
      }
      // if (this.HeaderTitle) {
      //   document.getElementById("header-RSVP-text-skin").innerHTML = `${this.HeaderTitle}`;
      // }
      // document.getElementById("header-RSVP-text-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="100" height="auto">`;
      if (document.getElementById("header-RSVP-text-skin") !== null || document.getElementById("header-RSVP-text-img") !== null) {
        document.getElementById("header-RSVP-text-skin").innerHTML = `${this.HeaderTitle}`;
        document.getElementById("header-RSVP-text-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="180" height="auto">`;
      }

     
      if (this.questionSelected2RSVP) {
        document.getElementById("ques2-RSVP").innerHTML = `${this.question2RSVP}`;
      } else {
        document.getElementById("ques2-RSVP").innerHTML = ``;
      }
    }

    if (document.getElementById("header-RSVP-text") !== null || document.getElementById("body-RSVP-text") !== null) {
      document.getElementById("header-RSVP-text").innerHTML = `${this.AlertRSVPEditTitle}`;
      document.getElementById("header-text-scroll-RSVP").innerHTML = `<style> #header-RSVP-text::-webkit-scrollbar {
        display: none;
    } </style>`;
      document.getElementById("body-RSVP-text").innerHTML = `${this.AlertRSVPEditBody}`;
    }
    if (document.getElementById("ques1-RSVP") !== null || document.getElementById("quesOption1-RSVP") !== null || document.getElementById("quesOption2-RSVP") !== null) {
     document.getElementById("ques1-RSVP").innerHTML = `${this.question1RSVP}`;
      document.getElementById("quesOption1-RSVP").innerHTML = `${this.questionOption1RSVP}`;
      document.getElementById("quesOption2-RSVP").innerHTML = `${this.questionOption2RSVP}`;

    }

    if (this.ShowFooter === true) {

      document.getElementById("footer-RSVP-img").innerHTML = `<img src="${this.FooterImageUrl}" alt="Logo" width="180" height="55">`;
      document.getElementById("footer-RSVP-align").style.textAlign = `${this.FooterLogo}`;
      document.getElementById("footer-RSVP-BgColor").style.backgroundColor = `${this.FooterBgColor}`;
      document.getElementById("footer-RSVP-color").style.color = `${this.footerColor}`;
      document.getElementById("footer-RSVP-fontSize").style.fontSize = `${this.FooterFontSize}`;
      document.getElementById("footer-RSVP-text").innerHTML = `${this.FooterText}`;
    } 
    else if (document.getElementById("footer-RSVP-img") !== null || document.getElementById("header-RSVP-text-img") !== null) {
      document.getElementById("footer-RSVP-img").innerHTML = `<img src="${this.FooterImgUrl}" alt="Logo" width="35%" height="auto" style="background-color:#ffffff00; float:right;">`;
      document.getElementById("header-RSVP-text-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="100" height="auto" style="padding: 3px;">`;
    }

    if (this.RSVPForm.value.fullscreen === 'fullscreen') {
      if (document.getElementById("RSVP-max-height-check") !== null) {
        let MaxHeight = Number(100) - 40;
        document.getElementById("RSVP-max-height-check").style.maxHeight = `${MaxHeight}vh`;
      }
    } else {
      if (document.getElementById("RSVP-max-height-check") !== null) {
        let MaxHeight = Number(this.RSVPForm.value.height) - 260;
        document.getElementById("RSVP-max-height-check").style.maxHeight = `${MaxHeight}px`;
      }
    }

    if (RSVPContainer !== null) {
      this.ScriptRSVPHTML = RSVPContainer.innerHTML;
    }
  }
  // RSVP Alert Preview Script css and img Function End

  // Pop-up Alert All function Start

  IsScreenSizeAlert(item: any) {
    this.IsCheckPreview = false;
    if (item === 'fullscreen') {
      this.alertForm.value.width = '100';
      this.alertForm.value.height = '100';
      this.IsScript();
    } else {
      this.IsScript();
    }
  }

  IsScreenSizeRSVP(item: any) {
    this.IsCheckPreviewRSVP = false;
    if (item === 'fullscreen') {
      this.RSVPForm.value.width = '100';
      this.RSVPForm.value.height = '100';
      this.IsRSVPScript();
    } else {
      this.IsRSVPScript();
    }
  }

  alertForm = this.fb.group({
    title: [''],
    body: ['', Validators.required],
    high_priority: [false],
    acknowledgement_required: [false],
    // unobtrusive: [''],
    self_distructive: [false],
    auto_close: [false],
    auto_close_time: [0],
    allow_manual_close: [false],
    lifetime_given: [true],
    lifetime: [1],
    lifetime_option: ['day'],
    add_print_button: [false],
    allow_feedback: [false],
    scheduled: [false],
    schedule_option: ['once'],
    schedule_time_start: [''],
    schedule_time_end: [''],
    reminder: [''],
    reminder_time_list: [''],
    width: [500],
    height: [300],
    position: ['bottom-right'],
    resizable: [false],
    fullscreen: [false],
    device_type: [''],
    call_alert: [false],
    email_alert: [false],
    sms_alert: [false],
    teams_alert: [false],
    template_name: [''],
  })

  // Skin Change function Popup Alert tab

  IsColorValue: any = false;
  IsWhiteColor: any = true
  SetInterval: any = 1;
  async IsColorChange(event: any) {
    this.IsColorValue = event.show_alert_footer;
    this.SkinId = event.id;
    if (event.name === 'White') {
      this.IsWhiteColor = true;
    } else {
      this.IsWhiteColor = false;
    }
    if (this.SkinId) {
      // this.GetSkinListById();
      this.GetLocalSkinListById(this.SkinId);
      this.IsCheckPreview = false;
      this.IsCheckPreviewRSVP = false;
      await new Promise(f => setTimeout(f, 2000));
      this.IsScript();
      // this.IsRSVPScript();

      // if ( this.SetInterval1 === true) {
      //   this.SetInterval1 = setInterval(() => {
      //     this.IsScript();
      //     this.IsRSVPScript();
      //     this.SetInterval1 = false;
      //   }, 2000);
      // }
      
    }
    // this.onDismiss();
  }


  // onDismiss() {
  //   const target = "#alertHtmlModal";
  //   $(target).hide();
  //   $('.modal-backdrop').remove();
  //   $("body").removeClass("modal-open");
  // }

  IsSkinSelected = false;
  onSkinSelected(item: any) {
    if (item === 'available') {
      this.IsSkinSelected = false;
    } else {
      this.IsSkinSelected = true;
      // this.GetSkinList('popup');
      this.GetLocalSkinList(this.SkinListLocal);
    }
  }

  async OnPreviewCheck() {
    await new Promise(f => setTimeout(f, 2000));
    if (this.AlertEditBody || this.AlertEditBodyPreview) {
      this.IsCheckPreview = true;
    }
  }

  IsCheckPreviewTicker: any = false;
  async OnPreviewTickerCheck() {
    await new Promise(f => setTimeout(f, 2000));
    if (this.AlertScrollingEditBody || this.AlertScrollingEditBodyPreview) {
      this.IsCheckPreviewTicker = true;
    }
  }

  IsCheckPreviewRSVP: any = false;
  async OnPreviewRSVPCheck() {
    await new Promise(f => setTimeout(f, 2000));
    if (this.AlertRSVPEditBody || this.AlertRSVPEditBodyPreview) {
      this.IsCheckPreviewRSVP = true;
    }
  }


  // Getter method to access formcontrols
  get myForm() {
    return this.alertForm.controls;
  }

  timeLeft: number = 15;
  interval: any;
  StopTimeLoading: any = false;
  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 15;
        clearInterval(this.interval);
        if (this.StopTimeLoading === false) {
          this.toastr.warning("You may find your created alert in draft section and please try to send the same after some time.");
          this.loading = false;
          this.PopupAlertLoading = false;
          this.TickerAlertLoading = false;
          this.RSVPAlertLoading = false;
          console.log('test Start timer');
          return;
        }
      }
    },1000)
  }

  OnSubmit(val: any) {
    if (this.DefaultSettingList.autoclose_time_seconds === 0 ) {
      this.toastr.warning("Auto Close should be greater than 1");
      return;
    }
    if (this.DefaultSettingList.autoclose_time_seconds > 999) {
      this.toastr.warning("Auto close should be less than 999 minutes");
      return;
    } 
    if (this.SechduleData.enabled) {
      if (this.SechduleData.end_after_occurrence === 0 ) {
        this.toastr.warning("Schedule End After occurrence count  cannot be less than 1");
        return;
      }
      if (this.SechduleData.end_after_occurrence > 365) {
        this.toastr.warning("Schedule End after occurrence count cannot exceed 365");
        return;
      }
    }

    this.startTimer();
   
    this.submitted = true;
    this.alertForm.markAllAsTouched();
    if (!this.alertForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.alertForm.value };
    const formData = new FormData();
    formData.append('html', this.ScriptHTML);
    formData.append('name', this.AlertEditTitlePreviewName);
    formData.append('body_text', this.AlertEditBodyPreview);
    formData.append('skin', this.SkinId);
    formData.append('scheduled_data', this.ScheduleId);
    if (val === 'template') {
      this.TemplateLoading = true;
      formData.append('is_template', 'true');
    } else {
      formData.append('is_template', 'false');
      this.PopupAlertLoading = true;
    }
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.AlertEdit === '') {
      this.http.post('popupalert/', formData).subscribe((res: any) => {
        this.StopTimeLoading = true;
        this.TemplateLoading = false;
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Alert Added Successfully !!");
          if (val === 'next') {
            this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else if(val === 'template') {
            this.router.navigate([`/message`]);
          } else {
            this.router.navigate([`/create-alerts/draft`]);
          }
          this.alertForm.reset();
          this.loading = false;
          this.PopupAlertLoading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
          this.loading = false;
          this.PopupAlertLoading = false;
        }
      }, error => {
        this.loading = false;
        this.TemplateLoading = false;
        this.PopupAlertLoading = false;
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
    } else {
      this.http.patch(`popupalert/${this.popupAlertId}/`, formData).subscribe((res: any) => {
        this.StopTimeLoading = true;
        this.TemplateLoading = false;
        if (res.status === true) {
          this.loading = false;
          this.PopupAlertLoading = false;
          const responseData = res.data;
          this.toastr.success("Alert Updated Successfully !!");
          if (val === 'next') {
            this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else if(val === 'template') {
            this.router.navigate([`/message`]);
          } else {
            this.router.navigate([`/create-alerts/draft`]);
          }
          this.alertForm.reset();
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
          this.loading = false;
          this.PopupAlertLoading = false;
        }
      }, error => {
        this.loading = false;
        this.TemplateLoading = false;
        this.PopupAlertLoading = false;
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

  // Pop Alert Get By ID 
  IsPopupAlertByIdRes: any = false;
  GetPopupAlertById() {
    this.loading = true;
    this.http.get(`alerts_database/${this.AlertId}/`).subscribe(async (res: any) => {
      this.IsPopupAlertByIdRes = res.status;
      this.OnLoadAllApiResponseCheckEdit();
      if (res.status === true) {
        this.loading = false;
        this.popupAlertId = res.data.popup_alert.id;
        this.alertForm.setValue({
          title: res.data.popup_alert.title,
          body: res.data.popup_alert.body,
          high_priority: res.data.popup_alert.high_priority,
          acknowledgement_required: res.data.popup_alert.acknowledgement_required,
          self_distructive: res.data.popup_alert.self_distructive,
          auto_close: res.data.popup_alert.auto_close,
          auto_close_time: res.data.popup_alert.auto_close_time,
          allow_manual_close: res.data.popup_alert.allow_manual_close,
          lifetime_given: res.data.popup_alert.lifetime_given,
          lifetime: res.data.popup_alert.lifetime,
          lifetime_option: res.data.popup_alert.lifetime_option,
          add_print_button: res.data.popup_alert.add_print_button,
          allow_feedback: res.data.popup_alert.allow_feedback,
          scheduled: '',
          schedule_option: '',
          schedule_time_start: '',
          schedule_time_end: '',
          reminder: res.data.popup_alert.reminder,
          reminder_time_list: res.data.popup_alert.reminder_time_list,
          width: res.data.popup_alert.width,
          height: res.data.popup_alert.height,
          position: res.data.popup_alert.position,
          resizable: res.data.popup_alert.resizable,
          fullscreen: res.data.popup_alert.fullscreen,
          device_type: res.data.popup_alert.device_type,
          call_alert: res.data.popup_alert.call_alert,
          email_alert: res.data.popup_alert.email_alert,
          sms_alert: res.data.popup_alert.sms_alert,
          teams_alert: res.data.popup_alert.teams_alert,
          template_name: '',
        });

        this.SkinId = res.data.popup_alert.skin;
        this.AlertEditTitlePreviewName = res.data.popup_alert.name;
        this.AlertEditTitlePreview = res.data.popup_alert.name;
        this.AlertEditBodyPreview = res.data.popup_alert.body_text;
        // this.AlertEditBody = res.data.popup_alert.body_text;
        this.IsAcknowledgement = res.data.popup_alert.acknowledgement_required;
        // this.IsPrintf = res.data.popup_alert.add_print_button;
        this.IsHeart = res.data.popup_alert.allow_feedback;
        this.IsClose = res.data.popup_alert.auto_close;

        if (res.data.popup_alert.scheduled_data.enabled) {
          this.IsSechduleEnabled = true;
          this.IsSechduleEnabledTicker = false;
          this.SechduleData.enabled = res.data.popup_alert.scheduled_data.enabled;
          this.SechduleData.schedule_choice = res.data.popup_alert.scheduled_data.schedule_choice;

          // this.SechduleData = res.data.popup_alert.scheduled_data;
          this.ScheduleId = res.data.popup_alert.scheduled_data.id;
          let ScheduleChoice = res.data.popup_alert.scheduled_data.schedule_choice;
          this.OnShowSchedule(ScheduleChoice)
          this.WeeklyDay = JSON.parse(res.data.popup_alert.scheduled_data.weekly_day);

          this.SechduleData.once_start_date = res.data.popup_alert.scheduled_data.once_start_date;
          this.SechduleData.once_end_date = res.data.popup_alert.scheduled_data.once_end_date;
          this.SechduleData.daily_day_choice = res.data.popup_alert.scheduled_data.daily_day_choice;
          this.SechduleData.weekly_choice = res.data.popup_alert.scheduled_data.weekly_choice;
          this.SechduleData.schedule_date_start = res.data.popup_alert.scheduled_data.schedule_date_start;
          this.SechduleData.schedule_end_choice = res.data.popup_alert.scheduled_data.schedule_end_choice;
          this.SechduleData.end_after_occurrence = res.data.popup_alert.scheduled_data.end_after_occurrence;
          this.SechduleData.end_after_date = res.data.popup_alert.scheduled_data.end_after_date;
          this.SechduleData.alert_start_time = res.data.popup_alert.scheduled_data.alert_start_time;
          this.SechduleData.alert_end_time = res.data.popup_alert.scheduled_data.alert_end_time;
        }

        if (!this.PolicyAlertSetting[2].checked) {
          this.DefaultSettingList.allow_manual_close = true;
          this.IsClose = true;
          this.IsRSVPClose = true;
        } else {
          this.IsClose = true;
          this.IsRSVPClose = true;
        }
        
        this.authService.setCurrentUser({ token: res.token });
        if (this.SkinId) {
          // this.GetSkinListById();
          this.GetLocalSkinListById(this.SkinId);
          await new Promise(f => setTimeout(f, 2000));
          this.IsScript();
          // this.SetInterval = setInterval(() => {
          //   this.IsScript();
          //   if (this.SetInterval > 2) {
          //     clearInterval(this.SetInterval);
          //   }
          // }, 2000);
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

  // Pop Alert Draft Get By ID 
  IsPopupAlertDraftByIdRes: any = false;
  GetPopupAlertDraftById() {
    this.loading = true;
    this.http.get(`popupalert/${this.AlertId}/`).subscribe(async (res: any) => {
      this.IsPopupAlertDraftByIdRes = res.status;
      if (this.AlertEdit === '') {
        this.OnLoadAllApiResponseCheck;
      } else {
        this.OnLoadAllApiResponseCheckEdit();
      }
      if (res.status === true) {
        this.loading = false;
        this.popupAlertId = res.data.id;
        this.alertForm.setValue({
          title: res.data.title,
          body: res.data.body,
          high_priority: res.data.high_priority,
          acknowledgement_required: res.data.acknowledgement_required,
          self_distructive: res.data.self_distructive,
          auto_close: res.data.auto_close,
          auto_close_time: res.data.auto_close_time,
          allow_manual_close: res.data.allow_manual_close,
          lifetime_given: res.data.lifetime_given,
          lifetime: res.data.lifetime,
          lifetime_option: res.data.lifetime_option,
          add_print_button: res.data.add_print_button,
          allow_feedback: res.data.allow_feedback,
          scheduled: '',
          schedule_option: '',
          schedule_time_start: '',
          schedule_time_end: '',
          reminder: res.data.reminder,
          reminder_time_list: res.data.reminder_time_list,
          width: res.data.width,
          height: res.data.height,
          position: res.data.position,
          resizable: res.data.resizable,
          fullscreen: res.data.fullscreen,
          device_type: res.data.device_type,
          call_alert: res.data.call_alert,
          email_alert: res.data.email_alert,
          sms_alert: res.data.sms_alert,
          teams_alert: res.data.teams_alert,
          template_name: '',
        });
        this.SkinId = res.data.skin.id;
        // this.AlertEditTitle = res.data.name;
        // this.AlertEditBody = res.data.body_text;
        this.AlertEditTitlePreviewName = res.data.name;
        this.AlertEditTitlePreview = res.data.name;
        this.AlertEditBodyPreview = res.data.body_text;

        // if (res.data.scheduled_data) {
        //   this.SechduleData = res.data.scheduled_data;
        //   this.ScheduleId = res.data.scheduled_data.id;
        //   let ScheduleChoice = res.data.scheduled_data.schedule_choice;
        //   this.OnShowSchedule(ScheduleChoice)
        //   this.WeeklyDay = JSON.parse(res.data.scheduled_data.weekly_day);
        // }

        if (res.data.scheduled_data.enabled) {
          this.IsSechduleEnabled = true;
          this.SechduleData.enabled = res.data.scheduled_data.enabled;
          this.SechduleData.schedule_choice = res.data.scheduled_data.schedule_choice;
          // this.SechduleData = res.data.scheduled_data;
          this.ScheduleId = res.data.scheduled_data.id;
          let ScheduleChoice = res.data.scheduled_data.schedule_choice;
          this.OnShowSchedule(ScheduleChoice)
          this.WeeklyDay = JSON.parse(res.data.scheduled_data.weekly_day);

          this.SechduleData.once_start_date = res.data.scheduled_data.once_start_date;
          this.SechduleData.once_end_date = res.data.scheduled_data.once_end_date;
          this.SechduleData.daily_day_choice = res.data.scheduled_data.daily_day_choice;
          this.SechduleData.weekly_choice = res.data.scheduled_data.weekly_choice;
          this.SechduleData.schedule_date_start = res.data.scheduled_data.schedule_date_start;
          this.SechduleData.schedule_end_choice = res.data.scheduled_data.schedule_end_choice;
          this.SechduleData.end_after_occurrence = res.data.scheduled_data.end_after_occurrence;
          this.SechduleData.end_after_date = res.data.scheduled_data.end_after_date;
          this.SechduleData.alert_start_time = res.data.scheduled_data.alert_start_time;
          this.SechduleData.alert_end_time = res.data.scheduled_data.alert_end_time;
        }

        if (!this.PolicyAlertSetting[2].checked) {
          this.DefaultSettingList.allow_manual_close = true;
          this.IsClose = true;
          this.IsRSVPClose = true;
        } else {
          this.IsClose = true;
          this.IsRSVPClose = true;
        }

        this.authService.setCurrentUser({ token: res.token });
        if (this.SkinId) {
          // this.GetSkinListById();
          this.GetLocalSkinListById(this.SkinId);
          await new Promise(f => setTimeout(f, 2000));
          this.IsScript();
          // this.SetInterval = setInterval(() => {
          //   this.IsScript();
          //   if (this.SetInterval > 2) {
          //     clearInterval(this.SetInterval);
          //   }
          // }, 2000);
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

  // Pop-up Alert All function End

  // Skin List All Data
  // IsSkinRes: any = false;
  // GetSkinList(type: any) {
  //   this.loading = true;
  //   this.http.get(`skins/?location=${type}`, null).subscribe((res: any) => {
  //     this.IsSkinRes = res.status;
  //     this.OnLoadAllApiResponseCheck();
  //     if (res.status === true) {
  //       const responseData = res;
  //       this.SkinList = res.data;
  //       this.SkinId = res.data[0].id;
  //       this.GetSkinListById();
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

  HeaderTitleCheck: any = '';
  HeaderTextImgTicker: any = '';
  // IsSkinByIdRes: any = false;
  // Skin List By Id Data
  // private GetSkinListById() {
  //   this.loading = true;
  //   this.http.get(`skins/${this.SkinId}/`).subscribe(async (res: any) => {
  //     this.IsSkinByIdRes = res.status;
  //     this.OnLoadAllApiResponseCheck();
  //     if (res.status === true) {
  //       this.loading = false;
  //       this.Think = res.data.border_thickness;
  //       this.HeaderBorder = res.data.border_color;
  //       this.HeaderLogo = res.data.team_image_align;
  //       if (this.AlertTabType === 'popup') {
  //         this.HeaderTextImg = res.data.team_image;
  //       } else { }
  //       if (this.AlertTabType === 'popup') {
  //         this.HeaderTextImg = res.data.team_image;
  //       }
  //       if (res.data.name === 'White') {
  //         this.IsWhiteColor = true;
  //       } else {
  //         this.IsWhiteColor = false;
  //       }
  //       this.HeaderTextImgTicker = res.data.team_image;
  //       this.AlertBgColor = res.data.alert_background_color;
  //       this.HeaderBgColor = res.data.header_background_color;
  //       this.HeaderTitle = res.data.header_custom_message;
  //       this.HeaderTitleCheck = res.data.header_custom_message;
  //       this.HeaderFontSize = res.data.header_custom_message_font_color;
  //       this.ShowFooter = res.data.show_alert_footer;
  //       this.IsColorValue = res.data.show_alert_footer;
  //       this.ShowFooterImgCheck = res.data.show_alert_footer;

  //       this.FooterImageUrl = res.data.footer_background_image;
  //       this.FooterImgUrl = res.data.alternate_footer_image;
  //       this.FooterLogo = res.data.footer_align;
  //       this.FooterBgColor = res.data.footer_background_color;
  //       this.footerColor = res.data.footer_text_color;
  //       this.FooterFontSize = res.data.footer_font_size;
  //       this.FooterText = res.data.footer_text;
  //       this.authService.setCurrentUser({ token: res.token });
  //       await new Promise(f => setTimeout(f, 2000));
  //       this.IsScript();
  //       this.IsScrollingScript();
  //       this.IsRSVPScript();
  //       // this.SetInterval = setInterval(() => {
  //       //   // this.IsScript();
  //       //   this.IsScrollingScript();
  //       //   this.IsRSVPScript();
  //       //   if (this.SetInterval > 2) {
  //       //     clearInterval(this.SetInterval);
  //       //   }
  //       // }, 2000);

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

  // Scrolling Ticker All function Start

  IsScrollingDirection: any = 'left'
  IsSpeed: number = 6;

  OnChangeDirection(item: any) {
    this.IsCheckPreviewTicker = false;
    this.IsScrollingDirection = item;
  }

  OnChangeSpeed(speed) {
    this.IsCheckPreviewTicker = false;
    this.IsSpeed = Number(speed);
  }

  tickerForm = this.fb.group({
    title: [''],
    body: ['', Validators.required],
    high_priority: [false],
    acknowledgement_required: [false],
    unobtrusive: [false],
    self_distructive: [false],
    auto_close: [false],
    auto_close_time: [0],
    allow_manual_close: [false],
    lifetime_given: [true],
    lifetime: [1],
    lifetime_option: ['day'],
    speed: ['10'],
    allow_feedback: [false],
    scheduled: [false],
    schedule_option: [null],
    schedule_time_start: [null],
    schedule_time_end: [null],
    reminder: [false],
    reminder_time_list: [null],
    scroll_direction: ['left'],
    position: ['bottom'],
    device_type: [null],
    call_alert: [false],
    email_alert: [false],
    sms_alert: [false],
    teams_alert: [false],
    template_name: ['']
  })

  IsTickerColorValue: any;
  ShowFooterImgCheck: any = false
  async IsTickerColorChange(event: any) {
    this.ShowFooterImgCheck = event.show_alert_footer;
    this.IsTickerColorValue = event.id;
    this.SkinId = event.id;
    if (event.name === 'White') {
      this.IsWhiteColor = true;
    } else {
      this.IsWhiteColor = false;
    }
    if (this.SkinId) {
      // this.GetSkinListById();
      this.GetLocalSkinListById(this.SkinId);
      this.IsCheckPreviewTicker = false;
      await new Promise(f => setTimeout(f, 2000));
      this.IsScrollingScript();
      // this.SetInterval = setInterval(() => {
      //   this.IsScrollingScript();
      //   if (this.SetInterval > 2) {
      //     clearInterval(this.SetInterval);
      //   }
      // }, 2000);
    }
  }

  // Getter method to access formcontrols
  get myTickerForm() {
    return this.tickerForm.controls;
  }

  OnTickerSubmit(val: any) {
    if (this.DefaultSettingList.autoclose_time_seconds === 0 ) {
      this.toastr.warning("Auto Close should be greater than 1");
      return;
    }
    if (this.DefaultSettingList.autoclose_time_seconds > 999) {
      this.toastr.warning("Auto close should be less than 999 minutes");
      return;
    } 
    if (this.SechduleData.enabled) {
      if (this.SechduleData.end_after_occurrence === 0 ) {
        this.toastr.warning("Schedule End After occurrence count  cannot be less than 1");
        return;
      }
      if (this.SechduleData.end_after_occurrence > 365) {
        this.toastr.warning("Schedule End after occurrence count cannot exceed 365");
        return;
      }
    }

    this.startTimer();
    this.submitted = true;
    this.tickerForm.markAllAsTouched();
    if (!this.tickerForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.tickerForm.value };
    const formData = new FormData();
    formData.append('html', this.ScriptScrollingHTML);
    formData.append('name', this.AlertScrollingEditTitlePreviewName);
    formData.append('body_text', this.AlertScrollingEditBodyPreview);
    formData.append('skin', this.SkinId);
    formData.append('scheduled_data', this.ScheduleId);
    if (val === 'template') {
      formData.append('is_template', 'true');
    } else {
      formData.append('is_template', 'false');
    }
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    this.TickerAlertLoading = true;
    if (this.AlertEdit === '') {
      this.http.post('tickeralert/', formData).subscribe((res: any) => {
        this.StopTimeLoading = true;
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Scrolling Ticker Added Successfully !!");
          if (val === 'next') {
            this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          }  else if(val === 'template') {
            this.router.navigate([`/message`]);
          } else {
            this.router.navigate([`/create-alerts/draft`]);
          }
          // this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          this.tickerForm.reset();
          this.loading = false;
          this.TickerAlertLoading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
          this.loading = false;
          this.TickerAlertLoading = false;
        }
      }, error => {
        this.loading = false;
        this.TickerAlertLoading = false;
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
    } else {
      this.http.patch(`tickeralert/${this.TickerAlertId}/`, formData).subscribe((res: any) => {
        this.StopTimeLoading = true;
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Scrolling Ticker Updated Successfully !!");
          // this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          if (val === 'next') {
            this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          }  else if(val === 'template') {
            this.router.navigate([`/message`]);
          } else {
            this.router.navigate([`/create-alerts/draft`]);
          }
          this.tickerForm.reset();

          this.loading = false;
          this.TickerAlertLoading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
          this.loading = false;
          this.TickerAlertLoading = false;
        }
      }, error => {
        this.loading = false;
        this.TickerAlertLoading = false;
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

  // Scrolling Ticker Alert Get By ID 
  IsTickerAlertByIdRes: any = false;
  GetTickerAlertById() {
    this.loading = true;
    this.http.get(`alerts_database/${this.AlertId}/`).subscribe(async (res: any) => {
      this.IsTickerAlertByIdRes = res.status;
      if (this.AlertEdit === '') {
        this.OnLoadAllApiResponseCheck;
      } else {
        this.OnLoadAllApiResponseCheckEditTicker();
      }
      if (res.status === true) {
        this.loading = false;
        this.TickerAlertId = res.data.ticker_alert.id;
        this.tickerForm.setValue({
          title: res.data.ticker_alert.title,
          body: res.data.ticker_alert.body,
          high_priority: res.data.ticker_alert.high_priority,
          acknowledgement_required: res.data.ticker_alert.acknowledgement_required,
          unobtrusive: res.data.ticker_alert.unobtrusive,
          self_distructive: res.data.ticker_alert.self_distructive,
          auto_close: res.data.ticker_alert.auto_close,
          auto_close_time: res.data.ticker_alert.auto_close_time,
          allow_manual_close: res.data.ticker_alert.allow_manual_close,
          lifetime_given: res.data.ticker_alert.lifetime_given,
          lifetime: res.data.ticker_alert.lifetime,
          lifetime_option: res.data.ticker_alert.lifetime_option,
          speed: res.data.ticker_alert.speed,
          allow_feedback: res.data.ticker_alert.allow_feedback,
          scheduled: '',
          schedule_option: '',
          schedule_time_start: '',
          schedule_time_end: '',
          scroll_direction: 'left',
          reminder: res.data.ticker_alert.reminder,
          reminder_time_list: res.data.ticker_alert.reminder_time_list,
          // width: res.data.ticker_alert.width,
          // height: res.data.ticker_alert.height,
          position: res.data.ticker_alert.position,
          device_type: res.data.ticker_alert.device_type,
          call_alert: res.data.ticker_alert.call_alert,
          email_alert: res.data.ticker_alert.email_alert,
          sms_alert: res.data.ticker_alert.sms_alert,
          teams_alert: res.data.ticker_alert.teams_alert,
          template_name: ''
        });
        this.SkinId = res.data.ticker_alert.skin;
        this.AlertScrollingEditTitle = res.data.ticker_alert.title;
        this.AlertScrollingEditBody = res.data.ticker_alert.body;
        this.AlertScrollingEditTitlePreview = res.data.ticker_alert.name;
        this.AlertScrollingEditBodyPreview = res.data.ticker_alert.body_text;
        this.IsTickerClose = res.data.ticker_alert.auto_close;

        this.AlertScrollingEditTitlePreviewName = res.data.ticker_alert.name;

        // this.SechduleData = res.data.ticker_alert.scheduled_data;
        // this.ScheduleId = res.data.ticker_alert.scheduled_data.id;
        // let ScheduleChoice = res.data.ticker_alert.scheduled_data.schedule_choice;
        // this.OnShowSchedule(ScheduleChoice)
        // this.WeeklyDay = JSON.parse(res.data.ticker_alert.scheduled_data.weekly_day);

        if (res.data.ticker_alert.scheduled_data.enabled) {
          this.IsSechduleEnabledTicker = true;
          this.SechduleData.enabled = res.data.ticker_alert.scheduled_data.enabled;
          this.SechduleData.schedule_choice = res.data.ticker_alert.scheduled_data.schedule_choice;
          // this.SechduleData = res.data.ticker_alert.scheduled_data;
          this.ScheduleId = res.data.ticker_alert.scheduled_data.id;
          let ScheduleChoice = res.data.ticker_alert.scheduled_data.schedule_choice;
          this.OnShowSchedule(ScheduleChoice)
          this.WeeklyDay = JSON.parse(res.data.ticker_alert.scheduled_data.weekly_day);

          this.SechduleData.once_start_date = res.data.ticker_alert.scheduled_data.once_start_date;
          this.SechduleData.once_end_date = res.data.ticker_alert.scheduled_data.once_end_date;
          this.SechduleData.daily_day_choice = res.data.ticker_alert.scheduled_data.daily_day_choice;
          this.SechduleData.weekly_choice = res.data.ticker_alert.scheduled_data.weekly_choice;
          this.SechduleData.schedule_date_start = res.data.ticker_alert.scheduled_data.schedule_date_start;
          this.SechduleData.schedule_end_choice = res.data.ticker_alert.scheduled_data.schedule_end_choice;
          this.SechduleData.end_after_occurrence = res.data.ticker_alert.scheduled_data.end_after_occurrence;
          this.SechduleData.end_after_date = res.data.ticker_alert.scheduled_data.end_after_date;
          this.SechduleData.alert_start_time = res.data.ticker_alert.scheduled_data.alert_start_time;
          this.SechduleData.alert_end_time = res.data.ticker_alert.scheduled_data.alert_end_time;
        }

        if (!this.PolicyAlertSetting[2].checked) {
          this.DefaultSettingList.allow_manual_close = true;
          this.IsTickerClose = true;
        } else {
          this.IsTickerClose = true;
        }

        this.authService.setCurrentUser({ token: res.token });
        if (this.SkinId) {
          // this.GetSkinListById();
          this.GetLocalSkinListById(this.SkinId);
          await new Promise(f => setTimeout(f, 2000));
          this.IsScrollingScript();

          // this.SetInterval = setInterval(() => {
          //   this.IsScrollingScript();
          //   if (this.SetInterval > 2) {
          //     clearInterval(this.SetInterval);
          //   }
          // }, 2000);
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

  // Scrolling Ticker Alert Draft Get By ID 
  IsTickerAlertDraftByIdRes: any = false;
  GetTickerAlertDraftById() {
    this.loading = true;
    this.http.get(`tickeralert/${this.AlertId}/`).subscribe(async (res: any) => {
      this.IsTickerAlertDraftByIdRes = res.status;
      if (this.AlertEdit === '') {
        this.OnLoadAllApiResponseCheck;
      } else {
        this.OnLoadAllApiResponseCheckEditTicker();
      }
      if (res.status === true) {
        this.loading = false;
        this.TickerAlertId = res.data.id;
        this.tickerForm.setValue({
          title: res.data.title,
          body: res.data.body,
          high_priority: res.data.high_priority,
          acknowledgement_required: res.data.acknowledgement_required,
          unobtrusive: res.data.unobtrusive,
          self_distructive: res.data.self_distructive,
          auto_close: res.data.auto_close,
          auto_close_time: res.data.auto_close_time,
          allow_manual_close: res.data.allow_manual_close,
          lifetime_given: res.data.lifetime_given,
          lifetime: res.data.lifetime,
          lifetime_option: res.data.lifetime_option,
          speed: res.data.speed,
          allow_feedback: res.data.allow_feedback,
          scheduled: '',
          schedule_option: '',
          schedule_time_start: '',
          schedule_time_end: '',
          scroll_direction: 'left',
          reminder: res.data.reminder,
          reminder_time_list: res.data.reminder_time_list,
          // width: res.data.width,
          // height: res.data.height,
          position: res.data.position,
          device_type: res.data.device_type,
          call_alert: res.data.call_alert,
          email_alert: res.data.email_alert,
          sms_alert: res.data.sms_alert,
          teams_alert: res.data.teams_alert,
          template_name: ''
        });
        this.SkinId = res.data.skin.id;
        this.AlertScrollingEditTitle = res.data.name;
        this.AlertScrollingEditBody = res.data.body_text;

        this.AlertScrollingEditTitlePreview = res.data.name;
        this.AlertScrollingEditBodyPreview = res.data.body_text;

        this.AlertScrollingEditTitlePreviewName = res.data.ticker_alert.name;

        // this.SechduleData = res.data.scheduled_data;
        // this.ScheduleId = res.data.scheduled_data.id;
        // let ScheduleChoice = res.data.scheduled_data.schedule_choice;
        // this.OnShowSchedule(ScheduleChoice)
        // this.WeeklyDay = JSON.parse(res.data.scheduled_data.weekly_day);

        if (res.data.scheduled_data.enabled) {
          this.IsSechduleEnabledTicker = true;
          this.SechduleData.enabled = res.data.scheduled_data.enabled;
          this.SechduleData.schedule_choice = res.data.scheduled_data.schedule_choice;
          // this.SechduleData = res.data.scheduled_data;
          this.ScheduleId = res.data.scheduled_data.id;
          let ScheduleChoice = res.data.scheduled_data.schedule_choice;
          this.OnShowSchedule(ScheduleChoice)
          this.WeeklyDay = JSON.parse(res.data.scheduled_data.weekly_day);

          this.SechduleData.once_start_date = res.data.scheduled_data.once_start_date;
          this.SechduleData.once_end_date = res.data.scheduled_data.once_end_date;
          this.SechduleData.daily_day_choice = res.data.scheduled_data.daily_day_choice;
          this.SechduleData.weekly_choice = res.data.scheduled_data.weekly_choice;
          this.SechduleData.schedule_date_start = res.data.scheduled_data.schedule_date_start;
          this.SechduleData.schedule_end_choice = res.data.scheduled_data.schedule_end_choice;
          this.SechduleData.end_after_occurrence = res.data.scheduled_data.end_after_occurrence;
          this.SechduleData.end_after_date = res.data.scheduled_data.end_after_date;
          this.SechduleData.alert_start_time = res.data.scheduled_data.alert_start_time;
          this.SechduleData.alert_end_time = res.data.scheduled_data.alert_end_time;
        }

        if (!this.PolicyAlertSetting[2].checked) {
          this.DefaultSettingList.allow_manual_close = true;
          this.IsTickerClose = true;
        } else {
          this.IsTickerClose = true;
        }

        this.authService.setCurrentUser({ token: res.token });
        if (this.SkinId) {
          // this.GetSkinListById();
          this.GetLocalSkinListById(this.SkinId);
          await new Promise(f => setTimeout(f, 2000));
          this.IsScrollingScript();

          // this.SetInterval = setInterval(() => {
          //   this.IsScrollingScript();
          //   if (this.SetInterval > 2) {
          //     clearInterval(this.SetInterval);
          //   }
          // }, 2000);
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

  // Scrolling Ticker All function End

  // RSVP All function Start

  RSVPForm = this.fb.group({
    title: [''],
    body: ['', Validators.required],
    high_priority: [false],
    acknowledgement_required: [false],
    self_distructive: [false],
    auto_close: [false],
    auto_close_time: [0],
    allow_manual_close: [false],
    lifetime_given: [true],
    lifetime: [1],
    lifetime_option: ['day'],
    // add_print_button: [''],
    allow_feedback: [false],
    question_1: ['Will you accept the invitation?'],
    question1_option_1: ['Yes'],
    question1_option_2: ['No'],
    question_2_selected: [false],
    question_2: ['What is your reason?'],
    scheduled: [false],
    schedule_option: [''],
    schedule_time_start: [''],
    schedule_time_end: [''],
    reminder: [''],
    reminder_time_list: [''],
    width: [500],
    height: [300],
    position: ['bottom-right'],
    resizable: [false],
    fullscreen: [false],
    device_type: [''],
    template_name: ['']
  })

  IsRSVPColorValue: any;
  async IsRSVPColorChange(event: any) {
    this.IsRSVPColorValue = event.show_alert_footer;
    this.SkinId = event.target.value;
    // this.IsRSVPColorValue = event.show_alert_footer;
    // this.IsRSVPColorValue = event.target.value;
    // this.SkinId = event.target.value;
    if (event.name === 'White') {
      this.IsWhiteColor = true;
    } else {
      this.IsWhiteColor = false;
    }
    if (this.SkinId) {
      // this.GetSkinListById();
      this.GetLocalSkinListById(this.SkinId);
      await new Promise(f => setTimeout(f, 2000));
      this.IsRSVPScript();
      // this.SetInterval = setInterval(() => {
      //   this.IsRSVPScript();
      //   if (this.SetInterval > 2) {
      //     clearInterval(this.SetInterval);
      //   }
      // }, 2000);
    }
  }

  // Getter method to access formcontrols
  get myRSVPForm() {
    return this.RSVPForm.controls;
  }

  OnRSVPSubmit(val: any) {
    if (this.DefaultSettingList.autoclose_time_seconds === 0 ) {
      this.toastr.warning("Auto Close should be greater than 1");
      return;
    }
    if (this.DefaultSettingList.autoclose_time_seconds > 999) {
      this.toastr.warning("Auto close should be less than 999 minutes");
      return;
    } 
    if (this.SechduleData.enabled) {
      if (this.SechduleData.end_after_occurrence === 0 ) {
        this.toastr.warning("Schedule End After occurrence count  cannot be less than 1");
        return;
      }
      if (this.SechduleData.end_after_occurrence > 365) {
        this.toastr.warning("Schedule End after occurrence count cannot exceed 365");
        return;
      }
    }
    
    this.startTimer();
    this.IsRSVPScript();
    this.submitted = true;
    this.RSVPForm.markAllAsTouched();
    if (!this.RSVPForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.RSVPForm.value };
    const formData = new FormData();
    formData.append('name', this.AlertRSVPEditTitlePreviewName);
    formData.append('body_text', this.AlertRSVPEditBodyPreview);
    formData.append('html', this.ScriptRSVPHTML);
    formData.append('skin', this.SkinId);
    formData.append('scheduled_data', this.ScheduleId);
    if (val === 'template') {
      formData.append('is_template', 'true');
    } else {
      formData.append('is_template', 'false');
    }
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    this.RSVPAlertLoading = true;
    if (this.AlertEdit === '') {
      this.http.post('rsvpalert/', formData).subscribe((res: any) => {
        this.StopTimeLoading = true;
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("RSVP Added Successfully !!");
          if (val === 'next') {
            this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          }  else if(val === 'template') {
            this.router.navigate([`/message`]);
          } else {
            this.router.navigate([`/create-alerts/draft`]);
          }
          // this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          this.RSVPForm.reset();
          this.loading = false;
          this.RSVPAlertLoading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
          this.loading = false;
          this.RSVPAlertLoading = false;
        }
      }, error => {
        this.loading = false;
        this.RSVPAlertLoading = false;
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
    } else {
      this.http.patch(`rsvpalert/${this.RSVPAlertId}/`, formData).subscribe((res: any) => {
        this.StopTimeLoading = true;
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("RSVP Updated Successfully !!");
          if (val === 'next') {
            this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          }  else if(val === 'template') {
            this.router.navigate([`/message`]);
          } else {
            this.router.navigate([`/create-alerts/draft`]);
          }
          // this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
          this.RSVPForm.reset();
          this.loading = false;
          this.RSVPAlertLoading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.error(res.message);
          this.loading = false;
          this.RSVPAlertLoading = false;
        }
      }, error => {
        this.loading = false;
        this.RSVPAlertLoading = false;
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

  // RSVP Alert Get By ID 
  GetRSVPAlertById() {
    this.loading = true;
    this.http.get(`alerts_database/${this.AlertId}/`).subscribe(async (res: any) => {
      this.IsPopupAlertByIdRes = res.status;
      if (this.AlertEdit === '') {
        this.OnLoadAllApiResponseCheck;
      } else {
        this.OnLoadAllApiResponseCheckEdit();
      }
      if (res.status === true) {
        this.loading = false;
        this.RSVPAlertId = res.data.rsvp_alert.id;
        this.RSVPForm.setValue({
          title: res.data.rsvp_alert.title,
          body: res.data.rsvp_alert.body,
          high_priority: res.data.rsvp_alert.high_priority,
          acknowledgement_required: false,
          self_distructive: res.data.rsvp_alert.self_distructive,
          auto_close: res.data.rsvp_alert.auto_close,
          auto_close_time: res.data.rsvp_alert.auto_close_time,
          allow_manual_close: true,
          lifetime_given: res.data.rsvp_alert.lifetime_given,
          lifetime: res.data.rsvp_alert.lifetime,
          lifetime_option: res.data.rsvp_alert.lifetime_option,
          allow_feedback: res.data.rsvp_alert.allow_feedback,
          question_1: res.data.rsvp_alert.question_1,
          question1_option_1: res.data.rsvp_alert.question1_option_1,
          question1_option_2: res.data.rsvp_alert.question1_option_2,
          question_2_selected: res.data.rsvp_alert.question_2_selected,
          question_2: res.data.rsvp_alert.question_2,
          scheduled: '',
          schedule_option: '',
          schedule_time_start: '',
          schedule_time_end: '',
          reminder: '',
          reminder_time_list: '',
          width: res.data.rsvp_alert.width,
          height: res.data.rsvp_alert.height,
          position: res.data.rsvp_alert.position,
          resizable: res.data.rsvp_alert.resizable,
          fullscreen: res.data.rsvp_alert.fullscreen,
          device_type: res.data.rsvp_alert.device_type,
          template_name: ''
        });
        this.SkinId = res.data.rsvp_alert.skin;
        this.AlertRSVPEditTitlePreview = res.data.rsvp_alert.name;
        this.AlertRSVPEditTitlePreviewName = res.data.rsvp_alert.name;

        this.AlertRSVPEditBodyPreview = res.data.rsvp_alert.body_text;
        this.IsRSVPClose = res.data.rsvp_alert.auto_close;


        this.questionSelected2RSVP = res.data.rsvp_alert.question_2_selected;

        // this.SechduleData = res.data.rsvp_alert.scheduled_data;
        // this.ScheduleId = res.data.rsvp_alert.scheduled_data.id;
        // let ScheduleChoice = res.data.rsvp_alert.scheduled_data.schedule_choice;
        // this.OnShowSchedule(ScheduleChoice)
        // this.WeeklyDay = JSON.parse(res.data.rsvp_alert.scheduled_data.weekly_day);

        if (res.data.rsvp_alert.scheduled_data.enabled) {
          this.IsSechduleEnabledRSVP = true;
          this.SechduleData.enabled = res.data.rsvp_alert.scheduled_data.enabled;
          this.SechduleData.schedule_choice = res.data.rsvp_alert.scheduled_data.schedule_choice;
          // this.SechduleData = res.data.rsvp_alert.scheduled_data;
          this.ScheduleId = res.data.rsvp_alert.scheduled_data.id;
          let ScheduleChoice = res.data.rsvp_alert.scheduled_data.schedule_choice;
          this.OnShowSchedule(ScheduleChoice)
          this.WeeklyDay = JSON.parse(res.data.rsvp_alert.scheduled_data.weekly_day);

          this.SechduleData.once_start_date = res.data.rsvp_alert.scheduled_data.once_start_date;
          this.SechduleData.once_end_date = res.data.rsvp_alert.scheduled_data.once_end_date;
          this.SechduleData.daily_day_choice = res.data.rsvp_alert.scheduled_data.daily_day_choice;
          this.SechduleData.weekly_choice = res.data.rsvp_alert.scheduled_data.weekly_choice;
          this.SechduleData.schedule_date_start = res.data.rsvp_alert.scheduled_data.schedule_date_start;
          this.SechduleData.schedule_end_choice = res.data.rsvp_alert.scheduled_data.schedule_end_choice;
          this.SechduleData.end_after_occurrence = res.data.rsvp_alert.scheduled_data.end_after_occurrence;
          this.SechduleData.end_after_date = res.data.rsvp_alert.scheduled_data.end_after_date;
          this.SechduleData.alert_start_time = res.data.rsvp_alert.scheduled_data.alert_start_time;
          this.SechduleData.alert_end_time = res.data.rsvp_alert.scheduled_data.alert_end_time;
        }

        if (!this.PolicyAlertSetting[2].checked) {
          this.DefaultSettingList.allow_manual_close = true;
          this.IsClose = true;
          this.IsRSVPClose = true;
        } else {
          this.IsClose = true;
          this.IsRSVPClose = true;
        }

        this.authService.setCurrentUser({ token: res.token });
        if (this.SkinId) {
          // this.GetSkinListById();
          this.GetLocalSkinListById(this.SkinId);
          await new Promise(f => setTimeout(f, 2000));
          this.IsRSVPScript();
          // this.SetInterval = setInterval(() => {
          //   this.IsRSVPScript();
          //   if (this.SetInterval > 2) {
          //     clearInterval(this.SetInterval);
          //   }
          // }, 2000);
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

  // RSVP Alert Draft Get By ID 
  GetRSVPAlertDraftById() {
    this.loading = true;
    this.http.get(`rsvpalert/${this.AlertId}/`).subscribe(async (res: any) => {
      this.IsPopupAlertByIdRes = res.status;
      if (this.AlertEdit === '') {
        this.OnLoadAllApiResponseCheck;
      } else {
        this.OnLoadAllApiResponseCheckEdit();
      }
      if (res.status === true) {
        this.loading = false;
        this.RSVPAlertId = res.data.id;
        this.RSVPForm.setValue({
          title: res.data.title,
          body: res.data.body,
          high_priority: res.data.high_priority,
          acknowledgement_required: false,
          self_distructive: res.data.self_distructive,
          auto_close: res.data.auto_close,
          auto_close_time: res.data.auto_close_time,
          allow_manual_close: true,
          lifetime_given: res.data.lifetime_given,
          lifetime: res.data.lifetime,
          lifetime_option: res.data.lifetime_option,
          allow_feedback: res.data.allow_feedback,
          question_1: res.data.question_1,
          question1_option_1: res.data.question1_option_1,
          question1_option_2: res.data.question1_option_2,
          question_2_selected: res.data.question_2_selected,
          question_2: res.data.question_2,
          scheduled: '',
          schedule_option: '',
          schedule_time_start: '',
          schedule_time_end: '',
          reminder: '',
          reminder_time_list: '',
          width: res.data.width,
          height: res.data.height,
          position: res.data.position,
          resizable: res.data.resizable,
          fullscreen: res.data.fullscreen,
          device_type: res.data.device_type,
          template_name: ''
        });
        this.SkinId = res.data.skin.id;
        this.AlertRSVPEditTitlePreview = res.data.name;
        
        this.AlertRSVPEditTitlePreviewName = res.data.name;
        this.AlertRSVPEditBodyPreview = res.data.body_text;

        this.questionSelected2RSVP = res.data.question_2_selected;

        // this.SechduleData = res.data.scheduled_data;
        // this.ScheduleId = res.data.scheduled_data.id;
        // let ScheduleChoice = res.data.scheduled_data.schedule_choice;
        // this.OnShowSchedule(ScheduleChoice)
        // this.WeeklyDay = JSON.parse(res.data.scheduled_data.weekly_day);

        if (res.data.scheduled_data.enabled) {
          this.IsSechduleEnabledRSVP = true;
          this.SechduleData.enabled = res.data.scheduled_data.enabled;
          this.SechduleData.schedule_choice = res.data.scheduled_data.schedule_choice;
          // this.SechduleData = res.data.scheduled_data;
          this.ScheduleId = res.data.scheduled_data.id;
          let ScheduleChoice = res.data.scheduled_data.schedule_choice;
          this.OnShowSchedule(ScheduleChoice)
          this.WeeklyDay = JSON.parse(res.data.scheduled_data.weekly_day);

          this.SechduleData.once_start_date = res.data.scheduled_data.once_start_date;
          this.SechduleData.once_end_date = res.data.scheduled_data.once_end_date;
          this.SechduleData.daily_day_choice = res.data.scheduled_data.daily_day_choice;
          this.SechduleData.weekly_choice = res.data.scheduled_data.weekly_choice;
          this.SechduleData.schedule_date_start = res.data.scheduled_data.schedule_date_start;
          this.SechduleData.schedule_end_choice = res.data.scheduled_data.schedule_end_choice;
          this.SechduleData.end_after_occurrence = res.data.scheduled_data.end_after_occurrence;
          this.SechduleData.end_after_date = res.data.scheduled_data.end_after_date;
          this.SechduleData.alert_start_time = res.data.scheduled_data.alert_start_time;
          this.SechduleData.alert_end_time = res.data.scheduled_data.alert_end_time;
        }

        if (!this.PolicyAlertSetting[2].checked) {
          this.DefaultSettingList.allow_manual_close = true;
          this.IsClose = true;
          this.IsRSVPClose = true;
        } else {
          this.IsClose = true;
          this.IsRSVPClose = true;
        }

        this.authService.setCurrentUser({ token: res.token });
        if (this.SkinId) {
          // this.GetSkinListById();
          this.GetLocalSkinListById(this.SkinId);

          await new Promise(f => setTimeout(f, 2000));
          this.IsRSVPScript();

          // this.SetInterval = setInterval(() => {
          //   this.IsRSVPScript();
          //   if (this.SetInterval > 2) {
          //     clearInterval(this.SetInterval);
          //   }
          // }, 2000);
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

  // RSVP All function End

  // Default Settings Check function
  IsDefaultSettingsRes: any = false;
  GetDefaultSettings() {
    this.loading = true;
    this.http.get(`default_settings/`, null).subscribe((res: any) => {
      this.IsDefaultSettingsRes = res.status;
      this.OnLoadAllApiResponseCheck();
      const responseData = res;
      if (res.status === true) {
        this.DefaultSettingList = res.result;
        this.IsClose = this.DefaultSettingList.allow_manual_close;
        this.IsRSVPClose = this.DefaultSettingList.allow_manual_close;
        this.IsTickerClose = this.DefaultSettingList.allow_manual_close;
        if (!this.PolicyAlertSetting[2].checked) {
          this.DefaultSettingList.allow_manual_close = true;
          this.IsClose = true;
          this.IsRSVPClose = true;
          this.IsTickerClose = true;
        }
        if (this.AlertEdit === 'EditMessage') {
          this.GetMessageListById();
        }
        this.IsScript();
        this.IsRSVPScript();

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