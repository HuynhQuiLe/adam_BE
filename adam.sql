CREATE DATABASE adam

CREATE TABLE roles (
	role_id int PRIMARY KEY AUTO_INCREMENT,
	role VARCHAR(255)
)

CREATE TABLE users(
	user_id int PRIMARY KEY AUTO_INCREMENT,
	full_name VARCHAR(255),
	email VARCHAR(255),
	pass_word TEXT,
	avatar TEXT,
	birthday DATE,
	role_id INT,
	gender VARCHAR(255),
	refresh_token TEXT,
	
	FOREIGN KEY (role_id) REFERENCES roles(role_id)
)

ALTER TABLE users 
ADD COLUMN created_date DATETIME

ALTER TABLE users
ADD COLUMN deleted BOOLEAN



CREATE TABLE brands (
	brand_id int PRIMARY KEY AUTO_INCREMENT,
	brand VARCHAR(255)
)

ALTER TABLE brands 
ADD COLUMN logo TEXT

CREATE TABLE product_types (
	type_id int PRIMARY KEY AUTO_INCREMENT,
	product_type VARCHAR(255)
)

ALTER TABLE product_types 
ADD COLUMN icon VARCHAR(255)


CREATE TABLE product_sub_types (
	sub_type_id int PRIMARY KEY AUTO_INCREMENT,
	type_id int,
	sub_type VARCHAR(255),
	icon VARCHAR(255),
	
	FOREIGN KEY (type_id) REFERENCES product_types(type_id)
)


CREATE TABLE products(
	product_id int PRIMARY KEY AUTO_INCREMENT,
	product_name VARCHAR(255),
	type_id int,
	sub_type_id int,
	brand_id int,
	description TEXT,
	created_date DATETIME,
	user_id int,
	price int,
	remain int,
	FOREIGN KEY (type_id) REFERENCES product_types(type_id),
	FOREIGN KEY (sub_type_id) REFERENCES product_sub_types(sub_type_id),
	FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
	
)


CREATE TABLE social (
	social_id int PRIMARY KEY AUTO_INCREMENT,
	twitter VARCHAR(255),
	facebook VARCHAR(255),
	linkedin VARCHAR(255),
	instagram VARCHAR(255),
	tiktok VARCHAR(255),
	youtube VARCHAR(255),
	user_id int,
	FOREIGN KEY (user_id) REFERENCES users(user_id)
)

ALTER TABLE social (
)


ALTER TABLE users
ADD COLUMN url VARCHAR(255) 

ALTER TABLE users
ADD COLUMN country VARCHAR(255)

ALTER TABLE users
ADD COLUMN description TEXT


CREATE TABLE code_verification (
	code_id int PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(255),
	code_key VARCHAR(255),
	created_date DATETIME,
	verified BOOLEAN
)

DROP TABLE products

DROP TABLE product_sub_types

DROP TABLE product_types


CREATE TABLE items (
	item_id int PRIMARY KEY AUTO_INCREMENT,
	brand_id int,
	item_name VARCHAR(255),
	description TEXT,
	created_date DATE,
	user_id int,
	model VARCHAR(255),
	FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
	FOREIGN KEY (user_id) REFERENCES users(user_id)
)







