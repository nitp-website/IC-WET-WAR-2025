-- Conference Management System Database Setup
-- Database: wet_war

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS wet_war;
USE wet_war;

-- Admin table for authentication
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Staff management table
CREATE TABLE IF NOT EXISTS staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(100) DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Conference attendees/members table
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    designation VARCHAR(255) NOT NULL,
    institute VARCHAR(255) NOT NULL,
    qr_code_path VARCHAR(500),
    id_card_path VARCHAR(500),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Meal management table for attendees
CREATE TABLE IF NOT EXISTS attendee_meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    meal_date DATE NOT NULL,
    is_consumed BOOLEAN DEFAULT FALSE,
    consumed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member_meal (member_id, meal_type, meal_date)
);

-- Restaurant meal tracking table
CREATE TABLE IF NOT EXISTS restaurant_meals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    meal_date DATE NOT NULL,
    quantity_delivered INT NOT NULL DEFAULT 0,
    quantity_consumed INT NOT NULL DEFAULT 0,
    delivery_time TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_restaurant_meal (meal_type, meal_date)
);

-- Meal allocation settings table
CREATE TABLE IF NOT EXISTS meal_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meal_type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    max_meals_per_person INT NOT NULL DEFAULT 1,
    meal_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin credentials (from .env file)
INSERT INTO admins (email, password, name) VALUES 
('ashishk.dd22.cs@nitp.ac.in', '$2b$10$YourHashedPasswordHere', 'Admin User')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Insert default meal settings
INSERT INTO meal_settings (meal_type, max_meals_per_person, meal_time) VALUES 
('breakfast', 1, '08:00:00'),
('lunch', 1, '13:00:00'),
('dinner', 1, '19:00:00'),
('snack', 2, '16:00:00')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Create indexes for better performance
CREATE INDEX idx_members_registration ON members(registration_number);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_attendee_meals_member ON attendee_meals(member_id);
CREATE INDEX idx_attendee_meals_date ON attendee_meals(meal_date);
CREATE INDEX idx_restaurant_meals_date ON restaurant_meals(meal_date);
CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_admins_email ON admins(email);
