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
  likes_count?: number;
  is_liked?: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
}

export interface Post {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string;
  imagen_url: string;
  fecha: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

export interface Resena {
  id: number;
  usuario_id: number;
  usuario: string;
  estrellas: number;
  comentario: string;
  fecha: string;
}

export interface Comentario {
  id: number;
  post_id: number;
  usuario_id: number;
  usuario: string;
  contenido: string;
  fecha: string;
}

export interface ItemPedido {
  id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  imagen_url: string;
}

export interface Pedido {
  id: number;
  fecha: string;
  total: number;
  metodo_pago: string;
  items: ItemPedido[];
  usuario: {
    nombre: string;
    email: string;
  };
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