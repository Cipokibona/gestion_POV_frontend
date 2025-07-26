import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Service } from '../../../services/service';

@Component({
  selector: 'app-list-pov',
  imports: [RouterLink, CommonModule],
  templateUrl: './list-pov.html',
  styleUrl: './list-pov.scss'
})
export class ListPov implements OnInit {

  povs: any[] = [];
  loadingPage!: boolean;
  errorPage!: string | null;

  constructor(
    private service: Service
  ) {}

  ngOnInit(): void {
    this.loadPov();
  }

  loadPov() {
    this.service.getAllPov().subscribe({
      next: povs => {
        this.povs = povs;
        this.loadingPage = false;
        this.errorPage = null;
        console.log('Points de vente chargés:', povs);
      },
      error: err => {
        this.loadingPage = false;
        this.errorPage = 'Erreur lors du chargement des points de vente';
        console.error('Erreur lors du chargement des points de vente:', err);
      }
    });
  }
}
