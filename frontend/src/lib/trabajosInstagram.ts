// Trabajos reales de Jose Halconero, sacados de sus reels de Instagram (@josehalconero) el 20/11/2026.
// Son fotogramas del vídeo a 819×1456 px; para la web definitiva conviene pedirle las fotos originales.
import jh01 from '../assets/instagram/jh-01.jpg';
import jh02 from '../assets/instagram/jh-02.jpg';
import jh03 from '../assets/instagram/jh-03.jpg';
import jh04 from '../assets/instagram/jh-04.jpg';
import jh05 from '../assets/instagram/jh-05.jpg';
import jh06 from '../assets/instagram/jh-06.jpg';
import jh07 from '../assets/instagram/jh-07.jpg';
import jh08 from '../assets/instagram/jh-08.jpg';
import jh09 from '../assets/instagram/jh-09.jpg';

export interface Trabajo {
  src: string;
  titulo: string;
  zona: string;
  reel: string; // enlace a la publicación original
}

const IG = 'https://www.instagram.com/josehalconero/reel/';

export const TRABAJOS: Trabajo[] = [
  { src: jh05, titulo: 'Manga cofrade', zona: 'Brazo completo', reel: `${IG}Deb0AbJBLEO/` },
  { src: jh07, titulo: 'San Miguel Arcángel', zona: 'Brazo', reel: `${IG}Dd3xj9CoLMb/` },
  { src: jh01, titulo: 'Dolorosa', zona: 'Antebrazo', reel: `${IG}DfhdhqIBbbJ/` },
  { src: jh02, titulo: 'Nazareno con la cruz', zona: 'Brazo', reel: `${IG}DfR_BMvIrmk/` },
  { src: jh03, titulo: 'Escena cofrade bajo arco', zona: 'Antebrazo', reel: `${IG}De9a5UCh1HU/` },
  { src: jh04, titulo: 'Cristo coronado de espinas', zona: 'Brazo', reel: `${IG}DerRbmNoimu/` },
  { src: jh06, titulo: 'Virgen de la Aurora', zona: 'Antebrazo', reel: `${IG}DeHNmLwB6rq/` },
  { src: jh08, titulo: 'Crucificado', zona: 'Brazo', reel: `${IG}Dd1NNCDhk9C/` },
  { src: jh09, titulo: 'Dolorosa', zona: 'Antebrazo', reel: `${IG}DdoUEBEIwaV/` },
];
