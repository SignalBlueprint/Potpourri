// =============================================================================
// Mock Product Data
// 30+ products with categories, prices, and metadata for catalog development
// =============================================================================

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  imageUrl: string | null
  isNew: boolean
  isFeatured: boolean
  stock: StockStatus
  createdAt: Date
}

export const categories = [
  'Home Decor',
  'Kitchen & Dining',
  'Garden & Outdoor',
  'Seasonal',
  'Gift Sets',
  'Bath & Body',
  'Stationery',
  'Accessories',
] as const

export type Category = (typeof categories)[number]

export const categoryIcons: Record<Category, string> = {
  'Home Decor': '🏠',
  'Kitchen & Dining': '🍽️',
  'Garden & Outdoor': '🌿',
  Seasonal: '🎄',
  'Gift Sets': '🎁',
  'Bath & Body': '🛁',
  Stationery: '📝',
  Accessories: '✨',
}

// Generate consistent placeholder image URLs
const getPlaceholderImage = (id: string): string => {
  const colors = ['d4a59a', '7c6a5d', 'e8e4df', 'a8d5ba', 'f5d6ba', 'c4b8d1']
  const colorIndex = parseInt(id, 10) % colors.length
  return `https://placehold.co/400x400/${colors[colorIndex]}/white?text=Product+${id}`
}

export const mockProducts: Product[] = [
  // Home Decor (8 items)
  {
    id: '1',
    name: 'Artisan Candle Set',
    category: 'Home Decor',
    price: 34.99,
    description: 'Hand-poured soy candles in three seasonal scents',
    imageUrl: getPlaceholderImage('1'),
    isNew: true,
    isFeatured: true,
    stock: 'in_stock',
    createdAt: new Date('2024-12-15'),
  },
  {
    id: '2',
    name: 'Ceramic Planter',
    category: 'Home Decor',
    price: 28.0,
    description: 'Minimalist ceramic planter with drainage tray',
    imageUrl: getPlaceholderImage('2'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-11-20'),
  },
  {
    id: '3',
    name: 'Woven Wall Hanging',
    category: 'Home Decor',
    price: 65.0,
    description: 'Handcrafted macramé wall art in natural cotton',
    imageUrl: getPlaceholderImage('3'),
    isNew: true,
    isFeatured: true,
    stock: 'low_stock',
    createdAt: new Date('2024-12-20'),
  },
  {
    id: '4',
    name: 'Linen Throw Pillow',
    category: 'Home Decor',
    price: 42.0,
    description: 'Stone-washed linen pillow cover with hidden zipper',
    imageUrl: getPlaceholderImage('4'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-10-05'),
  },
  {
    id: '5',
    name: 'Brass Photo Frame',
    category: 'Home Decor',
    price: 38.0,
    description: 'Vintage-inspired brass frame for 5x7 photos',
    imageUrl: getPlaceholderImage('5'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-09-12'),
  },
  {
    id: '6',
    name: 'Terracotta Vase',
    category: 'Home Decor',
    price: 45.0,
    description: 'Hand-shaped terracotta vase with matte finish',
    imageUrl: getPlaceholderImage('6'),
    isNew: true,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-12-18'),
  },
  {
    id: '7',
    name: 'Cozy Knit Blanket',
    category: 'Home Decor',
    price: 89.0,
    description: 'Chunky knit throw blanket in oatmeal',
    imageUrl: getPlaceholderImage('7'),
    isNew: false,
    isFeatured: true,
    stock: 'low_stock',
    createdAt: new Date('2024-11-01'),
  },
  {
    id: '8',
    name: 'Geometric Bookends',
    category: 'Home Decor',
    price: 52.0,
    description: 'Marble and brass geometric bookend set',
    imageUrl: getPlaceholderImage('8'),
    isNew: false,
    isFeatured: false,
    stock: 'out_of_stock',
    createdAt: new Date('2024-08-22'),
  },

  // Kitchen & Dining (6 items)
  {
    id: '9',
    name: 'Linen Tea Towels',
    category: 'Kitchen & Dining',
    price: 22.5,
    description: 'Set of 3 organic linen tea towels',
    imageUrl: getPlaceholderImage('9'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-10-15'),
  },
  {
    id: '10',
    name: 'Olive Wood Serving Board',
    category: 'Kitchen & Dining',
    price: 58.0,
    description: 'Handcrafted olive wood cutting and serving board',
    imageUrl: getPlaceholderImage('10'),
    isNew: true,
    isFeatured: true,
    stock: 'low_stock',
    createdAt: new Date('2024-12-10'),
  },
  {
    id: '11',
    name: 'Stoneware Mug Set',
    category: 'Kitchen & Dining',
    price: 36.0,
    description: 'Set of 4 speckled stoneware mugs',
    imageUrl: getPlaceholderImage('11'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-09-28'),
  },
  {
    id: '12',
    name: 'Copper Measuring Cups',
    category: 'Kitchen & Dining',
    price: 44.0,
    description: 'Rose gold measuring cup set with leather loop',
    imageUrl: getPlaceholderImage('12'),
    isNew: true,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-12-05'),
  },
  {
    id: '13',
    name: 'Ceramic Spoon Rest',
    category: 'Kitchen & Dining',
    price: 18.0,
    description: 'Handmade ceramic spoon rest in sage green',
    imageUrl: getPlaceholderImage('13'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-07-14'),
  },
  {
    id: '14',
    name: 'Woven Placemats',
    category: 'Kitchen & Dining',
    price: 32.0,
    description: 'Set of 4 natural jute placemats',
    imageUrl: getPlaceholderImage('14'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-08-30'),
  },

  // Garden & Outdoor (5 items)
  {
    id: '15',
    name: 'Seasonal Wreath',
    category: 'Garden & Outdoor',
    price: 45.0,
    description: 'Fresh eucalyptus and dried flower wreath',
    imageUrl: getPlaceholderImage('15'),
    isNew: true,
    isFeatured: true,
    stock: 'low_stock',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: '16',
    name: 'Herb Garden Kit',
    category: 'Garden & Outdoor',
    price: 35.0,
    description: 'Indoor herb growing kit with 6 seed varieties',
    imageUrl: getPlaceholderImage('16'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-10-20'),
  },
  {
    id: '17',
    name: 'Garden Tool Set',
    category: 'Garden & Outdoor',
    price: 48.0,
    description: 'Copper-plated 3-piece garden tool set',
    imageUrl: getPlaceholderImage('17'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-09-05'),
  },
  {
    id: '18',
    name: 'Hanging Planter',
    category: 'Garden & Outdoor',
    price: 29.0,
    description: 'Macramé hanging planter with ceramic pot',
    imageUrl: getPlaceholderImage('18'),
    isNew: true,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-12-12'),
  },
  {
    id: '19',
    name: 'Birdhouse',
    category: 'Garden & Outdoor',
    price: 42.0,
    description: 'Handpainted wooden birdhouse',
    imageUrl: getPlaceholderImage('19'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-06-18'),
  },

  // Gift Sets (5 items)
  {
    id: '20',
    name: 'Curated Gift Box',
    category: 'Gift Sets',
    price: 65.0,
    description: 'Handpicked selection of artisan goods',
    imageUrl: getPlaceholderImage('20'),
    isNew: false,
    isFeatured: true,
    stock: 'in_stock',
    createdAt: new Date('2024-11-15'),
  },
  {
    id: '21',
    name: 'Spa Day Set',
    category: 'Gift Sets',
    price: 78.0,
    description: 'Lavender bath salts, candle, and robe',
    imageUrl: getPlaceholderImage('21'),
    isNew: true,
    isFeatured: true,
    stock: 'low_stock',
    createdAt: new Date('2024-12-22'),
  },
  {
    id: '22',
    name: 'Coffee Lover Bundle',
    category: 'Gift Sets',
    price: 55.0,
    description: 'Artisan coffee, mug, and biscotti set',
    imageUrl: getPlaceholderImage('22'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-10-08'),
  },
  {
    id: '23',
    name: 'Cozy Night In',
    category: 'Gift Sets',
    price: 85.0,
    description: 'Blanket, candle, and hot cocoa gift set',
    imageUrl: getPlaceholderImage('23'),
    isNew: true,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-12-08'),
  },
  {
    id: '24',
    name: 'New Home Gift Set',
    category: 'Gift Sets',
    price: 95.0,
    description: 'Housewarming essentials in a keepsake box',
    imageUrl: getPlaceholderImage('24'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-09-20'),
  },

  // Bath & Body (4 items)
  {
    id: '25',
    name: 'Lavender Bath Salts',
    category: 'Bath & Body',
    price: 24.0,
    description: 'Relaxing lavender and epsom salt blend',
    imageUrl: getPlaceholderImage('25'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-08-12'),
  },
  {
    id: '26',
    name: 'Artisan Soap Set',
    category: 'Bath & Body',
    price: 28.0,
    description: 'Set of 3 handmade botanical soaps',
    imageUrl: getPlaceholderImage('26'),
    isNew: true,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-12-14'),
  },
  {
    id: '27',
    name: 'Body Oil',
    category: 'Bath & Body',
    price: 32.0,
    description: 'Nourishing rose and jojoba body oil',
    imageUrl: getPlaceholderImage('27'),
    isNew: false,
    isFeatured: false,
    stock: 'low_stock',
    createdAt: new Date('2024-10-25'),
  },
  {
    id: '28',
    name: 'Lip Balm Trio',
    category: 'Bath & Body',
    price: 16.0,
    description: 'Organic lip balms in honey, mint, and rose',
    imageUrl: getPlaceholderImage('28'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-07-30'),
  },

  // Seasonal (3 items)
  {
    id: '29',
    name: 'Holiday Ornament Set',
    category: 'Seasonal',
    price: 38.0,
    description: 'Set of 6 handblown glass ornaments',
    imageUrl: getPlaceholderImage('29'),
    isNew: true,
    isFeatured: true,
    stock: 'low_stock',
    createdAt: new Date('2024-11-28'),
  },
  {
    id: '30',
    name: 'Advent Calendar',
    category: 'Seasonal',
    price: 68.0,
    description: 'Wooden advent calendar with 24 treats',
    imageUrl: getPlaceholderImage('30'),
    isNew: true,
    isFeatured: false,
    stock: 'out_of_stock',
    createdAt: new Date('2024-11-05'),
  },
  {
    id: '31',
    name: 'Winter Garland',
    category: 'Seasonal',
    price: 55.0,
    description: 'Dried eucalyptus and berry garland',
    imageUrl: getPlaceholderImage('31'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-10-30'),
  },

  // Stationery (3 items)
  {
    id: '32',
    name: 'Leather Journal',
    category: 'Stationery',
    price: 45.0,
    description: 'Hand-bound leather journal with cotton pages',
    imageUrl: getPlaceholderImage('32'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-09-15'),
  },
  {
    id: '33',
    name: 'Wax Seal Kit',
    category: 'Stationery',
    price: 34.0,
    description: 'Brass seal stamp with sealing wax sticks',
    imageUrl: getPlaceholderImage('33'),
    isNew: true,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-12-16'),
  },
  {
    id: '34',
    name: 'Greeting Card Set',
    category: 'Stationery',
    price: 22.0,
    description: 'Set of 12 letterpress greeting cards',
    imageUrl: getPlaceholderImage('34'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-08-05'),
  },

  // Accessories (2 items)
  {
    id: '35',
    name: 'Handwoven Basket',
    category: 'Accessories',
    price: 38.0,
    description: 'Natural seagrass storage basket',
    imageUrl: getPlaceholderImage('35'),
    isNew: false,
    isFeatured: false,
    stock: 'in_stock',
    createdAt: new Date('2024-10-12'),
  },
  {
    id: '36',
    name: 'Silk Scarf',
    category: 'Accessories',
    price: 58.0,
    description: 'Hand-dyed silk scarf in botanical print',
    imageUrl: getPlaceholderImage('36'),
    isNew: true,
    isFeatured: true,
    stock: 'low_stock',
    createdAt: new Date('2024-12-19'),
  },
]

// Sort options
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc'

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
]

// Utility functions
export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted
  }
}

export function filterProducts(
  products: Product[],
  { search, category }: { search: string; category: string | null }
): Product[] {
  return products.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = !category || product.category === category

    return matchesSearch && matchesCategory
  })
}
