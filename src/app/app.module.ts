import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Http, HttpModule, RequestOptions} from "@angular/http";
import {AuthConfig, AuthHttp} from "angular2-jwt";

import {AppComponent} from "./app.component";
import {APIService} from "./services/api.service";
import {routedComponents, Routing} from "./app.routes";
import {AuthService} from "./services/auth.service";
import {AuthGuard} from "./services/auth-guard.service";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({}), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    routedComponents
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Routing
  ],
  providers: [AuthService, APIService, AuthGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
