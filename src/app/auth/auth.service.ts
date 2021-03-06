import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { AuthData } from './auth-data.model';

import { environment } from 'src/environments/environment';
const BACKEND_URL= environment.apiUrl + "/user/";

@Injectable({
    providedIn:"root"
})
export class AuthService {
    private isAuthenticated= false;
    private token: any;
    private tokenTimer:any;
    private userId:any;
    private authStatusListener= new Subject<boolean>();
  
    constructor( private http:HttpClient, private router: Router ) {}
    
    getToken () {
        return this.token;
    }

    getIsAuth () {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser (name: string, email:string, password:string ) {
        const authData:AuthData = {
            name:name,
            email:email,
            password:password
        }
        this.http.post(BACKEND_URL + "signup", authData)
            .subscribe(response => {
                console.log(response)
            })
    }

    login ( email:string, password:string ) {
        const authData:AuthData = {
            email:email,
            password:password,
            name:""
        }
        this.http.post<{token:string, expiresIn:number, userId:string}>(BACKEND_URL + "login", authData)
            .subscribe(response => {
                const token= response.token;
                this.token=token;
                if(token) {
                    const expiresInDuration= response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.userId= response.userId;
                    this.isAuthenticated=true;
                    this.authStatusListener.next(true);
                    const now= new Date();
                    const expirationDate= new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthData(token, expirationDate, this.userId)
                    this.router.navigate(['/']);
                }
            })
    }

    autoAuthUser () {
        const authInformation= this.getAuthData();
        if(!authInformation){
            return;
        }
        
        const now= new Date();
        const expiresIn= authInformation?.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.userId= authInformation.userId;
            this.isAuthenticated= true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout () {
        this.token= null;
        this.userId= null;
        this.isAuthenticated= false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);       
        this.clearAuthData();
        this.router.navigate(['/']);
    }

    private setAuthTimer (duration: number) {
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration*1000)
    }

    private saveAuthData(token: string, expirationDate:Date, userId: string) {
        // store items in local storage.
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate.toISOString());
        localStorage.setItem('userId',userId);
    }

    private clearAuthData() {
        // remove items from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userId');
    }

    private getAuthData() {
        const token= localStorage.getItem('token');
        const expirationDate= localStorage.getItem('expirationDate');
        const userId= localStorage.getItem('userId');
        
        if(!token || !expirationDate){
            return;
        }
        return {
            token:token, 
            expirationDate: new Date(expirationDate),
            userId:userId
        }
    }
}