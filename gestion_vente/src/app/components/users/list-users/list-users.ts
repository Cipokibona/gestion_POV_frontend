import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Service } from '../../../services/service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-users',
  imports: [RouterLink, CommonModule],
  templateUrl: './list-users.html',
  styleUrl: './list-users.scss'
})
export class ListUsers implements OnInit {

  users: any[] = [];
  loadingPage!: boolean;
  errorPage!: string | null;

  constructor(private service: Service) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loadingPage = true;
    this.service.getAllUser().subscribe({
      next: users => {
        this.users = users;
        this.loadingPage = false;
        this.errorPage = null;
        console.log('Utilisateurs chargés:', this.users);
      },
      error: err => {
        this.loadingPage = false;
        this.errorPage = 'Erreur lors du chargement des utilisateurs';
        console.error('Erreur lors du chargement des utilisateurs:', err);
      }
    });
  }

  deleteUser(userId: number) {
    this.service.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
        console.log('Utilisateur supprimé avec succès');
      },
      error: err => console.error('Erreur lors de la suppression de l\'utilisateur:', err)
    });
  }

}
