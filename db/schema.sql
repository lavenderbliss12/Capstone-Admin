-- MySQL schema for Capstone-Admin
-- Run in MySQL 8.x (phpMyAdmin or mysql CLI)

CREATE DATABASE IF NOT EXISTS capstone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE capstone;

-- Users
CREATE TABLE IF NOT EXISTS user_info (
  user_id         INT AUTO_INCREMENT PRIMARY KEY,
  uid             VARCHAR(36) NOT NULL UNIQUE,
  username        VARCHAR(100) NOT NULL,
  surname         VARCHAR(50)  NOT NULL,
  name            VARCHAR(50)  NOT NULL,
  email           VARCHAR(100) NOT NULL UNIQUE,
  password        VARCHAR(50)  NOT NULL,
  total_points    INT NOT NULL DEFAULT 0 CHECK (total_points >= 0),
  date_registered DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Biowaste disposals
CREATE TABLE IF NOT EXISTS biowaste_disposal (
  disposal_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  uid           VARCHAR(36) NOT NULL,
  kilogram      DECIMAL(10,2) NOT NULL CHECK (kilogram >= 0),
  points_earned INT NOT NULL DEFAULT 0 CHECK (points_earned >= 0),
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_biowaste_user FOREIGN KEY (user_id) REFERENCES user_info(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_biowaste_user_id (user_id),
  INDEX idx_biowaste_uid (uid)
) ENGINE=InnoDB;

-- Reward transactions
CREATE TABLE IF NOT EXISTS `transaction` (
  transaction_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  reward_name      VARCHAR(100) NOT NULL,
  points_used      INT NOT NULL CHECK (points_used >= 0),
  transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tx_user FOREIGN KEY (user_id) REFERENCES user_info(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_tx_user_id (user_id)
) ENGINE=InnoDB;

-- Checkpoints (one row per user)
CREATE TABLE IF NOT EXISTS checkpoint (
  checkpoint_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,
  uid           VARCHAR(36) NOT NULL,
  total_points  INT NOT NULL DEFAULT 0,
  last_updated  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_checkpoint_user FOREIGN KEY (user_id) REFERENCES user_info(user_id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_checkpoint_uid (uid)
) ENGINE=InnoDB;

-- Triggers to keep data consistent
DELIMITER //

-- Auto-fill uid in biowaste_disposal based on user_id when not provided
CREATE TRIGGER biowaste_before_insert
BEFORE INSERT ON biowaste_disposal FOR EACH ROW
BEGIN
  IF NEW.uid IS NULL OR NEW.uid = '' THEN
    SET NEW.uid = (SELECT u.uid FROM user_info u WHERE u.user_id = NEW.user_id);
  END IF;
END //

-- When a biowaste record is inserted, add earned points to user and update checkpoint
CREATE TRIGGER biowaste_after_insert
AFTER INSERT ON biowaste_disposal FOR EACH ROW
BEGIN
  UPDATE user_info SET total_points = total_points + NEW.points_earned WHERE user_id = NEW.user_id;
  INSERT INTO checkpoint (user_id, uid, total_points, last_updated)
  VALUES (
    NEW.user_id,
    NEW.uid,
    (SELECT total_points FROM user_info WHERE user_id = NEW.user_id),
    CURRENT_TIMESTAMP
  )
  ON DUPLICATE KEY UPDATE
    total_points = VALUES(total_points),
    last_updated = CURRENT_TIMESTAMP;
END //

-- Before a transaction, ensure sufficient points and deduct
CREATE TRIGGER tx_before_insert
BEFORE INSERT ON `transaction` FOR EACH ROW
BEGIN
  DECLARE current_points INT;
  SELECT total_points INTO current_points FROM user_info WHERE user_id = NEW.user_id FOR UPDATE;
  IF current_points IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User not found';
  END IF;
  IF current_points < NEW.points_used THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient points';
  END IF;
  UPDATE user_info SET total_points = total_points - NEW.points_used WHERE user_id = NEW.user_id;
  UPDATE checkpoint SET total_points = total_points - NEW.points_used, last_updated = CURRENT_TIMESTAMP
  WHERE user_id = NEW.user_id;
END //

-- Keep uid in child tables in sync if user changes uid
CREATE TRIGGER user_info_after_update
AFTER UPDATE ON user_info FOR EACH ROW
BEGIN
  IF NEW.uid <> OLD.uid THEN
    UPDATE checkpoint SET uid = NEW.uid WHERE user_id = NEW.user_id;
    UPDATE biowaste_disposal SET uid = NEW.uid WHERE user_id = NEW.user_id;
  END IF;
END //

DELIMITER ;

-- Sample data
INSERT INTO user_info (uid, username, surname, name, email, password)
VALUES ('A1B2C3D4', 'alice', 'Riverdale', 'Chandler', 'alice@example.com', 'temp')
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Sample disposal earns 10 points for 2.5 kg (adjust logic in app)
INSERT INTO biowaste_disposal (user_id, uid, kilogram, points_earned)
SELECT user_id, uid, 2.50, 10 FROM user_info WHERE uid = 'A1B2C3D4';

-- Sample redemption uses 5 points
INSERT INTO `transaction` (user_id, reward_name, points_used)
SELECT user_id, 'Eco Tote Bag', 5 FROM user_info WHERE uid = 'A1B2C3D4';
