import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Service } from '../../services/service';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {

  logo: string = 'assets/icons/favicon.ico';

  userData!: any;

  isAuthenticate!: any;

  constructor(private service: Service) {}

  logout() {
    this.service.logout();
  }
}
