import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-policies',
  templateUrl: './create-policies.component.html',
  styleUrls: ['./create-policies.component.css'],
})
export class CreatePoliciesComponent implements OnInit {

  public loading = false;
  public loadingPolicy = false;
  public submitted: boolean;
  public policyId: any = '';
  public ControlEmptyList: any = [];
  public SkinId: any;
  public IsGrantFullControl: any = false;
  public HeaderTextImg: any = '/assets/img/deva-logo.png';

  public show: number;
  public OptList: any = [];
  public OptListSelected: any = [];
  public OuTree: any = [];

  public UserList: any = [];
  public GroupList: any = [];
  public ComputerList: any = [];
  public OUList: any = [];

  public OrgList: any = [];
  public OrganizationList: any = [];
  public AlertSettingList: any = [
    {
      name: "Acknowledgement",
      checked: true
    },
    {
      name: "Full screen",
      checked: true
    },
    {
      name: "Auto-close",
      checked: true
    },
    {
      name: "High-priority",
      checked: true
    },
    {
      name: "Print button",
      checked: true
    },
    {
      name: "Self-destructing",
      checked: true
    },
    // {
    //   name: "Unobtrusive",
    //   checked: true
    // },
  ];
  public UserType: any = 'users';

  public items: any;
  public simpleItems: any = {};
  public config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  public SkinList: any;

  constructor(private http: HttpService,
    private toastr: ToastrService, public translate: TranslateService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Add Policy`);
    this.OrgList = 'all'
    this.policyId = this.activeRoute.snapshot.params['id'] || '';
    if (this.policyId) {
      this.authService.SetRestaurantName(`Edit Policy`);
      this.GetPoliciesListById();
    } else {
      this.authService.SetRestaurantName(`Add Policy`);
      this.GetPoliciesEmptyList();
    }
    this.GetOrganizationList();
    this.GetOrganizationById(1);
  }

  OnGrantFullControl(event: any){
    this.IsGrantFullControl = event.target.checked;
  }

  formUserPolicy = new FormGroup({
    search: new FormControl(''),
  });

  onSearchUserPolicy(formValue: any) {
    this.GetOrganizationById(1);
  }

  onSelectedChange(event: any, data: any) {
    this.OuTree = data;
    if (event.length === 0) {
      this.OrgList = 'all'
      this.OUList = [];
    } else {
      this.OrgList = event;
      this.OUList = event;
    }
    // this.GetOrganizationById(1);
  }


  getItems(parentChildObj: any) {
    let itemsArray = [];
    parentChildObj.forEach((set: any) => {
      itemsArray.push(new TreeviewItem(set))
    });
    return itemsArray;
  }

  GetOrganizationList() {
    this.loading = true;
    this.http.get(`organization/?edit_policy_id=${this.policyId}`, null).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res;
        this.simpleItems = res.data;
        this.items = this.getItems([this.simpleItems]);
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

  IsPolicyUser(event: any, list: any, index: any) {
    let eventData = event.target.checked;
    if (eventData === true) {
      if (this.UserType === 'users') {
        this.UserList.push(list);
        this.OrgList = 'all'
      } else if (this.UserType === 'groups') {
        this.GroupList.push(list);
        this.OrgList = 'all'
      } else if (this.UserType === 'computers') {
        this.ComputerList.push(list);
        this.OrgList = 'all'
      }
    } else {
      if (this.UserType === 'users') {
        let UsersListSelected = this.UserList.filter((x: any) => x.id !== list.id);
        this.UserList = UsersListSelected;
      } else if (this.UserType === 'groups') {
        let GroupListSelected = this.GroupList.filter((x: any) => x.id !== list.id);
        this.GroupList = GroupListSelected;
      } else if (this.UserType === 'computers') {
        let ComputerListSelected = this.ComputerList.filter((x: any) => x.id !== list.id);
        this.ComputerList = ComputerListSelected;
      }
    }
  }

  IsPolicyOPT(event: any, list: any) {
    let eventData = event.target.checked;
    if (eventData === true) {
      this.OptListSelected.push(list);
    } else {
      let OPTListSelected = this.OptListSelected.filter((x: any) => x.id !== list.id);
      this.OptListSelected = OPTListSelected;
    }
  }

  onRemoveRow(index: any, UserType: any) {
    if (UserType === 'users') {
      this.UserList.splice(index, 1);
      // this.UsersListSelected = this.OrganizationList.filter((x: any) => x.name === item.name);
      // this.UsersListSelected[0].selected = false;
    } else if (UserType === 'groups') {
      this.GroupList.splice(index, 1);
    } else if (UserType === 'computers') {
      this.ComputerList.splice(index, 1);
    } else if (UserType === 'OPT') {
      this.OptListSelected.splice(index, 1);
    } else if (UserType === 'OU') {
      this.OUList.splice(index, 1);
    }
  }

  onUserOrg(item: any) {
    this.UserType = item;
    this.OrgList = 'all'
    this.GetOrganizationById(1);
    this.currentPage = 1;

  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  UsersListSelected: any = [];
  GetOrganizationById(page: number) {
    this.loading = true;
    const formData = new FormData();
    
    const formValue = this.formUserPolicy.value;
    const search = formValue.search || '';
    formData.append('search', search);
    formData.append('result_type', this.UserType);
    formData.append('ou', this.OrgList);
    if(this.policyId) {
      formData.append('edit_policy_id', this.policyId)
    }
    this.http.post(`organization/?page=${page}`, formData).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.totalItems = responseData.count;
        this.OrganizationList = res.data;
        if (this.UserType === 'users') {
          if (this.UserList.length > 0) {
            for (let i = 0; i < this.UserList.length; i++) {
              const element = this.UserList[i].id;
              this.UsersListSelected = this.OrganizationList.filter((x: any) => x.id === element);
              if (this.UsersListSelected.length > 0) {
                this.UsersListSelected[0].selected = true;
              }
            }
          }
        } else if (this.UserType === 'groups') {
          if (this.GroupList.length > 0) {
            for (let i = 0; i < this.GroupList.length; i++) {
              const element = this.GroupList[i].id;
              let GroupListSelected = this.OrganizationList.filter((x: any) => x.id === element);
              if (GroupListSelected.length > 0) {
                GroupListSelected[0].selected = true;
              }
            }
          }
        } else if (this.UserType === 'computers') {
          if (this.ComputerList.length > 0) {
            for (let i = 0; i < this.ComputerList.length; i++) {
              const element = this.ComputerList[i].id;
              let ComputerListSelected = this.OrganizationList.filter((x: any) => x.id === element);
              if (ComputerListSelected.length > 0) {
                ComputerListSelected[0].selected = true;
              }
            }
          }
        }

        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumber = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJump) {
        this.PageTotalNumber.push(i);
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

  currentPage: number = 1;
  totalItems: number | undefined;
  onPageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPage = event;
      this.GetOrganizationById(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetOrganizationById(this.currentPage)
    }
  }

  // GetOptList(page: number) {
  //   this.loading = true;
  //   const formData = new FormData();
  //   const formValue = this.formUserPolicy.value;
  //   const search = formValue.search || '';
  //   formData.append('search', search);

  //   let params = new HttpParams();
  //   params = params.append('page', page.toString())
  //   this.http.get(`alerts_database/alerts_list?search=${search}`, null, { params: params }).subscribe((res: any) => {
  //     const responseData = res;
  //     if (res.status === true) {
  //       this.OptList = res.data;
  //       this.totalItems = responseData.count;
  //       this.loading = false;
  //     } else {
  //       this.loading = false;
  //       this.toastr.warning(res.message);
  //     }
  //     this.PageTotalNumber = [];
  //     let Count = responseData.count / 10;
  //     for (let i = 0; i < Count; i += this.PageJump) {
  //       this.PageTotalNumber.push(i);
  //     }
  //   }, error => {
  //     this.toastr.error("Server not reachable");
  //     this.loading = false;
  //   });
  // }



  GetPoliciesEmptyList() {
    this.loading = true;
    this.http.get(`policies/empty_access_control_list/`, null).subscribe((res: any) => {
      this.loading = false;
      this.ControlEmptyList = res;
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

  IsRoleSelected = false;
  onRoleSelected(item) {
    if (item === 'administrator') {
      this.IsRoleSelected = false;
    } else {
      this.IsRoleSelected = true;
    }
  }

  IsLastSelected = false;
  onLastSelected(item: any) {
    if (item === 'recipient') {
      this.IsLastSelected = false;
    } else {
      this.IsLastSelected = true;
    }
  }

  IsAlertSelected = false;
  onAlertSelected(item: any) {
    if (item === 'all') {
      this.IsAlertSelected = false;
    } else {
      this.IsAlertSelected = true;
    }
  }

  IsOrganizationSelected = false;
  onOrganizationSelected(item: any) {
    if (item === 'send') {
      this.IsOrganizationSelected = false;
    } else {
      this.IsOrganizationSelected = true;
    }
  }

  IsSkinSelected = false;
  onSkinSelected(item: any) {
    if (item === 'available') {
      this.IsSkinSelected = false;
    } else {
      this.IsSkinSelected = true;
      this.GetSkinList();
    }
  }


  policiesForm = this.fb.group({
    name: ['', Validators.required],
    role: ['administrator'],
    alert_skin_choice: ['all'],
    alert_setting_choice: ['all'],
    access_control_grant_full_access_boolean: [false],
    publisher_view_rights_choice: ['all'],
    recipients_list_choice: ['all'],
    alerts_template_view_rights_choice: ['all']
  })

  get myPoliciesForm() {
    return this.policiesForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.policiesForm.markAllAsTouched();
    if (!this.policiesForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.policiesForm.value };
    const formData = new FormData();
    formData.append('access_control_list', JSON.stringify(this.ControlEmptyList));
    formData.append('users_list', JSON.stringify(this.UserList));
    formData.append('groups_list', JSON.stringify(this.GroupList));
    formData.append('computers_list', JSON.stringify(this.ComputerList));
    formData.append('ous_list', JSON.stringify(this.OUList));
    formData.append('ous_tree', JSON.stringify(this.OuTree));
    formData.append('alert_skin_id_list', JSON.stringify(this.SkinList));
    formData.append('alert_setting_list', JSON.stringify(this.AlertSettingList));
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    if (this.policyId === '') {
      this.http.post('policies/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Policies Added Successfully !!");
          this.policiesForm.reset();
          this.router.navigate([`/policies`]);
          // this.onDismiss();
          // this.valueChange.emit('Policies');
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
    } else {
      this.http.patch(`policies/${this.policyId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Policies Updated Successfully !!");
          this.policiesForm.reset();
          this.router.navigate([`/policies`]);
          // this.valueChange.emit('Policies');
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
  }

  // onDismiss() {
  //   const target = "#CreatePoliciesModal";
  //   $(target).hide();
  //   $('.modal-backdrop').remove();
  // }

  GetPoliciesListById() {
    this.loadingPolicy = true;
    this.http.get(`policies/${this.policyId}/`).subscribe((res: any) => {
      this.loadingPolicy = false;
      if (res.status === true) {
        this.policiesForm.setValue({
          name: res.result.name,
          role: res.result.role,
          alert_skin_choice: res.result.alert_skin_choice,
          alert_setting_choice: res.result.alert_setting_choice,
          access_control_grant_full_access_boolean: res.result.access_control_grant_full_access_boolean,
          publisher_view_rights_choice: res.result.publisher_view_rights_choice,
          recipients_list_choice: res.result.recipients_list_choice,
          alerts_template_view_rights_choice: res.result.alerts_template_view_rights_choice,
        });

        // this.IsGrantFullControl = res.result.access_control_grant_full_access_boolean;

        if (res.result.recipients_list_choice === 'selected') {
          this.IsLastSelected = true;
        }
        if (res.result.alert_setting_choice === 'selected') {
          this.IsAlertSelected = true;
        }
        if (res.result.alert_skin_choice === 'selected') {
          this.IsSkinSelected = true;
          // this.GetSkinList();
        }
        this.onRoleSelected(res.result.role);
        this.ControlEmptyList = JSON.parse(res.result.access_control_list);
        if (this.ControlEmptyList.length === 0) {
          this.GetPoliciesEmptyList();
        }
        this.UserList = JSON.parse(res.result.users_list);
        this.GroupList = JSON.parse(res.result.groups_list);
        this.ComputerList = JSON.parse(res.result.computers_list);
        this.OUList = JSON.parse(res.result.ous_list);
        if (res.result.alert_skin_id_list.length) {
          if (res.result.alert_skin_id_list !== 'undefined') {
            this.SkinList = res.result.alert_skin_id_list;
          } else {
            this.SkinList = JSON.parse(res.result.alert_skin_id_list);
          }
        } 
        this.AlertSettingList = JSON.parse(res.result.alert_setting_list);
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loadingPolicy = false;
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

  GetSkinList() {
    this.loading = true;
    this.http.get(`skins/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.SkinList = res.data;
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