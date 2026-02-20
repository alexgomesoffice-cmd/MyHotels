import { pool } from "./db.js";

async function createTables() {
  const connection = await pool.getConnection();

  try {
    console.log("Creating tables...");

    // ---------------- ROLE ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS role (
        role_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      INSERT IGNORE INTO role (name)
      VALUES ('Admin'), ('User'), ('Hotel_Manager')
    `);

    // ---------------- USER ----------------
    await connection.query(`
  CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_blocked TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(role_id)
  )
`);

    // ---------------- USER_DETAILS ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_details (
        user_details_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        dob DATE,
        gender ENUM('Male','Female','Other'),
        phone VARCHAR(20),
        address VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        CONSTRAINT fk_user_details FOREIGN KEY (user_id)
          REFERENCES user(user_id) ON DELETE CASCADE
      )
    `);

    // ---------------- HOTEL_TYPE ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hotel_type (
        hotel_type_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

      )
    `);
    await connection.query(`
        INSERT IGNORE INTO hotel_type (name)
        VALUES ('Luxury Hotel'),('Resort'),('Business Hotel'),('Boutique'),('Guest House')
        `);

    // ---------------- HOTEL ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hotel (
        hotel_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        address VARCHAR(255) NOT NULL,
        description TEXT,
        hotel_type_id INT NOT NULL,
        created_by_user_id INT NOT NULL,
        approval_status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
        approved_by_admin_id INT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_created_by (created_by_user_id),
        INDEX idx_hotel_type (hotel_type_id),
        INDEX idx_approval_status (approval_status),
        UNIQUE KEY unique_hotel_duplicate (name, address, hotel_type_id),
        CONSTRAINT fk_hotel_type FOREIGN KEY (hotel_type_id) REFERENCES hotel_type(hotel_type_id),
        CONSTRAINT fk_hotel_creator FOREIGN KEY (created_by_user_id) REFERENCES user(user_id) ON DELETE RESTRICT,
        CONSTRAINT fk_hotel_approver FOREIGN KEY (approved_by_admin_id) REFERENCES user(user_id) ON DELETE SET NULL
      )
    `);

    // ---------------- HOTEL_ROOM_TYPE ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hotel_room_type (
        hotel_room_type_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
      await connection.query(`
        INSERT IGNORE INTO hotel_room_type (name)
        VALUES ('Standard'),('Delux'),('Premium Lounge'),('Standard Suite'),('Presidential Suite')
        `);
    // ---------------- HOTEL_ROOM_DETAILS ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hotel_room_details (
        hotel_room_details_id INT AUTO_INCREMENT PRIMARY KEY,
        hotel_id INT NOT NULL,
        hotel_room_type_id INT NOT NULL,
        room_number VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_by_user_id INT NOT NULL,
        approval_status ENUM('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
        approved_by_admin_id INT DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_room_per_hotel (hotel_id, room_number),
        INDEX idx_hotel_id (hotel_id),
        INDEX idx_approval_status (approval_status),
        CONSTRAINT fk_room_hotel FOREIGN KEY (hotel_id) REFERENCES hotel(hotel_id) ON DELETE CASCADE,
        CONSTRAINT fk_room_type FOREIGN KEY (hotel_room_type_id) REFERENCES hotel_room_type(hotel_room_type_id),
        CONSTRAINT fk_room_creator FOREIGN KEY (created_by_user_id) REFERENCES user(user_id) ON DELETE RESTRICT,
        CONSTRAINT fk_room_approver FOREIGN KEY (approved_by_admin_id) REFERENCES user(user_id) ON DELETE SET NULL
      )
    `);

    // ---------------- BOOKING ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS booking (
        booking_id INT AUTO_INCREMENT PRIMARY KEY,
        user_details_id INT NOT NULL,
        checkin_date DATE NOT NULL,
        checkout_date DATE NOT NULL,
        for_room INT NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status ENUM('CONFIRMED','CANCELLED') DEFAULT 'CONFIRMED',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_details (user_details_id),
        INDEX idx_status (status),
        INDEX idx_checkin_date (checkin_date),
        CONSTRAINT fk_booking_user_details FOREIGN KEY (user_details_id)
          REFERENCES user_details(user_details_id) ON DELETE CASCADE
      )
    `);

    // ---------------- HOTEL_ROOM_BOOKING ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS hotel_room_booking (
        hotel_room_booking_id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        hotel_room_details_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_booking_id (booking_id),
        INDEX idx_room_id (hotel_room_details_id),
        CONSTRAINT fk_hrb_booking FOREIGN KEY (booking_id) REFERENCES booking(booking_id) ON DELETE CASCADE,
        CONSTRAINT fk_hrb_room FOREIGN KEY (hotel_room_details_id)
          REFERENCES hotel_room_details(hotel_room_details_id) ON DELETE CASCADE
      )
    `);

    // ---------------- CHECKOUT ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS checkout (
        checkout_id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL UNIQUE,
        checkout_date DATETIME NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_booking_id (booking_id),
        CONSTRAINT fk_checkout_booking FOREIGN KEY (booking_id)
          REFERENCES booking(booking_id) ON DELETE CASCADE
      )
    `);


      await connection.query(`
  CREATE TABLE IF NOT EXISTS hotel_images (
  hotel_image_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_hotel_images_hotel
    FOREIGN KEY (hotel_id)
    REFERENCES hotel(hotel_id)
    ON DELETE CASCADE
);

`);


await connection.query(`
  CREATE TABLE IF NOT EXISTS hotel_room_images (
  room_image_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_room_details_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_room_id (hotel_room_details_id),

  CONSTRAINT fk_room_images_room
    FOREIGN KEY (hotel_room_details_id)
    REFERENCES hotel_room_details(hotel_room_details_id)
    ON DELETE CASCADE
);

`);

    // ---------------- AUDIT_LOG ----------------
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        audit_log_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INT,
        old_value JSON,
        new_value JSON,
        ip_address VARCHAR(45),
        user_agent VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at),
        CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE SET NULL
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
