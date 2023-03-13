import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root',
})

export class AuthService {

    userKey: string = 'currentUser';
    TitleName: any;
    public currentLanguage: any;

    constructor(private datePipe: DatePipe) { 
        this.currentLanguage = JSON.parse(localStorage.getItem('setLanguage'));
    }

    // setLanguageFormat(language: any){
    //     this.currentLanguage = language;
    // }

    setDateFormat(date: any) {
        this.DateFormat = date;
    }

    DateFormat: any;
    public Dateformat(datas: string) {
        if (this.DateFormat == 'dd/MM/yyyy') {
            return this.datePipe.transform(datas, 'dd/MM/yyyy')
        }
        else if (this.DateFormat == 'yyyy/MM/dd') {
            return this.datePipe.transform(datas, 'yyyy/MM/dd')
        }
        else if (this.DateFormat == 'MM/dd/yyyy') {
            return this.datePipe.transform(datas, 'MM/dd/yyyy')
        }
        else if (this.DateFormat == 'MM/yyyy/dd') {
            return this.datePipe.transform(datas, 'MM/yyyy/dd')
        }
        else if (this.DateFormat == 'dd-MM-yyyy') {
            return this.datePipe.transform(datas, 'dd-MM-yyyy')
        } else {
            return this.datePipe.transform(datas, 'dd/MM/yyyy')
        }
    }

    setTimeFormat(date: any) {
        this.TimeFormat = date;
    }

    TimeFormat: any;
    public Timeformat(time: string) {
        if (this.TimeFormat == 'HH:mm:ss') {
            return this.datePipe.transform(time, 'HH:mm:ss')
        }
        else if (this.TimeFormat == 'HH:mm') {
            return this.datePipe.transform(time, 'HH:mm')
        }
        else if (this.TimeFormat == 'h:mm') {
            return this.datePipe.transform(time, 'h:mm')
        }
        else if (this.TimeFormat == 'h:mm:tt') {
            return this.datePipe.transform(time, 'h:mm:tt')
        }
        else if (this.TimeFormat == 'hh:mm:tt') {
            return this.datePipe.transform(time, 'hh:mm:tt')
        } else {
            return this.datePipe.transform(time, 'HH:mm:ss')
        }
    }

    setCurrentUser(userData: any) {
        localStorage.setItem(this.userKey, JSON.stringify(userData));
    }

    SetRestaurantName(value?: any) {
        this.TitleName = value;
        return;
    }

    getCurrentUser() { }

    getToken(): string | null {
        let currentUser: any = localStorage.getItem(this.userKey);
        if (!currentUser) return null;

        currentUser = JSON.parse(currentUser);
        const token = currentUser['token'];

        return token;
    }

    
    setUserLimitCrossed(UserLimit: any) {
        localStorage.setItem(btoa("UserLimit"), btoa(UserLimit));
    }
    getUserLimitCrossed() {
        let un = localStorage.getItem(btoa("UserLimit"));
        un = un === null ? un : atob(un);
        return un;
    }

    setShowWarning(WarningMessage: any) {
        localStorage.setItem(btoa("WarningMessage"), btoa(WarningMessage));
    }
    getShowWarning() {
        let un = localStorage.getItem(btoa("WarningMessage"));
        un = un === null ? un : atob(un);
        return un;
    }

    setShowInfo(ShowInfo: any) {
        localStorage.setItem(btoa("ShowInfo"), btoa(ShowInfo));
    }
    getShowInfo() {
        let un = localStorage.getItem(btoa("ShowInfo"));
        un = un === null ? un : atob(un);
        return un;
    }

    setUuid(Uuid: any) {
        localStorage.setItem(btoa("Uuid"), btoa(Uuid));
    }
    getUuid() {
        let un = localStorage.getItem(btoa("Uuid"));
        un = un === null ? un : atob(un);
        return un;
    }

    setUserName(UserName: any) {
        localStorage.setItem(btoa("UserName"), btoa(UserName));
    }
    getUserName() {
        let un = localStorage.getItem(btoa("UserName"));
        un = un === null ? un : atob(un);
        return un;
    }

    setRoleName(RoleName: any) {
        localStorage.setItem(btoa("RoleName"), btoa(RoleName));
    }
    getRoleName() {
        let un = localStorage.getItem(btoa("RoleName"));
        un = un === null ? un : atob(un);
        return un;
    }

    getPermission() {
        let un = localStorage.getItem(btoa("Permission"));
        un = un === null ? un : atob(un);
        let ts = un ? JSON.parse(un) : []
        return ts;
    }

    getSkinIdList() {
        let un = localStorage.getItem(btoa("SkinIdList"));
        un = un === null ? un : atob(un);
        let ts = un ? JSON.parse(un) : []
        return ts;
    }


    /**
     * Logout the current session
     */
    logout() {
        localStorage.clear();
    }

}