import { v4 as uuidv4 } from "uuid";
import { db } from ".";
import { categories, products } from "./schema";

async function seed() {
  // Categorias
  const categoryData = [
    { id: uuidv4(), name: "Notebooks", slug: "notebooks" },
    { id: uuidv4(), name: "Smartphones", slug: "smartphones" },
    { id: uuidv4(), name: "Fones de Ouvido", slug: "fones-de-ouvido" },
    { id: uuidv4(), name: "Roupas", slug: "roupas" },
    { id: uuidv4(), name: "Sapatos", slug: "sapatos" },
    { id: uuidv4(), name: "Acessórios", slug: "acessorios" },
    { id: uuidv4(), name: "Casa & Cozinha", slug: "casa-cozinha" },
  ];
  await db.insert(categories).values(categoryData);

  const productData = [
    {
      id: uuidv4(),
      name: "Asus Vivobook 15",
      slug: "asus-vivobook-15",
      description:
        "Notebook Asus Vivobook 15, Intel Core i5-1334U, 16 GB RAM, SSD 512 GB.",
      price: "529.99",
      stock: 10,
      category_id: categoryData[0].id,
      image_url:
        "https://www.amazon.com/ASUS-Vivobook-i5-1334U-Champagne-F1504VA-AB56-PK/dp/B0DW1SK6P5",
    },
    {
      id: uuidv4(),
      name: "Apple iPhone 14",
      slug: "apple-iphone-14",
      description:
        "Smartphone Apple iPhone 14 com tela Super Retina XDR de 6.1″ e A15 Bionic.",
      price: "799.00",
      stock: 15,
      category_id: categoryData[1].id,
      image_url: "https://support.apple.com/en-us/111850",
    },
    {
      id: uuidv4(),
      name: "Apple iPhone 14 Plus",
      slug: "apple-iphone-14-plus",
      description:
        "iPhone 14 Plus com tela de 6.7″, sistema dual-câmera e longa duração de bateria.",
      price: "899.00",
      stock: 12,
      category_id: categoryData[1].id,
      image_url: "https://www.cellularsales.com/products/apple-iphone-14-plus/",
    },
    {
      id: uuidv4(),
      name: "Fone Sony WH-1000XM5",
      slug: "sony-wh-1000xm5",
      description:
        "Fones de ouvido com cancelamento de ruído líder da indústria, Bluetooth.",
      price: "299.99",
      stock: 20,
      category_id: categoryData[2].id,
      image_url:
        "https://m.media-amazon.com/images/I/61dIwI+g8NL._AC_SL1500_.jpg",
    },
    {
      id: uuidv4(),
      name: "Fone JBL Tune 510BT",
      slug: "jbl-tune-510bt",
      description: "Fones JBL Bluetooth, graves potentes e até 40h de bateria.",
      price: "49.99",
      stock: 30,
      category_id: categoryData[2].id,
      image_url:
        "https://m.media-amazon.com/images/I/61U4FzcdQFL._AC_SL1500_.jpg",
    },
    {
      id: uuidv4(),
      name: "Camiseta Básica Preta",
      slug: "camiseta-basica-preta",
      description: "Camiseta básica preta, 100% algodão, unissex.",
      price: "19.90",
      stock: 50,
      category_id: categoryData[3].id,
      image_url: "https://example.com/images/camiseta-preta.jpg",
    },
    {
      id: uuidv4(),
      name: "Calça Jeans Azul",
      slug: "calca-jeans-azul",
      description: "Calça jeans azul escuro, modelagem reta, algodão stretch.",
      price: "89.90",
      stock: 25,
      category_id: categoryData[3].id,
      image_url: "https://example.com/images/calca-jeans.jpg",
    },
    {
      id: uuidv4(),
      name: "Tênis Adidas Ultraboost",
      slug: "tenis-adidas-ultraboost",
      description:
        "Tênis Adidas Ultraboost, corrida, amortecimento responsivo.",
      price: "179.90",
      stock: 18,
      category_id: categoryData[4].id,
      image_url: "https://example.com/images/adidas-ultraboost.jpg",
    },
    {
      id: uuidv4(),
      name: "Tênis Nike Air Force 1",
      slug: "nike-air-force-1",
      description:
        "Clássico sneaker Nike Air Force 1, sola Air e design atemporal.",
      price: "99.90",
      stock: 22,
      category_id: categoryData[4].id,
      image_url: "https://example.com/images/nike-air-force-1.jpg",
    },
    {
      id: uuidv4(),
      name: "Relógio Casio Vintage",
      slug: "relogio-casio-vintage",
      description: "Relógio digital Casio estilo vintage, resistente à água.",
      price: "39.90",
      stock: 40,
      category_id: categoryData[5].id,
      image_url: "https://example.com/images/casio-vintage.jpg",
    },
    {
      id: uuidv4(),
      name: "Óculos Ray-Ban Aviator",
      slug: "oculos-rayban-aviator",
      description: "Óculos de sol Ray-Ban Aviator, lentes polarizadas.",
      price: "149.90",
      stock: 15,
      category_id: categoryData[5].id,
      image_url: "https://example.com/images/rayban-aviator.jpg",
    },
    {
      id: uuidv4(),
      name: "Conjunto de Panelas 5 Peças",
      slug: "conjunto-panelas-5-pecas",
      description: "Kit de panelas antiaderentes, 5 peças, alumínio revestido.",
      price: "129.90",
      stock: 10,
      category_id: categoryData[6].id,
      image_url: "https://example.com/images/panelas-5-pecas.jpg",
    },
    {
      id: uuidv4(),
      name: "Aspirador Robô 2000Pa",
      slug: "aspirador-robo-2000pa",
      description: "Aspirador robô 2000Pa, autonomia 120min, controle remoto.",
      price: "199.90",
      stock: 8,
      category_id: categoryData[6].id,
      image_url: "https://example.com/images/aspirador-robo.jpg",
    },
    {
      id: uuidv4(),
      name: "Cafeteira Elétrica 800W",
      slug: "cafeteira-eletrica-800w",
      description: "Cafeteira elétrica 800 W, 10 xícaras, automático.",
      price: "69.90",
      stock: 16,
      category_id: categoryData[6].id,
      image_url: "https://example.com/images/cafeteira.jpg",
    },
  ];

  await db.insert(products).values(productData);

  console.log("Seed feito com sucesso!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
