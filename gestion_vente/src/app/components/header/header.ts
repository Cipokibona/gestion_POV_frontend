import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Service } from '../../services/service';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {

  logo: string = 'assets/icons/favicon.ico';

  userData!: any;

  isAuthenticate!: any;

  constructor(private service: Service) {}

  ngOnInit() {
    this.service.getUser().subscribe({
      next: user => {
        this.userData = user;
        this.isAuthenticate = true;
        console.log('User connecté:', this.userData);
      },
      error: err => console.error('Erreur:', err)
    });
  }

  logout() {
    this.service.logout();
  }
}
