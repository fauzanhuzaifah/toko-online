// data/products.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Kaos Polos Premium",
    price: 150000,
    description: "Kaos katun combed 30s yang nyaman dan adem.",
    image: "https://placehold.co/400x400/EEE/31343C",
  },
  {
    id: 2,
    name: "Celana Chino Slim",
    price: 350000,
    description: "Celana chino bahan premium, cocok untuk kerja atau hangout.",
    image: "https://placehold.co/400x400/EEE/31343C",
  },
  {
    id: 3,
    name: "Sneakers Putih Klasik",
    price: 500000,
    description: "Sepatu sneakers putih yang cocok dipadukan dengan baju apapun.",
    image: "https://placehold.co/400x400/EEE/31343C",
  },
  {
    id: 4,
    name: "Hoodie Zipper Dark",
    price: 275000,
    description: "Hoodie tebal bahan fleece, hangat untuk malam hari.",
    image: "https://placehold.co/400x400/EEE/31343C",
  },
];