

export interface Obra {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  imagen_url: string;
  likes_count?: number;
  is_liked?: boolean;
}

export interface Producto{
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
}