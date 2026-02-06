

export interface Obra{
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  imagen_url: string;
}

export interface Producto{
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
}