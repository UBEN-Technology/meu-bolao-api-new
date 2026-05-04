CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    picture_url VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_confirmed BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS system_admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    access_level ENUM('super_admin', 'moderator') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS championships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    status ENUM('active', 'finished') NOT NULL DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    badge_url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS championship_teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    championship_id INT NOT NULL,
    team_id INT NOT NULL,
    FOREIGN KEY (championship_id) REFERENCES championships(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    championship_id INT NOT NULL,
    home_team_id INT NOT NULL,
    away_team_id INT NOT NULL,
    match_date DATETIME NOT NULL,
    home_score INT,
    away_score INT,
    status ENUM('scheduled', 'ongoing', 'finished') NOT NULL DEFAULT 'scheduled',
    FOREIGN KEY (championship_id) REFERENCES championships(id),
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS `groups` (
    id CHAR(36) PRIMARY KEY,
    owner_id CHAR(36) NOT NULL,
    championship_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    invite_code VARCHAR(10) NOT NULL UNIQUE,
    privacy_type ENUM('public', 'private') NOT NULL,
    entry_deadline DATETIME NOT NULL,
    max_members INT NOT NULL,
    entry_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    has_prize BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (championship_id) REFERENCES championships(id)
);

CREATE TABLE IF NOT EXISTS group_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES `groups`(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS group_prizes (
    group_id CHAR(36) PRIMARY KEY,
    first_place_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    second_place_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    third_place_pct DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (group_id) REFERENCES `groups`(id)
);

CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    group_id CHAR(36) NOT NULL,
    match_id INT NOT NULL,
    home_guess INT NOT NULL,
    away_guess INT NOT NULL,
    points_earned INT NOT NULL DEFAULT 0,
    UNIQUE KEY uk_prediction (user_id, group_id, match_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES `groups`(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS wallets (
    user_id CHAR(36) PRIMARY KEY,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id CHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    category ENUM('deposit', 'withdraw', 'prize', 'entry_fee') NOT NULL,
    description VARCHAR(255) NOT NULL,
    FOREIGN KEY (wallet_id) REFERENCES wallets(user_id)
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id CHAR(36) NOT NULL,
    action TEXT NOT NULL,
    executed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS token_blacklist (
    token_hash VARCHAR(255) PRIMARY KEY,
    expires_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS email_confirmation_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
