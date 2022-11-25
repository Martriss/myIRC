CREATE TABLE IF NOT EXISTS users (
    user_id int NOT NULL AUTO_INCREMENT,
    name varchar(9) NOT NULL UNIQUE,
    password varchar(200) NOT NULL,
    isAdmin tinyint DEFAULT 0,
    created_at timestamp,
    PRIMARY KEY(user_id)
);

CREATE TABLE IF NOT EXISTS conversations (
    conv_id int NOT NULL AUTO_INCREMENT,
    conv_name varchar(200) NOT NULL UNIQUE,
    created_at timestamp NOT NULL,
    PRIMARY KEY(conv_id)
);

INSERT INTO conversations (conv_name, created_at)
SELECT * FROM (SELECT '#main' as conv_name, CURRENT_TIMESTAMP() AS created_at) AS new_value
WHERE NOT EXISTS (
 SELECT conv_name FROM conversations WHERE conv_name = '#main'
) LIMIT 1;

CREATE TABLE IF NOT EXISTS messages (
    msg_id int NOT NULL AUTO_INCREMENT,
    content varchar(510) NOT NULL,
    send_at timestamp NOT NULL,
    user_id int NOT NULL,
    conv_id int NOT NULL,
    PRIMARY KEY(msg_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (conv_id) REFERENCES conversations(conv_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS connections (
    connect_id int NOT NULL AUTO_INCREMENT,
    connected_at timestamp NOT NULL,
    disconnected_at timestamp,
    user_id int NOT NULL,
    conv_id int NOT NULL,
    PRIMARY KEY(connect_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (conv_id) REFERENCES conversations(conv_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bans (
    ban_id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    admin_id int NOT NULL,
    reason varchar(510),
    banned_at timestamp NOT NULL,
    unbanned_at timestamp NOT NULL,
    PRIMARY KEY(ban_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
);
