-- ============================================
-- StyleHub E-Commerce Database Schema
-- ============================================

CREATE DATABASE IF NOT EXISTS stylehub_db;
USE stylehub_db;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  image_url VARCHAR(500)
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category_id INT,
  image_url VARCHAR(500),
  images JSON,
  stock INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews_count INT DEFAULT 0,
  tags VARCHAR(300),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================
-- CART TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_name VARCHAR(100),
  shipping_email VARCHAR(150),
  shipping_phone VARCHAR(20),
  shipping_address TEXT,
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_zip VARCHAR(20),
  payment_method VARCHAR(50) DEFAULT 'COD',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(200),
  product_image VARCHAR(500),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ============================================
-- SEED DATA: Categories
-- ============================================
INSERT INTO categories (name, slug, image_url) VALUES
('Men', 'men', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400'),
('Women', 'women', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400'),
('Kids', 'kids', 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400'),
('Accessories', 'accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
('Footwear', 'footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
('Sale', 'sale', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400');

-- ============================================
-- SEED DATA: Products
-- ============================================
INSERT INTO products (name, description, price, original_price, category_id, image_url, stock, rating, reviews_count, tags, is_featured) VALUES
-- Men
('Classic White Oxford Shirt', 'Premium cotton Oxford shirt with a timeless design. Perfect for formal and semi-formal occasions.', 1299.00, 1999.00, 1, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600', 50, 4.5, 128, 'shirt,formal,men,cotton', TRUE),
('Slim Fit Chinos', 'Comfortable slim-fit chinos made from stretch cotton blend. Available in multiple colors.', 1599.00, 2499.00, 1, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600', 35, 4.3, 95, 'chinos,pants,men,slim', FALSE),
('Premium Denim Jacket', 'Rugged yet stylish denim jacket with a vintage wash finish.', 2499.00, 3499.00, 1, 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600', 20, 4.7, 210, 'jacket,denim,men,casual', TRUE),
('Polo T-Shirt Pack', 'Set of 3 premium polo t-shirts in classic colors. Breathable and comfortable.', 1899.00, 2799.00, 1, 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600', 60, 4.4, 156, 'polo,tshirt,men,casual', FALSE),

-- Women
('Floral Maxi Dress', 'Elegant floral print maxi dress perfect for summer occasions and beach outings.', 1899.00, 2999.00, 2, 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600', 25, 4.8, 302, 'dress,floral,women,summer', TRUE),
('High-Waist Skinny Jeans', 'Stretch denim high-waist jeans that give a perfect silhouette. Super comfortable fit.', 1699.00, 2499.00, 2, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', 40, 4.6, 187, 'jeans,women,denim,casual', FALSE),
('Blazer & Trouser Co-ord', 'Professional co-ord set with structured blazer and matching straight trousers.', 3299.00, 4999.00, 2, 'https://images.unsplash.com/photo-1609239001074-421572b56e9d?w=600', 15, 4.9, 89, 'blazer,formal,women,coordset', TRUE),
('Bohemian Wrap Skirt', 'Free-spirited bohemian wrap skirt with intricate embroidery detailing.', 999.00, 1599.00, 2, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600', 30, 4.2, 74, 'skirt,boho,women,casual', FALSE),

-- Kids
('Cartoon Graphic Tee', 'Fun cartoon graphic t-shirt made from 100% soft cotton. Kids love it!', 499.00, 799.00, 3, 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600', 80, 4.6, 143, 'tshirt,kids,casual,cartoon', FALSE),
('Denim Dungaree', 'Cute and durable denim dungaree for active kids. Adjustable straps for growing children.', 799.00, 1299.00, 3, 'https://images.unsplash.com/photo-1471286174890-9c112ffaa5f5?w=600', 45, 4.5, 98, 'dungaree,kids,denim,cute', TRUE),

-- Accessories
('Leather Belt Collection', 'Genuine leather belt with premium buckle. Available in brown and black.', 699.00, 1199.00, 4, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 100, 4.4, 67, 'belt,leather,accessories,men', FALSE),
('Silk Scarf', 'Luxurious silk scarf with vibrant abstract print. Versatile styling accessory.', 899.00, 1499.00, 4, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600', 60, 4.7, 112, 'scarf,silk,women,accessories', TRUE),
('Aviator Sunglasses', 'Classic aviator sunglasses with UV400 protection and polarized lenses.', 1299.00, 2199.00, 4, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', 55, 4.5, 201, 'sunglasses,accessories,unisex', FALSE),

-- Footwear
('White Sneakers', 'Clean white leather sneakers with cushioned insole. Perfect everyday shoe.', 2499.00, 3999.00, 5, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 30, 4.8, 428, 'sneakers,shoes,white,unisex', TRUE),
('Block Heel Sandals', 'Comfortable block heel sandals with adjustable ankle strap.', 1599.00, 2499.00, 2, 'https://images.unsplash.com/photo-1594938298603-c8148c4b4295?w=600', 25, 4.3, 86, 'sandals,heels,women,footwear', FALSE),
('Oxford Dress Shoes', 'Classic Oxford dress shoes in genuine leather. Ideal for formal occasions.', 3499.00, 4999.00, 1, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600', 20, 4.7, 134, 'oxford,shoes,men,formal', TRUE);

-- ============================================
-- SEED DATA: Admin User
-- Password: admin123 (bcrypt hash)
-- ============================================
INSERT INTO users (name, email, password, role) VALUES
('StyleHub Admin', 'admin@stylehub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Note: Update the above hash with bcrypt.hash('admin123', 10) in production
