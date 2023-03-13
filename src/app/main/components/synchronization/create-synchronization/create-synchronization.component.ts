import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService, HttpService } from 'src/app/core/services';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-create-synchronization',
  templateUrl: './create-synchronization.component.html',
  styleUrls: ['./create-synchronization.component.css'],
})
export class CreateSynchronizationComponent implements OnInit {

  public synchronizationId: any = '';
  public loading = false;
  submitted = false;
  values: number[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  items: any;
  simpleItems: any = {};
  GroupList: any = [];
  OUList: any = [];
  OuTree: any = [];

  constructor(private http: HttpService, private toastr: ToastrService,
    public fb: FormBuilder, public translate: TranslateService, private router: Router,
    private authService: AuthService,  private activeRoute: ActivatedRoute,) {
      translate.setDefaultLang(authService.currentLanguage);
  }

  synchronizationForm = this.fb.group({
    name: ['', Validators.required],
    type: [''],
    domain: ['', Validators.required],
    port: [389, Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required],
    sync_ou: ['all'],
    sync_group: ['all'],
    add_new_items_only: [false],
    disabled_account_sync: [false],
    sync_computers: [false],
    auto_sync: [false],
    use_ssl: [false],
  })


  ngOnInit(): void {
    this.synchronizationId = this.activeRoute.snapshot.params['id'] || '';
    // this.dragAreaClass = "dragarea";
    if (this.synchronizationId) {
      this.authService.SetRestaurantName(`Edit Ad Synchronization`);
      this.GetAdListById();
    } else {
      this.authService.SetRestaurantName(`Create Ad Synchronization`);
      this.synchronizationForm.reset();
    }
    // this.authService.SetRestaurantName(`Ad Synchronizing`);
  }

  onSelectedChange(event: any, data: any){
    this.OUList = event;
    this.OuTree = data;
  }

  // Getter method to access formcontrols
  get syncForm() {
    return this.synchronizationForm.controls;
  }

  OnSubmit() {
    this.AutoSyncGap();
    this.submitted = true;
    this.synchronizationForm.markAllAsTouched();
    if (!this.synchronizationForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.synchronizationForm.value};

    const formData = new FormData();
    formData.append('password', btoa(this.synchronizationForm.value.password));
    formData.append('group_list', this.IsSelectedGroupList);
    formData.append('auto_sync_seconds_gap', this.AutoSyncSecondsGap);
    // formData.append('ou_list', this.OUList);
    formData.append('ou_tree', JSON.stringify(this.OuTree));
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.synchronizationId === '') {
      this.http.post('synchronization/', formData).subscribe((res: any) => {
        if(res.status === true) {
          const responseData = res.data;
          this.toastr.success("Synchronization Added Successfully !!");
          this.synchronizationForm.reset();
          this.router.navigate([`/synchronizations`]);
          this.loading = false;
        } else {
          this.toastr.error(res.error);
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        if(error.status === 400) {
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
      this.http.patch(`synchronization/${this.synchronizationId}/`, formData).subscribe((res: any) => {
        if(res.status === true) {
          const responseData = res.data;
          this.toastr.success("Synchronization Updated Successfully !!");
          this.synchronizationForm.reset();
          this.router.navigate([`/synchronizations`]);
          this.loading = false;
        } else {
          this.toastr.error(res.error);
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        if(error.status === 400) {
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

  onDismiss() {
    const target = "#CreateSynchronizationModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
    $("body").addClass("modal-overflow");
  }

  getItems(parentChildObj: any) {
    let itemsArray = [];
    parentChildObj.forEach((set: any) => {
      itemsArray.push(new TreeviewItem(set))
    });
    return itemsArray;
  }


  GetAdList() {
    this.loading = true;

    const formData = new FormData();
    formData.append('domain', this.synchronizationForm.value.domain);
    formData.append('port', this.synchronizationForm.value.port);
    formData.append('username', this.synchronizationForm.value.username);
    formData.append('password', btoa(this.synchronizationForm.value.password));
    formData.append('use_ssl', this.synchronizationForm.value.use_ssl);

    let params = new HttpParams();

    // let FormData = {
    //   domain: this.synchronizationForm.value.domain,
    //   port: this.synchronizationForm.value.port,
    //   username: this.synchronizationForm.value.username,
    //   password: this.synchronizationForm.value.password,
    // }

    this.http.post(`ad_ou_list/`, formData).subscribe((res: any) => {
    // this.http.get(`ad_ou_list/?domain=192.168.223.220&username=Administrator&password=!Q2w3e4r5t&port=389`, null, { params: params }).subscribe((res: any) => {
    if (res.status === true) {
        const responseData = res;
        this.simpleItems = res.data;
        this.items = this.getItems([this.simpleItems]);
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    });
  }

  SearchName: any;
  OnSearch(){
    this.GetGroupList();
  }

  GetGroupList(){
    this.loading = true;

    const formData = new FormData();
    formData.append('search', this.SearchName);
    formData.append('domain', this.synchronizationForm.value.domain);
    formData.append('port', this.synchronizationForm.value.port);
    formData.append('username', this.synchronizationForm.value.username);
    formData.append('password', btoa(this.synchronizationForm.value.password));
    formData.append('use_ssl', this.synchronizationForm.value.use_ssl);

    // let params = new HttpParams();
    // params = params.append('page', page.toString())
    // let FormData = {
    //   domain: this.synchronizationForm.value.domain,
    //   port: this.synchronizationForm.value.port,
    //   username: this.synchronizationForm.value.username,
    //   password: this.synchronizationForm.value.password,
    // }

    this.http.post(`ad_group_list/`, formData).subscribe((res: any) => {
      // this.http.get(`ad_group_list/?domain=192.168.223.220&username=Administrator&password=!Q2w3e4r5t&port=389&search=${this.SearchName}`, null, { params: params }).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res;
        this.GroupList = res.data;
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    });
  }

  IsSelectedGroupList: any = [];
  IsSelectedGroup(data: any, event: any, index: any){
    if (event.target.checked === true) {
      this.IsSelectedGroupList.push(data);
    } else {
      this.IsSelectedGroupList.splice(index, 1);
    }
  }

  DeleteSelectedGroup(index: any) {
    this.IsSelectedGroupList.splice(index, 1);
  }

  IsOUListShow = false;
  IsOUList(data: any) {
    if (data === 'check') {
      this.IsOUListShow = true;
      this.GetAdList();
    } else {
      this.IsOUListShow = false;
    }
  }

  IsGroupListShow = false;
  IsGroupList(group: any) {
    if (group === 'check') {
      this.IsGroupListShow = true;
      this.GetGroupList();
    } else {
      this.IsGroupListShow = false;
    }
  }

  IsAutoSync = false;
  AutoSync(event: any){
    if (event.target.checked === true) { 
      this.IsAutoSync = true;
    } else {
      this.IsAutoSync = false;
    }
  }

  AutoSyncGapNumber: any = 0;
  AutoSyncGapSec: any = 'minutes';
  AutoSyncSecondsGap: any
  AutoSyncGap(){
    if (this.AutoSyncGapSec === 'seconds') {
      this.AutoSyncSecondsGap = this.AutoSyncGapNumber;
    } else if(this.AutoSyncGapSec === 'minutes') {
      this.AutoSyncSecondsGap = this.AutoSyncGapNumber * 60;
    } else if(this.AutoSyncGapSec === 'hours') {
      this.AutoSyncSecondsGap = this.AutoSyncGapNumber * 3600;
    } else if(this.AutoSyncGapSec === 'days') {
      this.AutoSyncSecondsGap = this.AutoSyncGapNumber * 86400;
    } else {
      this.AutoSyncSecondsGap = this.AutoSyncGapNumber * 2628000;
    }
  }

  // Update Function
  private GetAdListById() {
    this.loading = true;
    this.http.get(`synchronization/${this.synchronizationId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.synchronizationForm.setValue({
          name: res.data.name,
          type: "",
          domain: res.data.domain,
          port: res.data.port,
          username: res.data.username,
          password: atob(res.data.password),
          sync_ou: res.data.sync_ou,
          sync_group: res.data.sync_group,
          add_new_items_only: res.data.add_new_items_only,
          disabled_account_sync: res.data.disabled_account_sync,
          sync_computers: res.data.sync_computers,
          auto_sync: res.data.auto_sync,
          use_ssl: res.data.use_ssl
        });
        if(res.data.sync_group === 'selected'){
          this.IsGroupListShow = true;
          this.IsSelectedGroupList = res.data.group_list;
        }
        if(res.data.sync_ou === 'selected'){
          this.IsOUListShow = true;
          this.items = this.getItems([res.data.ou_list]);
          this.OUList = res.data.ou_list;
        }
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    })
  }
}
