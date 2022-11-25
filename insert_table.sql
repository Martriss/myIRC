INSERT INTO users (name, password, created_at)
    VALUES
        ('user', 'user', CURRENT_TIMESTAMP());

INSERT INTO users (name, password, isAdmin, created_at)
    VALUES
        ('admin', 'admin', 1, CURRENT_TIMESTAMP());

INSERT INTO conversations (conv_name, created_at)
    VALUES
        ('fake', CURRENT_TIMESTAMP()),
        ('info', CURRENT_TIMESTAMP());

INSERT INTO messages (content, send_at, user_id, conv_id)
    VALUES 
        ('Salut !', CURRENT_TIMESTAMP(), 1, 1),
        ('Bonjour', CURRENT_TIMESTAMP(), 2, 1),
        ('Hola', '2022-11-16 10:32:28', 1, 2),
        ('Halo', '2022-11-16 10:35:47', 2, 2),
        ('Buenos dias', '2022-11-16 14:04:13', 1, 1),
        ('Ave', '2022-11-16 14:06:32', 1, 1),
        ('Oh oh', '2022-11-16 13:07:32', 1, 3),
        ('Na', '2022-11-16 14:06:32', 1, 3),
        ('AAAAAAAAAAAAAAAAAAAAAAAA', '2022-11-16 12:06:32', 2, 3);

INSERT INTO connections (connected_at, disconnected_at, user_id, conv_id)
    VALUES
        (CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() + 2, 1, 1),
        ('2022-11-16 09:07:32', '2022-11-17 13:07:32', 1, 2);