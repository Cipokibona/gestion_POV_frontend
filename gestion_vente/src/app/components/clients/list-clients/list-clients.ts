import { Component, OnInit } from '@angular/core';
// import { Client } from '../../../models/client'; // Adjust the path as needed
import { Service } from '../../../services/service';
import { Router } from 'express';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-clients',
  imports: [RouterLink, CommonModule],
  templateUrl: './list-clients.html',
  styleUrl: './list-clients.scss'
})
export class ListClients implements OnInit {
  clients: any[] = [];
  isLoading = false;

  constructor(private service: Service) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading = true;
    this.service.getClients().subscribe({
      next: (data: any) => {
      this.clients = data;
      this.isLoading = false;
      console.log('Clients loaded:', this.clients);
      },
      error: (error: any) => {
      console.error('Erreur lors du chargement des clients:', error);
      this.isLoading = false;
      }
    });
  }
}
