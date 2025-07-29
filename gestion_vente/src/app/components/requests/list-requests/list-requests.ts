import { Component, OnInit } from '@angular/core';
import { Service } from '../../../services/service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-requests',
  imports: [CommonModule],
  templateUrl: './list-requests.html',
  styleUrl: './list-requests.scss'
})
export class ListRequests implements OnInit {
  requests: any[] = [];
  isLoading = false;
  errorPage : string | null = null;

  userData: any;

  povData: any;

  constructor(private service: Service) {}

  ngOnInit() {
    this.getUser();
  }

  loadRequests() {
    this.isLoading = true;
    this.service.getRequests().subscribe(
      (data: any[]) => {
        this.requests = data;
        this.isLoading = false;
        console.log('Demandes chargées avec succès:', this.requests);
      },
      error => {
        console.error('Erreur lors du chargement des demandes :', error);
        this.isLoading = false;
        this.errorPage = 'Erreur lors du chargement des demandes.';
      }
    );
  }



  getUser() {
    this.service.getUser().subscribe({
      next: (data) => {
        this.userData = data;
        console.log('user data trouve', this.userData);
        if(this.userData.role_display === 'agent') {
          this.service.getRequests().subscribe({
            next: (requests) => {
              this.requests = requests.filter((item:any) => item.user_id === this.userData.id);
            }
          });
        }else if(this.userData.role_display === 'responsable') {
          this.getPovByUser(this.userData.id).then((pov: any) => {
            if (!pov) {
              console.warn('Aucun point de vente trouvé');
              return;
            }
            this.service.getRequests().subscribe({
              next: (requests) => {
                this.requests = requests.filter((item: any) => item.point_de_vente === pov.id);
              }
            });
          });
        }else {
          this.loadRequests();
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement de l\'utilisateur :', error);
      }
    });
  }

  getPovByUser(user_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.service.getAllPov().subscribe({
        next: (data) => {
          this.povData = data.find((p: any) => p.responsable?.user?.id === user_id);
          if (this.povData) {
            console.log('Point de vente chargé avec succès:', this.povData);
            resolve(this.povData);
          } else {
            console.warn('Aucun point de vente trouvé pour cet utilisateur.');
            resolve(null);
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement du point de vente :', error);
          reject(error);
        }
      });
    });
  }

  // deleteRequest(requestId: string) {
  //   if (confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
  //     this.service.deleteRequest(requestId).subscribe(
  //       () => {
  //         this.requests = this.requests.filter(req => req.id !== requestId);
  //       },
  //       error => {
  //         console.error('Erreur lors de la suppression de la demande :', error);
  //       }
  //     );
  //   }
  // }
}
