-- Users (senha: admin123 para todos, hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO)
INSERT INTO users (id, name, email, phone, document, password, created_at, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Master', 'admin@palpitearena.com', '11999999999', '12345678900', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE),
('22222222-2222-2222-2222-222222222222', 'João Silva', 'joao@email.com', '11988888888', '98765432100', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE),
('33333333-3333-3333-3333-333333333333', 'Maria Santos', 'maria@email.com', '11977777777', '45678912300', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE),
('44444444-4444-4444-4444-444444444444', 'Pedro Costa', 'pedro@email.com', '11966666666', '78912345600', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE);

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
(5, 'Internacional', 'https://ssl.gstatic.com/onebox/media/sports/logos/OWVFKuHrQuf4q2Wk0hEmSA_96x96.png'),
(6, 'Grêmio', 'https://ssl.gstatic.com/onebox/media/sports/logos/Ku-73v_TW9kpex-IEGb0ZA_96x96.png'),
(7, 'Atlético Mineiro', 'https://ssl.gstatic.com/onebox/media/sports/logos/qThLvL2ZK1XChRSxLRMFUA_96x96.png'),
(8, 'Fluminense', 'https://ssl.gstatic.com/onebox/media/sports/logos/b7XlC42l0WDL3XAIKjqMOQ_96x96.png'),
(9, 'Botafogo', 'https://ssl.gstatic.com/onebox/media/sports/logos/0fRyoOO2L2Q0ITC9q-HUEQ_96x96.png'),
(10, 'Vasco da Gama', 'https://ssl.gstatic.com/onebox/media/sports/logos/SrKK6dqG5qF52VD9GfvtJw_96x96.png'),
-- Champions League
(11, 'Real Madrid', 'https://ssl.gstatic.com/onebox/media/sports/logos/Th4fAVAZeCJWRcKoLWInsg_96x96.png'),
(12, 'Manchester City', 'https://ssl.gstatic.com/onebox/media/sports/logos/z44l-a0W1v5FmgPnemV6Xw_96x96.png'),
(13, 'Bayern Munich', 'https://ssl.gstatic.com/onebox/media/sports/logos/-_cmntP5q_pHL7g5LFKRuw_96x96.png'),
(14, 'Barcelona', 'https://ssl.gstatic.com/onebox/media/sports/logos/paYnEE8hcrP96neHRNofhQ_96x96.png');

-- Championship Teams
INSERT INTO championship_teams (championship_id, team_id) VALUES
-- Brasileirão
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
-- Copa do Brasil
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8),
-- Champions League
(3, 11), (3, 12), (3, 13), (3, 14);

-- Matches
INSERT INTO matches (id, championship_id, home_team_id, away_team_id, match_date, status) VALUES
-- Brasileirão - Rodada 1
(1, 1, 1, 2, '2025-06-15 16:00:00', 'scheduled'),
(2, 1, 3, 4, '2025-06-15 18:30:00', 'scheduled'),
(3, 1, 5, 6, '2025-06-16 20:00:00', 'scheduled'),
(4, 1, 7, 8, '2025-06-16 21:30:00', 'scheduled'),
(5, 1, 9, 10, '2025-06-17 19:00:00', 'scheduled'),
-- Copa do Brasil - Oitavas
(6, 2, 1, 3, '2025-06-20 21:00:00', 'scheduled'),
(7, 2, 2, 4, '2025-06-21 16:00:00', 'scheduled'),
-- Champions League - Semifinal
(8, 3, 11, 12, '2025-06-25 15:45:00', 'scheduled'),
(9, 3, 13, 14, '2025-06-26 15:45:00', 'scheduled');

-- Groups
INSERT INTO `groups` (id, owner_id, championship_id, title, invite_code, privacy_type, entry_deadline, max_members, entry_fee, has_prize, is_active) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 1, 'Bolão dos Amigos', 'AMIGOS123', 'public', '2025-06-14 23:59:59', 20, 10.00, TRUE, TRUE),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 1, 'Bolão do Trabalho', 'TRABALHO1', 'private', '2025-06-14 23:59:59', 15, 5.00, TRUE, TRUE),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', 3, 'Champions Premium', 'CHAMPIONS', 'public', '2025-06-20 23:59:59', 10, 20.00, TRUE, TRUE);

-- Group Prizes
INSERT INTO group_prizes (group_id, first_place_pct, second_place_pct, third_place_pct) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50.00, 30.00, 20.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 60.00, 40.00, 0.00),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 70.00, 20.00, 10.00);

-- Group Members
INSERT INTO group_members (group_id, user_id, paid) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', FALSE),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', TRUE),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', TRUE),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', TRUE),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', TRUE);

-- Predictions (exemplo com resultados variados)
INSERT INTO predictions (id, user_id, group_id, match_id, home_guess, away_guess) VALUES
(1, '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 2, 1),
(2, '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 1, 1),
(3, '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 3, 0),
(4, '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 1, 0),
(5, '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 2, 2, 1),
(6, '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 6, 2, 2),
(7, '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 6, 1, 0);
