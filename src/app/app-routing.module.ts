//Module
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Service
import { AuthGuard } from 'service'
//Common Component
import { LoginComponent } from './_login/login.component';
//Main Component (footer)
import { MarketComponent } from './market/market.component';
import { DetailComponent } from './detail/detail.component';
import { HistoryComponent } from './history/history.component';
import { OptionsComponent } from './options/options.component'
//Main Component (options)
import { BillboardComponent } from './billboard/billboard.component';
import { BoxSourceComponent } from './boxsource/boxsource.component';
import { PromoteComponent } from './promote/promote.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { ModifyComponent } from './modify/modify.component';
import { CashComponent } from './cash/cash.component';
import { ManualComponent } from './manual/manual.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AddhomeComponent } from './addhome/addhome.component';
import { ActivityComponent } from './activity/activity.component';
import { HistoricalBattleRecordComponent } from './BattleRecord/BattleRecord.component';
import { HelpCenterComponent } from './HelpCenter/HelpCenter.component';
import { enactmentComponent } from './enactment/enactment.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: '/homepage',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'market',
        component: MarketComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'detail',
        component: DetailComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'homepage',
        component: HomepageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'history',
        component: HistoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'cash',
        component: CashComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'boxsource',
        component: BoxSourceComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'billboard',
        component: BillboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'promote',
        component: PromoteComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'feedback',
        component: FeedbackComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'manual',
        component: ManualComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'modify',
        component: ModifyComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'options',
        component: OptionsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'addhome',
        component: AddhomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'activity',
        component: ActivityComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'HistoricalBattle/:id',
        component: HistoricalBattleRecordComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'Help',
        component: HelpCenterComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'enactment',
        component: enactmentComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
    exports: [RouterModule]
})
export class AppRoutingModule {}