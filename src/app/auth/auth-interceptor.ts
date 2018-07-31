import { HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";



// need an empty injectable so that we can put other services in
@Injectable()

// interceptor are functions that applies to any outgoing http request and manipulates them
// forces you to add an intercept method
// angular will call intercept for any request leaving the app
// works alot like a middleware
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        // create copy of that req
        const authRequest = req.clone({
            // set adds a new header, if exist, it will overwirte it
            // authorization is the same name
            headers: req.headers.set("Authorization", "Bearer " + authToken)
        });

        // proceed to the next action
        return next.handle(authRequest);
    }
}