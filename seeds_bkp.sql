-- Users (senha: admin123 para todos, hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO)
INSERT INTO users (id, name, email, password, created_at, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Master', 'admin@meubolao.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE),
('22222222-2222-2222-2222-222222222222', 'João Silva', 'joao@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE),
('33333333-3333-3333-3333-333333333333', 'Maria Santos', 'maria@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE),
('44444444-4444-4444-4444-444444444444', 'Pedro Costa', 'pedro@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE);

-- Admin
INSERT INTO system_admins (user_id, access_level, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'super_admin', TRUE);

-- Wallets
INSERT INTO wallets (user_id, balance) VALUES
('11111111-1111-1111-1111-111111111111', 1000.00),
('22222222-2222-2222-2222-222222222222', 500.00),
('33333333-3333-3333-3333-333333333333', 250.00),
('44444444-4444-4444-4444-444444444444', 100.00);

-- Championships
INSERT INTO championships (id, title, description, is_active, status) VALUES
(1, 'Brasileirão 2025', 'Campeonato Brasileiro de Futebol 2025', TRUE, 'active'),
(2, 'Copa do Brasil 2025', 'Copa do Brasil de Futebol 2025', TRUE, 'active'),
(3, 'Champions League 2024/25', 'UEFA Champions League 2024/25', TRUE, 'active');

-- Teams
INSERT INTO teams (id, name, badge_url) VALUES
-- Brasileirão / Copa do Brasil
(1, 'Flamengo', 'https://ssl.gstatic.com/onebox/media/sports/logos/orE554NToSkH6nuwofeUSQ_96x96.png'),
(2, 'Palmeiras', 'https://ssl.gstatic.com/onebox/media/sports/logos/7spurne-xDt2p6C0mYSm8Q_96x96.png'),
(3, 'São Paulo', 'https://ssl.gstatic.com/onebox/media/sports/logos/4w2Zcp-zPZ9UBNr3vBfnmg_96x96.png'),
(4, 'Corinthians', 'https://ssl.gstatic.com/onebox/media/sports/logos/tCMSqgXVHROpdCpQhzTo1g_96x96.png'),
(5, 'Fluminense', 'https://ssl.gstatic.com/onebox/media/sports/logos/OWVFKuHrQuf4q2Wk0hEmSA_96x96.png'),
(6, 'Vasco', 'https://ssl.gstatic.com/onebox/media/sports/logos/gOEJrjUWfTVMRPoJxPZNrw_96x96.png'),
(7, 'Grêmio', 'https://ssl.gstatic.com/onebox/media/sports/logos/Ku-73v_TW9kpe-EfaLr8Hw_96x96.png'),
(8, 'Internacional', 'https://ssl.gstatic.com/onebox/media/sports/logos/OWVFKuHrQuf4q2Wk0hEmSA_96x96.png'),
(9, 'Atlético Mineiro', 'https://ssl.gstatic.com/onebox/media/sports/logos/q9fhEsgpuyRq58sK1eDotw_96x96.png'),
(10, 'Botafogo', 'https://ssl.gstatic.com/onebox/media/sports/logos/KLDWYp-H8CAe6WZVf-l1pA_96x96.png'),
(11, 'Red Bull Bragantino', 'https://ssl.gstatic.com/onebox/media/sports/logos/lMyq4KVLKp83P7dS3WnFlw_96x96.png'),
(12, 'Fortaleza', 'https://ssl.gstatic.com/onebox/media/sports/logos/me10epZeRCh3sT1E0dZgkQ_96x96.png'),
(13, 'Athletico Paranaense', 'https://ssl.gstatic.com/onebox/media/sports/logos/-FNcXz_xUO1uIwDqN9Bqhw_96x96.png'),
(14, 'Cruzeiro', 'https://ssl.gstatic.com/onebox/media/sports/logos/5nDWf7kPkmN2qOYrTezQ5Q_96x96.png'),
(15, 'Bahia', 'https://ssl.gstatic.com/onebox/media/sports/logos/nIdbR6qIUDyZUBO9vGAqSg_96x96.png'),
(16, 'Santos', 'https://ssl.gstatic.com/onebox/media/sports/logos/VHdNa6DpQEa1oEO8U2E1uw_96x96.png'),
(17, 'Ceará', 'https://ssl.gstatic.com/onebox/media/sports/logos/88vGdJUYeU4zHxE-_05SMA_96x96.png'),
(18, 'Coritiba', 'https://ssl.gstatic.com/onebox/media/sports/logos/LtpA9v-FA8K2aL9Z7YXqMg_96x96.png'),
(19, 'Goiás', 'https://ssl.gstatic.com/onebox/media/sports/logos/3JmF7a0vMmChvS-I2CpeDw_96x96.png'),
(20, 'Cuiabá', 'https://ssl.gstatic.com/onebox/media/sports/logos/j6NqKbX6_J_GnAqkaEOyHg_96x96.png'),
-- Copa do Brasil extras
(21, 'River Plate', 'https://ssl.gstatic.com/onebox/media/sports/logos/7000eva_SbDccHMnBKG1_w_96x96.png'),
(22, 'Boca Juniors', 'https://ssl.gstatic.com/onebox/media/sports/logos/97KTTLsO9Ua5yLn1frU2Wg_96x96.png'),
(23, 'Racing', 'https://ssl.gstatic.com/onebox/media/sports/logos/wL5XFXUDbJQuFNP1CwJLrw_96x96.png'),
(24, 'Independiente', 'https://ssl.gstatic.com/onebox/media/sports/logos/8kiTdQqdv8t3yQ6t0NggfQ_96x96.png'),
-- Champions League
(101, 'Real Madrid', 'https://ssl.gstatic.com/onebox/media/sports/logos/Th4fAVAZeCJWRcKoLWIfko_96x96.png'),
(102, 'Barcelona', 'https://ssl.gstatic.com/onebox/media/sports/logos/paYnEE8hcrP96neHRNofhQ_96x96.png'),
(103, 'Manchester City', 'https://ssl.gstatic.com/onebox/media/sports/logos/z44l-a0W1v5FmgPnemV6Xw_96x96.png'),
(104, 'Bayern Munich', 'https://ssl.gstatic.com/onebox/media/sports/logos/-_cmntP3q7JLHVX6vQ9Tmg_96x96.png'),
(105, 'Arsenal', 'https://ssl.gstatic.com/onebox/media/sports/logos/4us2nCgl6kgZc0t3hpW75Q_96x96.png'),
(106, 'Liverpool', 'https://ssl.gstatic.com/onebox/media/sports/logos/0iShHhASp5q1SL4JhtwJiw_96x96.png'),
(107, 'Paris Saint-Germain', 'https://ssl.gstatic.com/onebox/media/sports/logos/mSlMYqq2bTJenhfRgpEkbQ_96x96.png'),
(108, 'Inter Milan', 'https://ssl.gstatic.com/onebox/media/sports/logos/l2-icjsMh7Av5Hn_4x6ZWg_96x96.png'),
(109, 'Borussia Dortmund', 'https://ssl.gstatic.com/onebox/media/sports/logos/FZnTSH2rbHFos4BnlWAItw_96x96.png'),
(110, 'Atlético Madrid', 'https://ssl.gstatic.com/onebox/media/sports/logos/srAAE0bMug1lHEFbiTpO0w_96x96.png'),
(111, 'AC Milan', 'https://ssl.gstatic.com/onebox/media/sports/logos/1XH1dJUFxP4TQ8_7mL3IGA_96x96.png'),
(112, 'Napoli', 'https://ssl.gstatic.com/onebox/media/sports/logos/PWAD33ut9x4gq1UBhdmX5w_96x96.png'),
(113, 'RB Leipzig', 'https://ssl.gstatic.com/onebox/media/sports/logos/05A_ikEn8x3sia4bWvr-Gw_96x96.png'),
(114, 'Porto', 'https://ssl.gstatic.com/onebox/media/sports/logos/QPbjv1b0a3iPZM0pRp2Z3Q_96x96.png'),
(115, 'Benfica', 'https://ssl.gstatic.com/onebox/media/sports/logos/3hU5gG4xHqOnUFj1M0SKZQ_96x96.png'),
(116, 'Juventus', 'https://ssl.gstatic.com/onebox/media/sports/logos/LIv6hb3Y_6CCAq6HR0sQ7w_96x96.png');

-- Championship Teams
-- Brasileirão (20 times)
INSERT INTO championship_teams (championship_id, team_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
(1, 9), (1, 10), (1, 11), (1, 12), (1, 13), (1, 14), (1, 15), (1, 16),
(1, 17), (1, 18), (1, 19), (1, 20);

-- Copa do Brasil (24 times)
INSERT INTO championship_teams (championship_id, team_id) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8),
(2, 9), (2, 10), (2, 11), (2, 12), (2, 13), (2, 14), (2, 15), (2, 16),
(2, 21), (2, 22), (2, 23), (2, 24);

-- Champions League (16 times)
INSERT INTO championship_teams (championship_id, team_id) VALUES
(3, 101), (3, 102), (3, 103), (3, 104), (3, 105), (3, 106), (3, 107), (3, 108),
(3, 109), (3, 110), (3, 111), (3, 112), (3, 113), (3, 114), (3, 115), (3, 116);

-- Matches - Brasileirão 2025
INSERT INTO matches (id, championship_id, home_team_id, away_team_id, match_date, home_score, away_score, status) VALUES
(1, 1, 1, 2, '2025-04-05 16:00:00', 2, 1, 'finished'),
(2, 1, 3, 4, '2025-04-05 18:30:00', 0, 0, 'finished'),
(3, 1, 5, 6, '2025-04-06 16:00:00', 3, 2, 'finished'),
(4, 1, 7, 8, '2025-04-06 18:30:00', 1, 1, 'finished'),
(5, 1, 9, 10, '2025-04-12 16:00:00', 2, 0, 'finished'),
(6, 1, 11, 12, '2025-04-12 18:30:00', 1, 2, 'finished'),
(7, 1, 13, 14, '2025-04-13 16:00:00', 0, 1, 'finished'),
(8, 1, 15, 16, '2025-04-13 18:30:00', 2, 2, 'finished'),
(9, 1, 2, 5, '2025-04-19 16:00:00', 1, 0, 'finished'),
(10, 1, 4, 1, '2025-04-19 18:30:00', 1, 3, 'finished'),
(11, 1, 6, 7, '2025-04-20 16:00:00', 0, 2, 'finished'),
(12, 1, 8, 3, '2025-04-20 18:30:00', 1, 1, 'finished'),
(13, 1, 10, 11, '2025-04-26 16:00:00', 2, 1, 'finished'),
(14, 1, 12, 9, '2025-04-26 18:30:00', 1, 1, 'finished'),
(15, 1, 14, 15, '2025-04-27 16:00:00', 2, 0, 'finished'),
(16, 1, 16, 13, '2025-04-27 18:30:00', 0, 1, 'finished'),
(17, 1, 1, 6, '2025-05-03 16:00:00', 3, 1, 'finished'),
(18, 1, 3, 5, '2025-05-03 18:30:00', 2, 2, 'finished'),
(19, 1, 2, 7, '2025-05-04 16:00:00', 1, 0, 'finished'),
(20, 1, 4, 8, '2025-05-04 18:30:00', 0, 0, 'finished'),
(21, 1, 9, 16, '2025-05-10 16:00:00', NULL, NULL, 'scheduled'),
(22, 1, 11, 14, '2025-05-10 18:30:00', NULL, NULL, 'scheduled'),
(23, 1, 13, 12, '2025-05-11 16:00:00', NULL, NULL, 'scheduled'),
(24, 1, 15, 10, '2025-05-11 18:30:00', NULL, NULL, 'scheduled'),
(25, 1, 1, 9, '2025-05-17 16:00:00', NULL, NULL, 'scheduled'),
(26, 1, 3, 11, '2025-05-17 18:30:00', NULL, NULL, 'scheduled'),
(27, 1, 5, 13, '2025-05-18 16:00:00', NULL, NULL, 'scheduled'),
(28, 1, 7, 15, '2025-05-18 18:30:00', NULL, NULL, 'scheduled');

-- Matches - Copa do Brasil 2025
INSERT INTO matches (id, championship_id, home_team_id, away_team_id, match_date, home_score, away_score, status) VALUES
(101, 2, 1, 3, '2025-03-01 21:30:00', 2, 1, 'finished'),
(102, 2, 2, 4, '2025-03-02 21:30:00', 1, 0, 'finished'),
(103, 2, 5, 7, '2025-03-05 21:30:00', 0, 0, 'finished'),
(104, 2, 6, 8, '2025-03-06 21:30:00', 1, 2, 'finished'),
(105, 2, 9, 11, '2025-03-12 21:30:00', 2, 2, 'finished'),
(106, 2, 10, 12, '2025-03-13 21:30:00', 1, 0, 'finished'),
(107, 2, 13, 15, '2025-03-19 21:30:00', 3, 1, 'finished'),
(108, 2, 14, 16, '2025-03-20 21:30:00', 0, 1, 'finished'),
(109, 2, 3, 1, '2025-04-02 21:30:00', 1, 1, 'finished'),
(110, 2, 4, 2, '2025-04-03 21:30:00', 0, 2, 'finished'),
(111, 2, 21, 22, '2025-04-09 21:30:00', 2, 0, 'finished'),
(112, 2, 23, 24, '2025-04-10 21:30:00', 1, 1, 'finished'),
(113, 2, 1, 21, '2025-05-14 21:30:00', NULL, NULL, 'scheduled'),
(114, 2, 2, 23, '2025-05-15 21:30:00', NULL, NULL, 'scheduled'),
(115, 2, 5, 9, '2025-05-21 21:30:00', NULL, NULL, 'scheduled'),
(116, 2, 10, 14, '2025-05-22 21:30:00', NULL, NULL, 'scheduled');

-- Matches - Champions League 2024/25
INSERT INTO matches (id, championship_id, home_team_id, away_team_id, match_date, home_score, away_score, status) VALUES
(201, 3, 101, 102, '2024-10-26 16:00:00', 2, 5, 'finished'),
(202, 3, 103, 104, '2024-10-26 16:00:00', 1, 4, 'finished'),
(203, 3, 105, 106, '2024-10-23 16:00:00', 2, 2, 'finished'),
(204, 3, 107, 108, '2024-10-23 16:00:00', 0, 1, 'finished'),
(205, 3, 109, 110, '2024-10-22 16:00:00', 1, 2, 'finished'),
(206, 3, 111, 112, '2024-10-22 16:00:00', 0, 0, 'finished'),
(207, 3, 113, 114, '2024-10-23 16:00:00', 3, 2, 'finished'),
(208, 3, 115, 116, '2024-10-22 16:00:00', 4, 3, 'finished'),
(209, 3, 102, 101, '2024-11-05 16:00:00', 1, 2, 'finished'),
(210, 3, 104, 103, '2024-11-06 16:00:00', 1, 0, 'finished'),
(211, 3, 106, 105, '2024-11-05 16:00:00', 2, 0, 'finished'),
(212, 3, 108, 107, '2024-11-06 16:00:00', 3, 3, 'finished'),
(213, 3, 110, 109, '2024-11-05 16:00:00', 2, 1, 'finished'),
(214, 3, 112, 111, '2024-11-06 16:00:00', 1, 1, 'finished'),
(215, 3, 114, 113, '2024-11-05 16:00:00', 0, 0, 'finished'),
(216, 3, 116, 115, '2024-11-06 16:00:00', 2, 3, 'finished'),
(217, 3, 101, 103, '2025-02-19 16:00:00', 2, 1, 'finished'),
(218, 3, 104, 105, '2025-02-19 16:00:00', 3, 0, 'finished'),
(219, 3, 108, 102, '2025-02-18 16:00:00', 1, 0, 'finished'),
(220, 3, 106, 110, '2025-02-18 16:00:00', 2, 2, 'finished'),
(221, 3, 111, 114, '2025-05-28 16:00:00', NULL, NULL, 'scheduled'),
(222, 3, 115, 113, '2025-05-28 16:00:00', NULL, NULL, 'scheduled');

-- Groups
INSERT INTO `groups` (id, owner_id, championship_id, title, invite_code, privacy_type, entry_deadline, max_members, entry_fee, has_prize, is_active) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 1, 'Bolão dos Amigos', 'ABC123', 'public', '2025-12-31 23:59:59', 20, 10.00, TRUE, TRUE),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 1, 'Bolão da Firma', 'XYZ789', 'private', '2025-12-31 23:59:59', 10, 20.00, TRUE, TRUE),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 3, 'Champions League BR', 'CHAMP01', 'public', '2025-12-31 23:59:59', 50, 5.00, TRUE, TRUE);

-- Group Prizes
INSERT INTO group_prizes (group_id, first_place_pct, second_place_pct, third_place_pct) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50.00, 30.00, 20.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 60.00, 25.00, 15.00),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 50.00, 30.00, 20.00);

-- Group Members
INSERT INTO group_members (group_id, user_id, paid, joined_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', TRUE, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', TRUE, NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', FALSE, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', TRUE, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', TRUE, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', TRUE, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', TRUE, NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', TRUE, NOW());

-- Predictions
INSERT INTO predictions (user_id, group_id, match_id, home_guess, away_guess, points_earned) VALUES
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 2, 1, 10),
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 1, 1, 7),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 1, 2, 5),
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 2, 1, 2),
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 2, 0, 0),
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 21, 1, 1, 0),
('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 21, 2, 0, 0),
('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 217, 1, 1, 5),
('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 218, 0, 2, 5),
('44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 219, 0, 1, 7);
