import { Injectable } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services";
// import { AuthService } from "@core/services";

@Injectable()
export class AuthGuard implements CanActivate {

    public policyId: any;
    public syncId: any;
    constructor(
        private router: Router,
        private authService: AuthService,
        private activeRoute: ActivatedRoute
    ) { 
    }

    canActivate(route: any, state: RouterStateSnapshot): boolean {
        const token = this.authService.getToken();
        if (!token) {
            this.router.navigate(['/signin']);
            return false;
        }

        if (state.url) {
            let policy = state.url.split('add/');
            this.policyId = Number(policy[1]);

            let sync = state.url.split('edit/');
            this.syncId = Number(sync[1]);
        }
        if (state.url === "/settings"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/settings/common"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/create-alerts"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/create-survey"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/publisher-list"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/message"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/device"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/policies"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/emergency"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/reports"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/domains"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/synchronizations"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/organization"){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === "/approval"){
            this.router.navigate(['/dashboard']);
            return false;
        } 
        else if (state.url === `/policies/add/${this.policyId}`){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === `/synchronizations/add`){
            this.router.navigate(['/dashboard']);
            return false;
        } else if (state.url === `/synchronizations/edit/${this.syncId}`){
            this.router.navigate(['/dashboard']);
            return false;
        } 
        
       
       
        return true;
    }

}