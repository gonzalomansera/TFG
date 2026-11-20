import type { Obra, Resena } from '../types/AppContextType';
import { TRABAJOS } from './trabajosInstagram';

/**
 * Trabajos reales de Jose sacados de su Instagram (ver trabajosInstagram.ts).
 * Se muestran SOLO cuando la API no devuelve ninguna obra; en cuanto se suban
 * obras desde el panel, sustituyen a estas.
 *
 * La URL se hace absoluta para que getImageUrl no le anteponga la URL del backend.
 */
export const OBRAS_INSTAGRAM: Obra[] = TRABAJOS.map((t, i) => ({
  id: -(i + 1),
  titulo: t.titulo,
  descripcion: `${t.zona}. Realismo en blanco y negro. El vídeo completo está en su Instagram.`,
  tipo: t.zona,
  imagen_url: new URL(t.src, window.location.origin).href,
  enlace: t.reel,
}));

export const DEMO_RESENAS: Resena[] = [
  { id: -1, usuario_id: 0, usuario: 'Lucía', estrellas: 5, comentario: 'Un artista de verdad. Entendió mi idea a la primera y el resultado superó lo que imaginaba.', fecha: 'Reseña de ejemplo' },
  { id: -2, usuario_id: 0, usuario: 'Marcos', estrellas: 5, comentario: 'Trato cercano, estudio impecable y una mano increíble. Volveré sin duda.', fecha: 'Reseña de ejemplo' },
  { id: -3, usuario_id: 0, usuario: 'Sara', estrellas: 5, comentario: 'Se nota el bagaje artístico detrás de cada línea. Granada tiene un tatuador de lujo.', fecha: 'Reseña de ejemplo' },
];
