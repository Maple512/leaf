import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'leaf-core',
  template: `
    <p>
      core works!
    </p>
  `,
  styles: [
  ]
})
export class CoreComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}