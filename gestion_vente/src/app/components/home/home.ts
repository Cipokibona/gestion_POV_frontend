import { Agent } from './agent/agent';
import { Component, OnInit } from '@angular/core';
import { Service } from '../../services/service';
import { Responsable } from './responsable/responsable';
import { Gerant } from './gerant/gerant';

@Component({
  selector: 'app-home',
  imports: [Responsable, Gerant, Agent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  userData: any;

  constructor(private service: Service) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.service.getUser().subscribe({
      next: user => {
        this.userData = user;
        console.log('User récupéré:', this.userData);
      },
      error: err => console.error('Erreur lors de la récupération de l\'utilisateur:', err)
    });
  }
}
