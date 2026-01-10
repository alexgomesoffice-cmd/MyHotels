import { pool } from "./db.js";

async function createTables() {
  const connection = await pool.getConnection();

  try {
    console.log("Creating tables...");

    // ---------------- ROLE ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ROLE (
        role_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      INSERT IGNORE INTO ROLE (name)
      VALUES ('Admin'), ('User'), ('Hotel_Manager')
    `);

    // ---------------- USER ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS USER (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES ROLE(role_id)
      )
    `);

    // ---------------- USER_DETAILS ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS USER_DETAILS (
        user_details_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        dob DATE,
        gender ENUM('Male','Female','Other'),
        address VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE
      )
    `);

    // ---------------- HOTEL_TYPE ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS HOTEL_TYPE (
        hotel_type_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    await connection.query(`
      INSERT IGNORE INTO HOTEL_TYPE (name)
      VALUES ('5 Star'), ('Resort'), ('Motel'), ('Boutique')
    `);

    // ---------------- HOTEL ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS HOTEL (
        hotel_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        address VARCHAR(255) NOT NULL,
        hotel_type_id INT NOT NULL,
        created_by_user_id INT NOT NULL,
        approval_status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
        approved_by_admin_id INT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (hotel_type_id) REFERENCES HOTEL_TYPE(hotel_type_id),
        FOREIGN KEY (created_by_user_id) REFERENCES USER(user_id),
        FOREIGN KEY (approved_by_admin_id) REFERENCES USER(user_id)
      )
    `);

    // ---------------- HOTEL_ROOM_TYPE ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS HOTEL_ROOM_TYPE (
        hotel_room_type_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
      )
    `);

    await connection.query(`
      INSERT IGNORE INTO HOTEL_ROOM_TYPE (name)
      VALUES ('Single'), ('Double'), ('Suite')
    `);

    // ---------------- HOTEL_ROOM_DETAILS ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS HOTEL_ROOM_DETAILS (
        hotel_room_details_id INT AUTO_INCREMENT PRIMARY KEY,
        hotel_id INT NOT NULL,
        hotel_room_type_id INT NOT NULL,
        room_number VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_by_user_id INT NOT NULL,
        approval_status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
        approved_by_admin_id INT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (hotel_id) REFERENCES HOTEL(hotel_id),
        FOREIGN KEY (hotel_room_type_id) REFERENCES HOTEL_ROOM_TYPE(hotel_room_type_id),
        FOREIGN KEY (created_by_user_id) REFERENCES USER(user_id),
        FOREIGN KEY (approved_by_admin_id) REFERENCES USER(user_id)
      )
    `);

    // ---------------- BOOKING ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS BOOKING (
        booking_id INT AUTO_INCREMENT PRIMARY KEY,
        user_details_id INT NOT NULL,
        checkin_date DATE NOT NULL,
        checkout_date DATE NOT NULL,
        for_persons INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status ENUM('CONFIRMED','CANCELLED') DEFAULT 'CONFIRMED',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_details_id)
          REFERENCES USER_DETAILS(user_details_id)
          ON DELETE CASCADE
      )
    `);

    // ---------------- HOTEL_ROOM_BOOKING ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS HOTEL_ROOM_BOOKING (
        hotel_room_booking_id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        hotel_room_details_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES BOOKING(booking_id) ON DELETE CASCADE,
        FOREIGN KEY (hotel_room_details_id)
          REFERENCES HOTEL_ROOM_DETAILS(hotel_room_details_id)
      )
    `);

    console.log("All tables created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    connection.release();
  }
}

export default createTables;
