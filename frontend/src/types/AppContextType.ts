export interface User {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  foto_perfil: string | null;
  is_admin: boolean;
}

export interface Obra {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  imagen_url: string;
  enlace?: string; // publicación original (p. ej. reel de Instagram)
  likes_count?: number;
  is_liked?: boolean;
}

export interface Resena {
  id: number;
  usuario_id: number;
  usuario: string;
  estrellas: number;
  comentario: string;
  fecha: string;
}

export interface Cita {
  id: number;
  idea: string;
  fecha_cita: string;
  estado: string;
  usuario?: {
    nombre: string;
    email: string;
    telefono: string;
  };
}
