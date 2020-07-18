import { NgModule } from '@angular/core';

import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';


@NgModule({
  declarations: [CoreComponent],
  imports: [,
    CoreRoutingModule
  ],
  exports: [CoreComponent]
})
export class CoreModule { }
