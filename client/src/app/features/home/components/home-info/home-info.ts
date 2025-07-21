import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { TabInfo } from './tabInfo.interface';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-home-info',
  standalone: true,
  imports: [NgClass, RouterLinkWithHref],
  templateUrl: './home-info.html',
  styleUrls: ['./home-info.css']
})
export class HomeInfo {

  activeTab = signal<number>(0);

  setTab(tabNumber: number): void {
    if (this.activeTab() === tabNumber) {
      this.activeTab.set(0);
    } else {
      this.activeTab.set(tabNumber);
    }
  }

  getTabLabel(tabId: number): string {
    const labels: Record<number, string> = {
      1: '🔍 ¿Cómo funciona?',
      2: '🛠 Servicios disponibles',
      3: '🕒 Flexibilidad laboral',
      4: '🌟 Calificaciones',
      5: '🤝 Seguridad',
      6: '💬 Conexión directa'
    };
    return labels[tabId] || '';
  }

  public tabInfo: TabInfo[] = [
    {
      id: 1,
      title: '¿Cómo funciona Jobby?',
      content: 'Jobby conecta a personas que necesitan cubrir tareas específicas con trabajadores independientes calificados.Puedes publicar una tarea o encontrar trabajos según tus habilidades y ubicación, sin contratos formales ni procesos largos.'
    },
    {
      id: 2,
      title: 'Servicios disponibles',
      content: 'Desde tareas en el hogar como jardinería, pintura o limpieza, hasta turnos en cafeterías o apoyo con el cuidado de niños. Jobby cubre una amplia gama de tareas cotidianas.'
    },
    {
      id: 3,
      title: 'Flexibilidad laboral',
      content: 'Los trabajadores pueden elegir tareas según su disponibilidad, intereses y habilidades. Ideal para quienes estudian o tienen otro trabajo y desean ingresos adicionales sin un horario fijo.'
    },
    {
      id: 4,
      title: 'Sistema de calificaciones',
      content: 'Después de cada tarea, ambas partes pueden dejar una reseña. Esto fomenta la confianza y permite tomar decisiones informadas al elegir con quién trabajar.'
    },
    {
      id: 5,
      title: 'Seguridad y confianza',
      content: 'Con perfiles detallados, historial de trabajos y sistema de comentarios, Jobby garantiza una experiencia segura y transparente para clientes y trabajadores.'
    },
    { id: 6,
      title: 'Conexión directa',
      content: 'Negocia directamente condiciones, horarios y detalles. La plataforma actúa como intermediario tecnológico, sin interferir en acuerdos ni asumir responsabilidades laborales.'
    }
  ]
}