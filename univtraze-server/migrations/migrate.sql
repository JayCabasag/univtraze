CREATE TABLE if not exists users (
    id VARCHAR(36) DEFAULT UUID() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    recovery_password VARCHAR(255),
    recovery_timestamp TIMESTAMP
);

CREATE TABLE if not exists clinic_credentials (
    id VARCHAR(36) DEFAULT UUID() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    recovery_password VARCHAR(255),
    recovery_timestamp TIMESTAMP
);

CREATE TABLE if not exists clinic_credentials (
    id VARCHAR(36) DEFAULT UUID() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    recovery_password VARCHAR(255),
    recovery_timestamp TIMESTAMP
);

CREATE TABLE if not exists reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    disease_name VARCHAR(255) NOT NULL,
    document_proof_image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE if not exists emergency_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reported_by VARCHAR(255) NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    medical_condition VARCHAR(255) NOT NULL,
    description TEXT,
    room_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE if not exists users_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_title VARCHAR(255) NOT NULL,
    notification_description TEXT,
    notification_source VARCHAR(255),
    notification_type VARCHAR(50) NOT NULL,
    notification_is_viewed BOOLEAN DEFAULT FALSE,
    notification_for INT NOT NULL
);


CREATE TABLE if not exists admins_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_title VARCHAR(255) NOT NULL,
    notification_description TEXT,
    notification_source VARCHAR(255),
    notification_type VARCHAR(50) NOT NULL,
    notification_is_viewed BOOLEAN DEFAULT FALSE,
    notification_for INT NOT NULL
);

CREATE TABLE if not exists clinics_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_title VARCHAR(255) NOT NULL,
    notification_description TEXT,
    notification_source VARCHAR(255),
    notification_type VARCHAR(50) NOT NULL,
    notification_is_viewed BOOLEAN DEFAULT FALSE,
    notification_for INT NOT NULL
);

CREATE TABLE if not exists rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number INT NOT NULL,
    building_name VARCHAR(255) NOT NULL,
    room_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE if not exists vaccination_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    firstdose_vaxname VARCHAR(255),
    firstdose_date DATE,
    seconddose_vaxname VARCHAR(255),
    seconddose_date DATE,
    booster_vaxname VARCHAR(255),
    booster_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE if not exists room_visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    temperature DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);