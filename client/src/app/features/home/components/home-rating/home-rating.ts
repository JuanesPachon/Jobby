import { Component } from '@angular/core';
import { RatingInfo } from './ratingInfo.interface';

@Component({
    selector: 'app-home-rating',
    imports: [],
    templateUrl: './home-rating.html',
    styleUrl: './home-rating.css',
})
export class HomeRating {
    public ratingInfo: RatingInfo[] = [
        {
            id: 1,
            name: 'Martín Zapata',
            comment: '"Encontré mi primer tarea en menos de un día. Súper fácil de usar."',
            photoUrl: 'images/WebP/home_rating_1.webp',
        },
        {
            id: 2,
            name: 'Sofía Quintero',
            comment: '"Ideal para quienes necesitamos ingresos extra sin complicarnos."',
            photoUrl: 'images/WebP/home_rating_2.webp',
        },
        {
            id: 3,
            name: 'Camila Velásquez',
            comment: '"La página me ha salvado varias veces con tareas cortas cerca de casa."',
            photoUrl: 'images/WebP/home_rating_3.webp',
        },
        {
            id: 4,
            name: 'Juan Carlos Roldán',
            comment: '"Jobby me ha ayudado a diversificar mis ingresos. Muy recomendable."',
            photoUrl: 'images/WebP/home_rating_4.webp',
        },
    ];
}
