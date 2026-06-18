// config/db.js
// MySQL database connection pool configuration with transparent file-based SQLite-like JSON fallback

const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MOCK_DB_FILE = path.join(__dirname, '..', 'stylehub_mock_db.json');

// Helper to initialize JSON DB
const initMockDB = () => {
  if (fs.existsSync(MOCK_DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(MOCK_DB_FILE, 'utf8'));
    } catch (e) {
      console.error('Error parsing mock DB file, reinitializing', e);
    }
  }

  const defaultDB = {
    users: [
      {
        id: 1,
        name: 'StyleHub Admin',
        email: 'admin@stylehub.com',
        // password for admin123
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'admin',
        phone: '9999999999',
        address: 'StyleHub HQ, Fashion Street, Mumbai',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john@example.com',
        // password: password123
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'user',
        phone: '9876543210',
        address: '123 Fashion Blvd, Apt 4B, Mumbai, Maharashtra - 400001',
        created_at: new Date().toISOString()
      }
    ],
    categories: [
      { id: 1, name: 'Men', slug: 'men', image_url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400' },
      { id: 2, name: 'Women', slug: 'women', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400' },
      { id: 3, name: 'Kids', slug: 'kids', image_url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400' },
      { id: 4, name: 'Accessories', slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
      { id: 5, name: 'Footwear', slug: 'footwear', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
      { id: 6, name: 'Sale', slug: 'sale', image_url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400' }
    ],
    products: [
      { id: 1, name: 'Classic White Oxford Shirt', description: 'Premium cotton Oxford shirt with a timeless design. Perfect for formal and semi-formal occasions.', price: 1299.00, original_price: 1999.00, category_id: 1, image_url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600', stock: 50, rating: 4.5, reviews_count: 128, tags: 'shirt,formal,men,cotton', is_featured: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 2, name: 'Slim Fit Chinos', description: 'Comfortable slim-fit chinos made from stretch cotton blend. Available in multiple colors.', price: 1599.00, original_price: 2499.00, category_id: 1, image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', stock: 35, rating: 4.3, reviews_count: 95, tags: 'chinos,pants,men,slim', is_featured: 0, is_active: 1, created_at: new Date().toISOString() },
      { id: 3, name: 'Premium Denim Jacket', description: 'Rugged yet stylish denim jacket with a vintage wash finish.', price: 2499.00, original_price: 3499.00, category_id: 1, image_url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600', stock: 20, rating: 4.7, reviews_count: 210, tags: 'jacket,denim,men,casual', is_featured: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 4, name: 'Polo T-Shirt Pack', description: 'Set of 3 premium polo t-shirts in classic colors. Breathable and comfortable.', price: 1899.00, original_price: 2799.00, category_id: 1, image_url: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600', stock: 60, rating: 4.4, reviews_count: 156, tags: 'polo,tshirt,men,casual', is_featured: 0, is_active: 1, created_at: new Date().toISOString() },
      { id: 5, name: 'Floral Maxi Dress', description: 'Elegant floral print maxi dress perfect for summer occasions and beach outings.', price: 1899.00, original_price: 2999.00, category_id: 2, image_url: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600', stock: 25, rating: 4.8, reviews_count: 302, tags: 'dress,floral,women,summer', is_featured: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 6, name: 'High-Waist Skinny Jeans', description: 'Stretch denim high-waist jeans that give a perfect silhouette. Super comfortable fit.', price: 1699.00, original_price: 2499.00, category_id: 2, image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', stock: 40, rating: 4.6, reviews_count: 187, tags: 'jeans,women,denim,casual', is_featured: 0, is_active: 1, created_at: new Date().toISOString() },
      { id: 7, name: 'Blazer & Trouser Co-ord', description: 'Professional co-ord set with structured blazer and matching straight trousers.', price: 3299.00, original_price: 4999.00, category_id: 2, image_url: 'https://images.unsplash.com/photo-1609239001074-421572b56e9d?w=600', stock: 15, rating: 4.9, reviews_count: 89, tags: 'blazer,formal,women,coordset', is_featured: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 8, name: 'Bohemian Wrap Skirt', description: 'Free-spirited bohemian wrap skirt with intricate embroidery detailing.', price: 999.00, original_price: 1599.00, category_id: 2, image_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600', stock: 30, rating: 4.2, reviews_count: 74, tags: 'skirt,boho,women,casual', is_featured: 0, is_active: 1, created_at: new Date().toISOString() },
      { id: 9, name: 'Cartoon Graphic Tee', description: 'Fun cartoon graphic t-shirt made from 100% soft cotton. Kids love it!', price: 499.00, original_price: 799.00, category_id: 3, image_url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600', stock: 80, rating: 4.6, reviews_count: 143, tags: 'tshirt,kids,casual,cartoon', is_featured: 0, is_active: 1, created_at: new Date().toISOString() },
      { id: 10, name: 'Denim Dungaree', description: 'Cute and durable denim dungaree for active kids. Adjustable straps for growing children.', price: 799.00, original_price: 1299.00, category_id: 3, image_url: 'https://images.unsplash.com/photo-1471286174890-9c112ffaa5f5?w=600', stock: 45, rating: 4.5, reviews_count: 98, tags: 'dungaree,kids,denim,cute', is_featured: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 11, name: 'Leather Belt Collection', description: 'Genuine leather belt with premium buckle. Available in brown and black.', price: 699.00, original_price: 1199.00, category_id: 4, image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', stock: 100, rating: 4.4, reviews_count: 67, tags: 'belt,leather,accessories,men', is_featured: 0, is_active: 1, created_at: new Date().toISOString() },
      { id: 12, name: 'Silk Scarf', description: 'Luxurious silk scarf with vibrant abstract print. Versatile styling accessory.', price: 899.00, original_price: 1499.00, category_id: 4, image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600', stock: 60, rating: 4.7, reviews_count: 112, tags: 'scarf,silk,women,accessories', is_featured: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 13, name: 'Aviator Sunglasses', description: 'Classic aviator sunglasses with UV400 protection and polarized lenses.', price: 1299.00, original_price: 2199.00, category_id: 4, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', stock: 55, rating: 4.5, reviews_count: 201, tags: 'sunglasses,accessories,unisex', is_featured: 0, is_active: 1, created_at: new Date().toISOString() },
      { id: 14, name: 'White Sneakers', description: 'Clean white leather sneakers with cushioned insole. Perfect everyday shoe.', price: 2499.00, original_price: 3999.00, category_id: 5, image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', stock: 30, rating: 4.8, reviews_count: 428, tags: 'sneakers,shoes,white,unisex', is_featured: 1, is_active: 1, created_at: new Date().toISOString() },
      { id: 15, name: 'Block Heel Sandals', description: 'Comfortable block heel sandals with adjustable ankle strap.', price: 1599.00, original_price: 2499.00, category_id: 2, image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4295?w=600', stock: 25, rating: 4.3, reviews_count: 86, tags: 'sandals,heels,women,footwear', is_featured: 0, is_active: 1, created_at: new Date().toISOString() },
      { id: 16, name: 'Oxford Dress Shoes', description: 'Classic Oxford dress shoes in genuine leather. Ideal for formal occasions.', price: 3499.00, original_price: 4999.00, category_id: 1, image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600', stock: 20, rating: 4.7, reviews_count: 134, tags: 'oxford,shoes,men,formal', is_featured: 1, is_active: 1, created_at: new Date().toISOString() }
    ],
    cart: [],
    orders: [],
    order_items: []
  };

  fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(defaultDB, null, 2), 'utf8');
  return defaultDB;
};

// Global mock state
let mockData = initMockDB();
let useMock = false;

const saveMockData = () => {
  fs.writeFileSync(MOCK_DB_FILE, JSON.stringify(mockData, null, 2), 'utf8');
};

// Create the actual MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'stylehub_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.warn('⚠️ MySQL connection failed. Falling back to JSON Mock Database:', err.message);
    useMock = true;
  } else {
    console.log('✅ MySQL Database connected successfully!');
    connection.release();
  }
});

// Mock Query Interpreter
const runMockQuery = (sql, params = []) => {
  const normSql = sql.replace(/\s+/g, ' ').trim();

  // 1. SELECT * FROM categories ORDER BY name ASC
  if (normSql.startsWith('SELECT * FROM categories')) {
    const sorted = [...mockData.categories].sort((a, b) => a.name.localeCompare(b.name));
    return [sorted];
  }

  // 2. Auth: Get User by Email
  if (normSql.startsWith('SELECT * FROM users WHERE email = ?')) {
    const email = params[0];
    const match = mockData.users.filter(u => u.email === email);
    return [match];
  }

  // 3. Auth: Check email exists
  if (normSql.startsWith('SELECT id FROM users WHERE email = ?')) {
    const email = params[0];
    const match = mockData.users.filter(u => u.email === email).map(u => ({ id: u.id }));
    return [match];
  }

  // 4. Auth: Get Me
  if (normSql.startsWith('SELECT id, name, email, role, phone, address, created_at FROM users WHERE id = ?')) {
    const id = Number(params[0]);
    const match = mockData.users.filter(u => u.id === id);
    return [match];
  }

  // 5. Auth: Update Profile
  if (normSql.startsWith('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?')) {
    const [name, phone, address, id] = params;
    mockData.users = mockData.users.map(u => u.id === Number(id) ? { ...u, name, phone, address } : u);
    saveMockData();
    return [{ affectedRows: 1 }];
  }

  // 6. Auth: Register User
  if (normSql.startsWith('INSERT INTO users (name, email, password, phone)')) {
    const [name, email, password, phone] = params;
    const newId = mockData.users.length > 0 ? Math.max(...mockData.users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name,
      email,
      password,
      role: 'user',
      phone: phone || null,
      address: null,
      created_at: new Date().toISOString()
    };
    mockData.users.push(newUser);
    saveMockData();
    return [{ insertId: newId }];
  }

  // 7. Products: Count total
  if (normSql.startsWith('SELECT COUNT(*) as total FROM products p')) {
    let list = mockData.products.filter(p => !!p.is_active);
    
    // search filter
    const searchIdx = normSql.indexOf('p.name LIKE ?');
    if (searchIdx !== -1 && params[0]) {
      const q = params[0].replace(/%/g, '').toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.tags && p.tags.toLowerCase().includes(q)));
    }

    // category slug filter
    if (normSql.includes('c.slug = ?')) {
      const slug = params[searchIdx !== -1 ? 3 : 0];
      const cat = mockData.categories.find(c => c.slug === slug);
      const catId = cat ? cat.id : -1;
      list = list.filter(p => p.category_id === catId);
    }

    // featured filter
    if (normSql.includes('p.is_featured = TRUE')) {
      list = list.filter(p => !!p.is_featured);
    }

    return [[{ total: list.length }]];
  }

  // 8. Products: Get lists
  if (normSql.startsWith('SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p')) {
    let list = mockData.products.filter(p => !!p.is_active);

    let currentParamIdx = 0;
    // search filter
    if (normSql.includes('p.name LIKE ?')) {
      const q = params[currentParamIdx].replace(/%/g, '').toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.tags && p.tags.toLowerCase().includes(q)));
      currentParamIdx += 3;
    }

    // category slug filter
    if (normSql.includes('c.slug = ?')) {
      const slug = params[currentParamIdx];
      const cat = mockData.categories.find(c => c.slug === slug);
      const catId = cat ? cat.id : -1;
      list = list.filter(p => p.category_id === catId);
      currentParamIdx += 1;
    }

    // featured filter
    if (normSql.includes('p.is_featured = TRUE')) {
      list = list.filter(p => !!p.is_featured);
    }

    // sort
    if (normSql.includes('ORDER BY p.price ASC')) {
      list.sort((a, b) => a.price - b.price);
    } else if (normSql.includes('ORDER BY p.price DESC')) {
      list.sort((a, b) => b.price - a.price);
    } else if (normSql.includes('ORDER BY p.rating DESC')) {
      list.sort((a, b) => b.rating - a.rating);
    } else if (normSql.includes('ORDER BY p.reviews_count DESC')) {
      list.sort((a, b) => b.reviews_count - a.reviews_count);
    } else {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Attach category info
    const resolvedList = list.map(p => {
      const cat = mockData.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category_name: cat ? cat.name : null,
        category_slug: cat ? cat.slug : null
      };
    });

    // pagination limit offset
    const limitIdx = normSql.indexOf('LIMIT ? OFFSET ?');
    if (limitIdx !== -1) {
      const limit = Number(params[params.length - 2]);
      const offset = Number(params[params.length - 1]);
      return [resolvedList.slice(offset, offset + limit)];
    }

    return [resolvedList];
  }

  // 9. Products: Get Single Product details
  if (normSql.startsWith('SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?')) {
    const id = Number(params[0]);
    const matched = mockData.products.filter(p => p.id === id && !!p.is_active).map(p => {
      const cat = mockData.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category_name: cat ? cat.name : null,
        category_slug: cat ? cat.slug : null
      };
    });
    return [matched];
  }

  // 10. Products: Related
  if (normSql.startsWith('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.category_id = ?')) {
    const catId = Number(params[0]);
    const excludeId = Number(params[1]);
    const matched = mockData.products.filter(p => p.category_id === catId && p.id !== excludeId && !!p.is_active).slice(0, 4).map(p => {
      const cat = mockData.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category_name: cat ? cat.name : null
      };
    });
    return [matched];
  }

  // 11. Cart: Get Items
  if (normSql.startsWith('SELECT c.id, c.quantity, c.product_id, p.name, p.price, p.original_price, p.image_url, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?')) {
    const userId = Number(params[0]);
    const items = mockData.cart.filter(item => item.user_id === userId).map(item => {
      const p = mockData.products.find(prod => prod.id === item.product_id);
      return {
        id: item.id,
        quantity: item.quantity,
        product_id: item.product_id,
        name: p ? p.name : 'Unknown Product',
        price: p ? p.price : 0,
        original_price: p ? p.original_price : null,
        image_url: p ? p.image_url : '',
        stock: p ? p.stock : 0
      };
    });
    return [items];
  }

  // 12. Cart: Check single product stock
  if (normSql.startsWith('SELECT id, stock FROM products WHERE id = ?')) {
    const id = Number(params[0]);
    const res = mockData.products.filter(p => p.id === id).map(p => ({ id: p.id, stock: p.stock }));
    return [res];
  }

  // 13. Cart: Check existing cart item belongs to user
  if (normSql.startsWith('SELECT id FROM cart WHERE id = ? AND user_id = ?')) {
    const [cartId, userId] = params;
    const match = mockData.cart.filter(c => c.id === Number(cartId) && c.user_id === Number(userId));
    return [match];
  }

  // 14. Cart: Add/Upsert cart item
  if (normSql.startsWith('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE')) {
    const [userId, prodId, quantity] = params;
    const existingIndex = mockData.cart.findIndex(c => c.user_id === Number(userId) && c.product_id === Number(prodId));
    if (existingIndex !== -1) {
      mockData.cart[existingIndex].quantity += Number(quantity);
    } else {
      const newId = mockData.cart.length > 0 ? Math.max(...mockData.cart.map(c => c.id)) + 1 : 1;
      mockData.cart.push({
        id: newId,
        user_id: Number(userId),
        product_id: Number(prodId),
        quantity: Number(quantity)
      });
    }
    saveMockData();
    return [{ affectedRows: 1 }];
  }

  // 15. Cart: Update Quantity
  if (normSql.startsWith('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?')) {
    const [qty, cartId, userId] = params;
    mockData.cart = mockData.cart.map(c => (c.id === Number(cartId) && c.user_id === Number(userId)) ? { ...c, quantity: Number(qty) } : c);
    saveMockData();
    return [{ affectedRows: 1 }];
  }

  // 16. Cart: Delete single item
  if (normSql.startsWith('DELETE FROM cart WHERE id = ? AND user_id = ?')) {
    const [cartId, userId] = params;
    const beforeCount = mockData.cart.length;
    mockData.cart = mockData.cart.filter(c => !(c.id === Number(cartId) && c.user_id === Number(userId)));
    saveMockData();
    const affected = beforeCount - mockData.cart.length;
    return [{ affectedRows: affected }];
  }

  // 17. Cart: Clear all items
  if (normSql.startsWith('DELETE FROM cart WHERE user_id = ?')) {
    const userId = Number(params[0]);
    mockData.cart = mockData.cart.filter(c => c.user_id !== userId);
    saveMockData();
    return [{ affectedRows: 1 }];
  }

  // 18. Orders: Get orders history
  if (normSql.startsWith('SELECT o.*, COUNT(oi.id) as item_count FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = ?')) {
    const userId = Number(params[0]);
    const userOrders = mockData.orders.filter(o => o.user_id === userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const res = userOrders.map(o => {
      const item_count = mockData.order_items.filter(oi => oi.order_id === o.id).length;
      return { ...o, item_count };
    });
    return [res];
  }

  // 19. Orders: Single Order Details
  if (normSql.startsWith('SELECT * FROM orders WHERE id = ? AND user_id = ?')) {
    const [id, userId] = params;
    const match = mockData.orders.filter(o => o.id === Number(id) && o.user_id === Number(userId));
    return [match];
  }

  // 20. Orders: Single Order Items
  if (normSql.startsWith('SELECT * FROM order_items WHERE order_id = ?')) {
    const id = Number(params[0]);
    const items = mockData.order_items.filter(oi => oi.order_id === id);
    return [items];
  }

  // 21. Admin: Stats counts
  if (normSql.startsWith("SELECT COUNT(*) as totalUsers FROM users WHERE role = 'user'")) {
    const count = mockData.users.filter(u => u.role === 'user').length;
    return [[{ totalUsers: count }]];
  }
  if (normSql.startsWith('SELECT COUNT(*) as totalProducts FROM products WHERE is_active = TRUE')) {
    const count = mockData.products.filter(p => !!p.is_active).length;
    return [[{ totalProducts: count }]];
  }
  if (normSql.startsWith('SELECT COUNT(*) as totalOrders FROM orders')) {
    const count = mockData.orders.length;
    return [[{ totalOrders: count }]];
  }
  if (normSql.startsWith("SELECT COALESCE(SUM(total), 0) as totalRevenue FROM orders WHERE status != 'cancelled'")) {
    const revenue = mockData.orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + Number(o.total), 0);
    return [[{ totalRevenue: revenue }]];
  }
  if (normSql.startsWith("SELECT COUNT(*) as pendingOrders FROM orders WHERE status = 'pending'")) {
    const count = mockData.orders.filter(o => o.status === 'pending').length;
    return [[{ pendingOrders: count }]];
  }

  // 22. Admin: Recent orders
  if (normSql.startsWith('SELECT o.id, o.total, o.status, o.created_at, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC')) {
    const sorted = [...mockData.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
    const mapped = sorted.map(o => {
      const u = mockData.users.find(usr => usr.id === o.user_id);
      return {
        id: o.id,
        total: o.total,
        status: o.status,
        created_at: o.created_at,
        user_name: u ? u.name : 'Unknown User',
        user_email: u ? u.email : 'unknown@example.com'
      };
    });
    return [mapped];
  }

  // 23. Admin: Manage Products
  if (normSql.startsWith('SELECT COUNT(*) as total FROM products p WHERE p.name LIKE ? OR p.description LIKE ?')) {
    const q = params[0].replace(/%/g, '').toLowerCase();
    const count = mockData.products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)).length;
    return [[{ total: count }]];
  }
  if (normSql.startsWith('SELECT COUNT(*) as total FROM products p')) {
    const count = mockData.products.length;
    return [[{ total: count }]];
  }

  if (normSql.startsWith('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.name LIKE ? OR p.description LIKE ?')) {
    const q = params[0].replace(/%/g, '').toLowerCase();
    const matched = mockData.products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    const mapped = matched.map(p => {
      const cat = mockData.categories.find(c => c.id === p.category_id);
      return { ...p, category_name: cat ? cat.name : null };
    });
    const limit = Number(params[2]);
    const offset = Number(params[3]);
    return [mapped.slice(offset, offset + limit)];
  }

  if (normSql.startsWith('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.created_at DESC')) {
    const mapped = mockData.products.map(p => {
      const cat = mockData.categories.find(c => c.id === p.category_id);
      return { ...p, category_name: cat ? cat.name : null };
    });
    const limit = Number(params[0]);
    const offset = Number(params[1]);
    return [mapped.slice(offset, offset + limit)];
  }

  // 24. Admin: Get all categories
  if (normSql.startsWith('SELECT * FROM categories ORDER BY name ASC')) {
    const sorted = [...mockData.categories].sort((a, b) => a.name.localeCompare(b.name));
    return [sorted];
  }

  // 25. Admin: Create product
  if (normSql.startsWith('INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, is_featured, tags) VALUES')) {
    const [name, description, price, original_price, category_id, image_url, stock, is_featured, tags] = params;
    const newId = mockData.products.length > 0 ? Math.max(...mockData.products.map(p => p.id)) + 1 : 1;
    const newProd = {
      id: newId,
      name,
      description,
      price: Number(price),
      original_price: original_price ? Number(original_price) : null,
      category_id: category_id ? Number(category_id) : null,
      image_url: image_url || null,
      stock: Number(stock) || 0,
      is_featured: is_featured ? 1 : 0,
      is_active: 1,
      rating: 0.0,
      reviews_count: 0,
      tags: tags || null,
      created_at: new Date().toISOString()
    };
    mockData.products.push(newProd);
    saveMockData();
    return [{ insertId: newId }];
  }

  // 26. Admin: Update Product
  if (normSql.startsWith('UPDATE products SET name=?, description=?, price=?, original_price=?, category_id=?, image_url=?, stock=?, is_featured=?, tags=?, is_active=? WHERE id=?')) {
    const [name, description, price, original_price, category_id, image_url, stock, is_featured, tags, is_active, id] = params;
    mockData.products = mockData.products.map(p => p.id === Number(id) ? {
      ...p,
      name,
      description,
      price: Number(price),
      original_price: original_price ? Number(original_price) : null,
      category_id: category_id ? Number(category_id) : null,
      image_url: image_url || null,
      stock: Number(stock) || 0,
      is_featured: is_featured ? 1 : 0,
      tags: tags || null,
      is_active: is_active ? 1 : 0
    } : p);
    saveMockData();
    return [{ affectedRows: 1 }];
  }

  // 27. Admin: Soft Delete product
  if (normSql.startsWith('UPDATE products SET is_active = FALSE WHERE id = ?')) {
    const id = Number(params[0]);
    mockData.products = mockData.products.map(p => p.id === id ? { ...p, is_active: 0 } : p);
    saveMockData();
    return [{ affectedRows: 1 }];
  }

  // 28. Admin: Get Orders list count
  if (normSql.startsWith('SELECT COUNT(*) as total FROM orders o WHERE o.status = ?')) {
    const st = params[0];
    const count = mockData.orders.filter(o => o.status === st).length;
    return [[{ total: count }]];
  }
  if (normSql.startsWith('SELECT COUNT(*) as total FROM orders o')) {
    const count = mockData.orders.length;
    return [[{ total: count }]];
  }

  // 29. Admin: Get Orders list
  if (normSql.startsWith('SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = ?')) {
    const st = params[0];
    const matched = mockData.orders.filter(o => o.status === st);
    const mapped = matched.map(o => {
      const u = mockData.users.find(usr => usr.id === o.user_id);
      return {
        ...o,
        user_name: u ? u.name : 'Unknown User',
        user_email: u ? u.email : 'unknown@example.com'
      };
    });
    const limit = Number(params[1]);
    const offset = Number(params[2]);
    return [mapped.slice(offset, offset + limit)];
  }
  if (normSql.startsWith('SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC')) {
    const mapped = mockData.orders.map(o => {
      const u = mockData.users.find(usr => usr.id === o.user_id);
      return {
        ...o,
        user_name: u ? u.name : 'Unknown User',
        user_email: u ? u.email : 'unknown@example.com'
      };
    });
    const limit = Number(params[0]);
    const offset = Number(params[1]);
    return [mapped.slice(offset, offset + limit)];
  }

  // 30. Admin: Get Order details
  if (normSql.startsWith('SELECT o.*, u.name as user_name, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?')) {
    const id = Number(params[0]);
    const matched = mockData.orders.filter(o => o.id === id).map(o => {
      const u = mockData.users.find(usr => usr.id === o.user_id);
      return {
        ...o,
        user_name: u ? u.name : 'Unknown User',
        user_email: u ? u.email : 'unknown@example.com'
      };
    });
    return [matched];
  }

  // 31. Admin: Update order status
  if (normSql.startsWith('UPDATE orders SET status = ? WHERE id = ?')) {
    const [status, id] = params;
    mockData.orders = mockData.orders.map(o => o.id === Number(id) ? { ...o, status } : o);
    saveMockData();
    return [{ affectedRows: 1 }];
  }

  // 32. Admin: Get users list count
  if (normSql.startsWith('SELECT COUNT(*) as total FROM users WHERE name LIKE ? OR email LIKE ?')) {
    const q = params[0].replace(/%/g, '').toLowerCase();
    const count = mockData.users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).length;
    return [[{ total: count }]];
  }
  if (normSql.startsWith('SELECT COUNT(*) as total FROM users')) {
    const count = mockData.users.length;
    return [[{ total: count }]];
  }

  // 33. Admin: Get users list
  if (normSql.startsWith('SELECT id, name, email, role, phone, created_at FROM users WHERE name LIKE ? OR email LIKE ?')) {
    const q = params[0].replace(/%/g, '').toLowerCase();
    const matched = mockData.users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    const limit = Number(params[2]);
    const offset = Number(params[3]);
    return [matched.slice(offset, offset + limit)];
  }
  if (normSql.startsWith('SELECT id, name, email, role, phone, created_at FROM users ORDER BY created_at DESC')) {
    const limit = Number(params[0]);
    const offset = Number(params[1]);
    return [mockData.users.slice(offset, offset + limit)];
  }

  // 34. Admin: Update user role
  if (normSql.startsWith('UPDATE users SET role = ? WHERE id = ?')) {
    const [role, id] = params;
    mockData.users = mockData.users.map(u => u.id === Number(id) ? { ...u, role } : u);
    saveMockData();
    return [{ affectedRows: 1 }];
  }

  console.log('UNHANDLED SQL QUERY:', sql, 'params:', params);
  return [[]];
};

// Mock Connection object for transactions
const getMockConnection = () => {
  return {
    beginTransaction: async () => {},
    commit: async () => {},
    rollback: async () => {},
    release: () => {},
    query: async (sql, params) => {
      const normSql = sql.replace(/\s+/g, ' ').trim();

      // Transaction queries inside Order placement
      // 1. Fetch user's cart items
      if (normSql.startsWith('SELECT c.quantity, p.id as product_id, p.name, p.image_url, p.price, p.stock FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?')) {
        const userId = Number(params[0]);
        const items = mockData.cart.filter(item => item.user_id === userId).map(item => {
          const p = mockData.products.find(prod => prod.id === item.product_id);
          return {
            quantity: item.quantity,
            product_id: item.product_id,
            name: p ? p.name : 'Unknown Product',
            price: p ? p.price : 0,
            image_url: p ? p.image_url : '',
            stock: p ? p.stock : 0
          };
        });
        return [items];
      }

      // 2. Create order record
      if (normSql.startsWith('INSERT INTO orders (user_id, total, shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_zip, payment_method, notes)')) {
        const [user_id, total, shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_zip, payment_method, notes] = params;
        const newOrderId = mockData.orders.length > 0 ? Math.max(...mockData.orders.map(o => o.id)) + 1 : 1;
        const newOrder = {
          id: newOrderId,
          user_id: Number(user_id),
          total: Number(total),
          status: 'pending',
          shipping_name,
          shipping_email,
          shipping_phone,
          shipping_address,
          shipping_city,
          shipping_state,
          shipping_zip,
          payment_method,
          notes: notes || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockData.orders.push(newOrder);
        saveMockData();
        return [{ insertId: newOrderId }];
      }

      // 3. Insert order item
      if (normSql.startsWith('INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price)')) {
        const [order_id, product_id, product_name, product_image, quantity, price] = params;
        const newId = mockData.order_items.length > 0 ? Math.max(...mockData.order_items.map(oi => oi.id)) + 1 : 1;
        mockData.order_items.push({
          id: newId,
          order_id: Number(order_id),
          product_id: Number(product_id),
          product_name,
          product_image,
          quantity: Number(quantity),
          price: Number(price)
        });
        saveMockData();
        return [{ insertId: newId }];
      }

      // 4. Update products stock
      if (normSql.startsWith('UPDATE products SET stock = stock - ? WHERE id = ?')) {
        const [qty, prodId] = params;
        mockData.products = mockData.products.map(p => p.id === Number(prodId) ? { ...p, stock: Math.max(0, p.stock - Number(qty)) } : p);
        saveMockData();
        return [{ affectedRows: 1 }];
      }

      // 5. Clear user cart
      if (normSql.startsWith('DELETE FROM cart WHERE user_id = ?')) {
        const userId = Number(params[0]);
        mockData.cart = mockData.cart.filter(c => c.user_id !== userId);
        saveMockData();
        return [{ affectedRows: 1 }];
      }

      // Default fallback inside connection
      return runMockQuery(sql, params);
    }
  };
};

const promisePool = {
  query: async (sql, params) => {
    if (useMock) {
      return runMockQuery(sql, params);
    }
    try {
      return await pool.promise().query(sql, params);
    } catch (err) {
      console.warn('MySQL query failed, falling back to mock database', err.message);
      useMock = true;
      return runMockQuery(sql, params);
    }
  },
  getConnection: async () => {
    if (useMock) {
      return getMockConnection();
    }
    try {
      return await pool.promise().getConnection();
    } catch (err) {
      console.warn('MySQL getConnection failed, falling back to mock database connection', err.message);
      useMock = true;
      return getMockConnection();
    }
  }
};

module.exports = promisePool;
