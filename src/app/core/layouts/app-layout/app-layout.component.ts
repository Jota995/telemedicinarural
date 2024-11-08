import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css'
})
export class AppLayoutComponent{

  constructor(){
    console.log("ejecutando logica app layout")
  }
  // ngOnInit(): void {
  //   console.log("app layout on init")
  // }

}
