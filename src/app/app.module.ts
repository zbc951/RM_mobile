//Modules
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
//Feature Modules
import { QRCodeModule } from 'angular2-qrcode';
import { ClipboardModule } from 'ngx-clipboard';
import { ScrollToModule } from 'ng2-scroll-to';

//Service
import { ApiService, MemberService, LanguageService, AuthGuard, LoadingService ,footerService , MarketService} from 'service';
import { CashPageService } from './cash/cash-page.service';
//Common Component
import { AppComponent } from './app.component';
import { LoginComponent } from './_login/login.component';
import { FooterComponent } from './_footer/footer.component';
//Main Component (footer)
import { MarketComponent } from './market/market.component';
import { DetailComponent } from './detail/detail.component';
import { HistoryComponent } from './history/history.component';
import { OptionsComponent } from './options/options.component'
//Main Component (options)
import { HandicapComponent } from './market/handicap/handicap.component';
import { BillboardComponent } from './billboard/billboard.component';
import { BoxSourceComponent } from './boxsource/boxsource.component';
import { PromoteComponent } from './promote/promote.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ModifyComponent } from './modify/modify.component';
import { CashComponent } from './cash/cash.component';
import { ManualComponent } from './manual/manual.component';
//Dialog Component
import { MarketSortComponent } from './market/m-sort/m-sort.component'
import { BetComponent } from './market/handicap/bet/bet.component';
import { BattleRecordComponent } from "./market/handicap/b-record/b-record.component";
import { HistoryDetailComponent } from './history/h-detail/h-detail.component';
import { DepositComponent } from './cash/deposit/deposit.component';
import { SerialComponent } from './cash/deposit/serial/serial.component';
import { UnionpayComponent } from './cash/deposit/unionpay/unionpay.component';
import { WithdrawComponent } from './cash/withdraw/withdraw.component'
import { RecordComponent } from './cash/record/record.component';
import { betRecordComponent } from './cash/betrecord/betrecord.component';
import { BankCardComponent } from './cash/bankcard/bankcard.component';
import { ManualTWComponent } from "./manual/manual.component";
import { ManualCNComponent } from "./manual/manual.component";
import { ManualENComponent } from "./manual/manual.component";

import { AddhomeIComponent } from "./addhome/addhome.component";
import { AddhomeAomponent } from "./addhome/addhome.component";

import { HomepageComponent } from './homepage/homepage.component';
import { AddhomeComponent } from './addhome/addhome.component';
import { ActivityComponent } from './activity/activity.component';
import { HistoricalBattleRecordComponent } from './BattleRecord/BattleRecord.component';
import { HelpCenterComponent } from './HelpCenter/HelpCenter.component';
import { enactmentComponent } from './enactment/enactment.component';
//Pipes
import { langChartPipe, sortMarketListPipe, sortHandicapPipe, formatNumberPipe, sortDetailListPipe,
   calcDetailTotPipe,last4Pipe,DonutPipe,DateFilteripe,KeysPipe,RandomTeamPipe,timetosPipe ,titlePipe} from './app.pipes';

@NgModule({
  imports: [
    BrowserModule, HttpModule, FormsModule, AppRoutingModule, BrowserAnimationsModule,
    QRCodeModule, ClipboardModule ,ScrollToModule.forRoot()
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent, LoginComponent, FooterComponent,
    MarketComponent, DetailComponent, HistoryComponent, OptionsComponent, HandicapComponent,HomepageComponent,AddhomeComponent,
    ActivityComponent,HistoricalBattleRecordComponent,HelpCenterComponent,enactmentComponent,
    BillboardComponent, BoxSourceComponent, PromoteComponent,
    FeedbackComponent, ModifyComponent, CashComponent, ManualComponent,

    MarketSortComponent, BetComponent, HistoryDetailComponent, BattleRecordComponent,
    DepositComponent, WithdrawComponent, RecordComponent, BankCardComponent, ManualTWComponent, ManualCNComponent, ManualENComponent,
    SerialComponent,UnionpayComponent,AddhomeIComponent,AddhomeAomponent,betRecordComponent,

    langChartPipe, sortMarketListPipe, sortHandicapPipe, formatNumberPipe, sortDetailListPipe, calcDetailTotPipe,
    last4Pipe,DonutPipe,DateFilteripe,KeysPipe,RandomTeamPipe,timetosPipe,titlePipe
  ],
  providers: [
    ApiService, MemberService, LanguageService, AuthGuard, LoadingService,footerService,MarketService,

    CashPageService
  ],
})
export class AppModule { }
