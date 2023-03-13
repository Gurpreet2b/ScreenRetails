import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.css'],
})
export class SettingsListComponent implements OnInit {
  public loading = false;
  public loadingServer = false;
  public loadingEmail = false;
  public CommonSettingList: any = {};
  public DefaultSettingList: any = {};
  public LanguageList: any = [];
  public languageId: any;
  public DateTimePopup = new Date();
  public SettingsPicture: any;
  public translateLanguage: any;
  public SMTPLogsFile: any = [];
  public ClientFile: File | undefined;
  public filledpass = ''
  public actualpass = 'ESDtgqa0123'

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.addLangs(['en', 'en']);
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Common Settings`);
    this.GetDefaultSettings();
    this.GetLanguageSettings();
    this.GetCommonSettings();
  }

  OnChangeClose(event: any) {
    if (event.target.checked === true) {
      this.DefaultSettingList.autoclose_boolean = true;
    } else {
      this.DefaultSettingList.autoclose_boolean = true;
    }
  }

  IsAutoClose(event: any) {
    if (event.target.checked) {
      this.DefaultSettingList.allow_manual_close = true;
    } else {
      this.DefaultSettingList.allow_manual_close = true;
    }
  }

  onFileSettings(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file.size > '2097152') {
      this.toastr.warning("File size cannot be larger than 2MB!");
      return;
    } else {
      this.SettingsPicture = file;
    }

  }
  switchLanguage(event: any) {
    this.translateLanguage = event.target.value;
  }

  GetCommonSettings() {
    this.loading = true;
    this.http.get(`settings/`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.CommonSettingList = res.result;
        this.SMTPLogsFile = res.result.smtp_logs;
        this.authService.setDateFormat(this.CommonSettingList.date_format);
        this.authService.setTimeFormat(this.CommonSettingList.time_format);
        this.CommonSettingList.expiration_time_minute_boolean = true;
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

  IsExpireTime(event: any){
    if (event.target.checked === true) {
      this.CommonSettingList.maximum_sessions_boolean = true
      this.CommonSettingList.maximum_sessions_per_user_boolean = true
    }
  }

  IsMaximumServer(event: any) {
    if (event.target.checked === true) {
      this.CommonSettingList.expiration_time_minute_boolean = true
    }
  }

  IsMaximumPublisher(event: any){
    if (event.target.checked === true) {
      this.CommonSettingList.expiration_time_minute_boolean = true
    }
  }

  onSubmitCommon() {
    this.loading = true;
    if (this.CommonSettingList.maximum_sessions_boolean === true || this.CommonSettingList.maximum_sessions_per_user_boolean === true) {
      this.CommonSettingList.expiration_time_minute_boolean = true;
    }

    if (this.CommonSettingList.client_polling_interval > 900) {
      this.toastr.warning("Client Polling Interval should be less than 900 seconds");
      return;
    } else if (this.CommonSettingList.client_polling_interval < 60 ) {
      this.toastr.warning("Client Polling Interval should be greater than 60 seconds");
      return;
    }
    
    const formData = new FormData();
    formData.append('get_help', this.CommonSettingList.get_help),
    formData.append('simple_group_sending', this.CommonSettingList.simple_group_sending),
    formData.append('content_approving', this.CommonSettingList.content_approving);
    formData.append('date_format', this.CommonSettingList.date_format);
    formData.append('time_format', this.CommonSettingList.time_format);
    formData.append('default_language', this.CommonSettingList.default_language);
    formData.append('smtp_server', this.CommonSettingList.smtp_server);
    formData.append('smtp_port', this.CommonSettingList.smtp_port);
    formData.append('smtp_use_ssl', this.CommonSettingList.smtp_use_ssl);
    formData.append('smtp_username', this.CommonSettingList.smtp_username);
    formData.append('smtp_password', this.CommonSettingList.smtp_password);
    formData.append('smtp_use_authentication', this.CommonSettingList.smtp_use_authentication);
    formData.append('smtp_from_address', this.CommonSettingList.smtp_from_address);
    formData.append('smtp_logging', this.CommonSettingList.smtp_logging);
    formData.append('smtp_use_tls', this.CommonSettingList.smtp_use_tls);
    formData.append('sms_username', this.CommonSettingList.sms_username);
    formData.append('sms_password', this.CommonSettingList.sms_password);

    formData.append('voice_username', this.CommonSettingList.voice_username);
    formData.append('voice_api_key', this.CommonSettingList.voice_api_key);

    formData.append('trace_logs', this.CommonSettingList.trace_logs);
    formData.append('info_logs', this.CommonSettingList.info_logs);
    formData.append('debug_logs', this.CommonSettingList.debug_logs);
    formData.append('error_logs', this.CommonSettingList.error_logs);
    formData.append('fatal_logs', this.CommonSettingList.fatal_logs);
    formData.append('logs_duration', this.CommonSettingList.logs_duration);

    formData.append('password_policy_enabled', this.CommonSettingList.password_policy_enabled);
    formData.append('password_policy_min_length ', this.CommonSettingList.password_policy_min_length);
    formData.append('password_policy_max_length', this.CommonSettingList.password_policy_max_length);
    formData.append('password_policy_min_lower_case', this.CommonSettingList.password_policy_min_lower_case);
    formData.append('password_policy_min_upper_case', this.CommonSettingList.password_policy_min_upper_case);
    formData.append('password_policy_min_digit', this.CommonSettingList.password_policy_min_digit);
    formData.append('password_policy_min_symbol', this.CommonSettingList.password_policy_min_symbol);
    formData.append('password_expiry_enabled', this.CommonSettingList.password_expiry_enabled);
    formData.append('password_expiry_days', this.CommonSettingList.password_expiry_days);
    formData.append('password_expiry_change_password_days', this.CommonSettingList.password_expiry_change_password_days);
    formData.append('account_lockup_enabled', this.CommonSettingList.account_lockup_enabled);
    formData.append('attemps_count_before_lockup', this.CommonSettingList.attemps_count_before_lockup);
    formData.append('time_to_keep_locked_up', this.CommonSettingList.time_to_keep_locked_up);
    formData.append('lockup_message', this.CommonSettingList.lockup_message);
    formData.append('password_recovery_on_lockscreen', this.CommonSettingList.password_recovery_on_lockscreen);

    formData.append('maximum_sessions_boolean', this.CommonSettingList.maximum_sessions_boolean);
    formData.append('maximum_sessions_count', this.CommonSettingList.maximum_sessions_count);
    formData.append('maximum_sessions_per_user_boolean', this.CommonSettingList.maximum_sessions_per_user_boolean);
    formData.append('maximum_sessions_per_user_count', this.CommonSettingList.maximum_sessions_per_user_count);
    formData.append('expiration_time_minute_boolean', this.CommonSettingList.expiration_time_minute_boolean);
    formData.append('expiration_time_minute', this.CommonSettingList.expiration_time_minute);
    formData.append('client_polling_interval', this.CommonSettingList.client_polling_interval);

    this.http.post(`settings/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("System Configuration Updated Successfully !!");
        this.authService.setCurrentUser({ token: res.token });
        this.GetCommonSettings();
        this.loading = false;
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


  onSubmitClient() {
    this.loading = true;
    
    const formData = new FormData();
    formData.append('maximum_client_connection ', this.CommonSettingList.maximum_client_connection);
    formData.append('client_connection_lifetime_minutes ', this.CommonSettingList.client_connection_lifetime_minutes);
    formData.append('uploaded_version ', this.CommonSettingList.uploaded_version);
    formData.append('client_file ', this.ClientFile);

    this.http.post(`settings/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Client File Updated Successfully !!");
        this.authService.setCurrentUser({ token: res.token });
        this.GetCommonSettings();
        this.loading = false;
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



  OnServerConnectivity() {
    this.loadingServer = true;
    const formData = new FormData();
    formData.append('server', this.CommonSettingList.smtp_server);
    formData.append('port', this.CommonSettingList.smtp_port);
    formData.append('smtp_use_ssl', this.CommonSettingList.smtp_use_ssl);
    formData.append('user', this.CommonSettingList.smtp_username);
    formData.append('pwd', this.CommonSettingList.smtp_password);
    formData.append('smtp_use_authentication', this.CommonSettingList.smtp_use_authentication);
    formData.append('smtpl_use_tls', this.CommonSettingList.smtpl_use_tls);
    this.http.post(`settings/test_smtp_connectivity/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('SMTP Connection Successfully !!');
        this.loadingServer = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loadingServer = false;
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

  OnSendEmail() {
    this.loadingEmail = true;
    const formData = new FormData();
    formData.append('server', this.CommonSettingList.smtp_server);
    formData.append('port', this.CommonSettingList.smtp_port);
    formData.append('smtp_use_ssl', this.CommonSettingList.smtp_use_ssl);
    formData.append('user', this.CommonSettingList.smtp_username);
    formData.append('pwd', this.CommonSettingList.smtp_password);
    formData.append('smtp_use_authentication', this.CommonSettingList.smtp_use_authentication);
    formData.append('smtpl_use_tls', this.CommonSettingList.smtpl_use_tls);
    formData.append('from_email', this.CommonSettingList.smtp_from_address);
    this.http.post(`settings/send_test_email/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success(res.message);
        this.loadingEmail = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loadingEmail = false;
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

  OnSendSMS() {
    this.loadingEmail = true;
    const formData = new FormData();
    formData.append('username', this.CommonSettingList.sms_username);
    formData.append('password', this.CommonSettingList.sms_password);
    this.http.post(`settings/send_test_sms/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success(res.message);
        this.loadingEmail = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loadingEmail = false;
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

  OnSendToCall() {
    this.loadingEmail = true;
    const formData = new FormData();
    formData.append('username', this.CommonSettingList.voice_username);
    formData.append('api-key', this.CommonSettingList.voice_api_key);
    this.http.post(`settings/send_test_voice_message/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success(res.message);
        this.loadingEmail = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loadingEmail = false;
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

  onSubmitDefaultSettings() {
    this.loading = true;
    const formData = new FormData();
    formData.append('alerts_default_page', this.DefaultSettingList.alerts_default_page),
    formData.append('email', this.DefaultSettingList.email),
    formData.append('sms', this.DefaultSettingList.sms);
    formData.append('text_to_call', this.DefaultSettingList.text_to_call),
    formData.append('windowed_fullscreen', this.DefaultSettingList.windowed_fullscreen),
    formData.append('width', this.DefaultSettingList.width);
    formData.append('height', this.DefaultSettingList.height),
    formData.append('alert_position', this.DefaultSettingList.alert_position),
    formData.append('ticker_position', this.DefaultSettingList.ticker_position);
    formData.append('high_priority_alert', this.DefaultSettingList.high_priority_alert),
    formData.append('acknowledgement_required', this.DefaultSettingList.acknowledgement_required),
    formData.append('self_destructing_alert', this.DefaultSettingList.self_destructing_alert);
    formData.append('autoclose_boolean', this.DefaultSettingList.autoclose_boolean);
    formData.append('autoclose_time_seconds', this.DefaultSettingList.autoclose_time_seconds);
    formData.append('allow_manual_close', this.DefaultSettingList.allow_manual_close);
    formData.append('schedule_alert', this.DefaultSettingList.schedule_alert);
    formData.append('lifetime_count', this.DefaultSettingList.lifetime_count);
    formData.append('lifetime_choice', this.DefaultSettingList.lifetime_choice);

    formData.append('default_email', this.DefaultSettingList.default_email);
    formData.append('default_sms_number', this.DefaultSettingList.default_sms_number);
    formData.append('default_teams_address', this.DefaultSettingList.default_teams_address);
    formData.append('default_text_to_call_number', this.DefaultSettingList.default_text_to_call_number);

    this.http.post(`default_settings/`, formData).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.toastr.success("Default Settings Updated Successfully !!");
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
        this.GetDefaultSettings();
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

  GetLanguageSettings() {
    this.loading = true;
    this.http.get(`alert_language_settings/`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.LanguageList = res.result;
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

  onDeleteClientUpdate() {
    this.loading = true;
    this.http.post(`settings/delete_client_auto_update_file/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Client File Deleted Successfully");
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

  onAddLanguage() {
    this.languageId = '';
  }

  onEditLanguage(id: any) {
    this.languageId = id;
  }

  ValueChanged(type: any) {
    if (type === 'Language') {
      this.GetLanguageSettings();
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteLanguage(id);
    }
  }
  onDeleteLanguage(id: number) {
    this.loading = true;
    this.http.delete(`alert_language_settings/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Language Deleted Successfully");
        this.authService.setCurrentUser({ token: res.token });
        this.GetLanguageSettings()
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

  onFileChange(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file.size > '5242880') {
      this.toastr.warning("File size cannot be larger than 5MB!");
      return;
    } else {
      this.ClientFile  = file;
    }
  }

}