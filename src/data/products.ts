import { Product } from '@/contexts/CartContext';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 1990,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBx9A3ZCKr0-Ng_a9x_Nb2dju7H8Rcgxtyig&s',
    description: 'Premium wireless headphones with noise cancellation and superior sound quality.',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 1000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR16fncsZwBUMhVH655s0uINvH-BlZvqHfVYQ&s',
    description: 'Advanced fitness tracking, heart rate monitoring, and smartphone connectivity.',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Coffee Maker',
    price: 3000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa6kbHf0rGjfBF9rJ1WFXKBmZ3EXn38CsXQA&s',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe.',
    category: 'Home & Kitchen'
  },
  {
    id: '4',
    name: 'Running Shoes',
    price: 3955,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTM1f3pe6ZnoL46_ajUwZzWNY7H35pjYqhIun-qoNGgcHeSAD3MT6lcwAxeTvoJMmd9U2Bj0Bx2m4RZhMytS8shXkjKfRpIaGQ0dkbWHGDrMZ3x9-K3FMcatBFUgDeuNBjH5PpENMI&usqp=CAc',
    description: 'Lightweight running shoes with advanced cushioning and breathable design.',
    category: 'Sports & Outdoors'
  },
  {
    id: '5',
    name: 'Laptop Backpack',
    price: 938,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQs02Gdr_-2viKSh9p9udieZID96b0AR5udg3cn1gQR8dfqfduS4BKGcP6MqmqvaKQV_rcMT2TfLLJ89k_2-9KPyIrjDM57A71KLGXC_mmbmodUOn0nxdZMY3eZS5F7_HIjRnRPHd9aV4g&usqp=CAc',
    description: 'Durable laptop backpack with multiple compartments and USB charging port.',
    category: 'Bags & Luggage'
  },
  {
    id: '6',
    name: 'Bluetooth Speaker',
    price: 1699,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRXAjO04cMIWNrWoC5MTdMs2JQDStxmT4ZdDiDXow7voe_R6sjm2GjDMuIVHSfcOq4sJ5jr_ks98UhDUufLOwRGLYR3dN0fwkC-l89plSdvULkvzdQONMZk-kHBob0_hiHhQ7SWUg&usqp=CAc',
    description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design.',
    category: 'Electronics'
  },
  {
    id: '7',
    name: 'Ear Buds',
    price: 1099,
    image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT8QoD0PzaNbun00-fUYZJaPgMZCrOvpsXNZTe6Z6JXUcnAMJZoTphTxZiV8MGEwkuNCr6zgAvFRw7Rsa09HCbSDHpBxHHZBM6hM4eFk4RJbFtGFrQP3puCJSg8pIgH2XZzgW1NSac&usqp=CAc',
    description: 'Premium yoga mat with excellent grip and eco-friendly materials.',
    category: 'Sports & Outdoors'
  },
  {
    id: '8',
    name: 'Desk Lamp',
    price: 999,
    image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSrZq8ntIzf7I1RsoD3LAvkEVh4OFQBcLcgMBi5OMECg7bTbGcVXykmDiY_6gobJZccyQv3B3YjqpemyT7kKJTBXnBgKPWxtukBCsMBC0d8',
    description: 'LED desk lamp with adjustable brightness and USB charging port.',
    category: 'Home & Kitchen'
  }
];

export const categories = [
  'All Categories',
  'Electronics',
  'Home & Kitchen',
  'Sports & Outdoors',
  'Bags & Luggage'
];