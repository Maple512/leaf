import { NgModule } from '@angular/core';
import { MonitorComponent } from '.';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '@shared';

const COMPONENTS = [
  MonitorComponent
];

const ENTRY_COMPONENTS = [];

@NgModule({
  imports: [SharedModule, DashboardRoutingModule],
  declarations: [...COMPONENTS, ...ENTRY_COMPONENTS],
  entryComponents: [...ENTRY_COMPONENTS]
})
export class DashboardModule {

}
