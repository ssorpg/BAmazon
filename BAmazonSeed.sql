DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products
(
    item_id INT NOT NULL
    AUTO_INCREMENT,
  product_name VARCHAR
    (80) NOT NULL,
  department_name VARCHAR
    (40) NOT NULL,
  price DECIMAL
    (10,2) NOT NULL,
  stock_quantity INT
    (10) NOT NULL,
  PRIMARY KEY
    (item_id)
);

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ('Banana', 'Food', 0.45, 100),
        ('Dark Chocolate Bar', 'Food', 1.45, 120),
        ('Hamburger Bun', 'Food', 2.95, 40),
        ('iPhone', 'Electronics', 299.95, 10),
        ('Bed sheet', 'Home Goods', 49.95, 20),
        ('Bug Spray', 'Home Goods', 7.95, 30),
        ('Apple', 'Food', 0.95, 60),
        ('TV', 'Electronics', 399.95, 5),
        ('Book', 'Home Goods', 19.95, 100),
        ('Shake Weights', 'Home Goods', 17.95, 20)
