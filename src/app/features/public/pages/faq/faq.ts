import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

interface FaqSection {
  title: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  sections: FaqSection[] = [
    {
      title: 'Cuenta y acceso',
      items: [
        {
          question: '¿Cómo puedo registrarme en la plataforma?',
          answer: 'Puedes crear una cuenta desde la opción "Registrarse" del menú principal. Solo necesitas introducir tu nombre, correo electrónico y una contraseña válida.',
          open: true
        },
        {
          question: '¿Cómo inicio sesión?',
          answer: 'Accede desde la opción "Iniciar sesión" del menú principal e introduce tu correo electrónico y contraseña.',
          open: false
        },
        {
          question: '¿Qué hago si he olvidado mi contraseña?',
          answer: 'Puedes usar la opción de recuperación de contraseña en la pantalla de inicio de sesión. El sistema enviará instrucciones de recuperación al correo electrónico asociado a tu cuenta.',
          open: false
        }
      ]
    },
    {
      title: 'Compras y pagos',
      items: [
        {
          question: '¿Cómo añado un libro al carrito?',
          answer: 'Desde el catálogo o desde la ficha de detalle de un libro puedes pulsar en "Añadir al carrito" para incorporarlo a tu pedido.',
          open: false
        },
        {
          question: '¿Puedo comprar varias veces el mismo libro?',
          answer: 'No. La plataforma está pensada para licencias digitales individuales, por lo que un mismo usuario no puede comprar varias veces el mismo libro.',
          open: false
        },
        {
          question: '¿Los pagos son reales?',
          answer: 'No. Esta aplicación funciona en modo académico y simulado. El proceso de pago imita una compra real, pero no realiza cargos económicos reales.',
          open: false
        }
      ]
    },
    {
      title: 'Biblioteca y lectura',
      items: [
        {
          question: '¿Dónde puedo ver mis libros comprados?',
          answer: 'Todos los libros adquiridos aparecen en la sección "Mi Biblioteca", accesible desde el menú una vez hayas iniciado sesión.',
          open: false
        },
        {
          question: '¿Cómo puedo leer un libro?',
          answer: 'Desde tu biblioteca puedes pulsar en "Leer" sobre cualquiera de tus libros comprados y acceder al lector digital integrado.',
          open: false
        },
        {
          question: '¿Puedo descargar los libros?',
          answer: 'No. La lectura se realiza online desde la propia plataforma y no se contempla la descarga de los contenidos digitales.',
          open: false
        }
      ]
    },
    {
      title: 'Soporte e incidencias',
      items: [
        {
          question: '¿Cómo puedo abrir una incidencia?',
          answer: 'Si has iniciado sesión, puedes acceder a la sección "Soporte" y crear una nueva incidencia indicando el asunto, el tipo de problema y un mensaje inicial.',
          open: false
        },
        {
          question: '¿Cómo consulto el estado de una incidencia?',
          answer: 'Desde la misma sección de soporte podrás ver el historial de incidencias creadas, su estado y los mensajes intercambiados.',
          open: false
        }
      ]
    }
  ];

  toggleItem(sectionIndex: number, itemIndex: number): void {
    this.sections[sectionIndex].items[itemIndex].open =
      !this.sections[sectionIndex].items[itemIndex].open;
  }
}
