-- Users (senha: admin123 para todos, hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO)
INSERT INTO users (id, name, email, password, created_at, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Admin Master',  'admin@palpitearena.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE),
('22222222-2222-2222-2222-222222222222', 'João Silva',    'joao@email.com',          '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE),
('33333333-3333-3333-3333-333333333333', 'Maria Santos',  'maria@email.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE),
('44444444-4444-4444-4444-444444444444', 'Pedro Costa',   'pedro@email.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqQzBZN0UfGNEsKYGs5vE2M4ZL/WO', NOW(), TRUE);

-- Admin
INSERT INTO system_admins (user_id, access_level, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'super_admin', TRUE);

-- Wallets
INSERT INTO wallets (user_id, balance) VALUES
('11111111-1111-1111-1111-111111111111', 1000.00),
('22222222-2222-2222-2222-222222222222',  500.00),
('33333333-3333-3333-3333-333333333333',  250.00),
('44444444-4444-4444-4444-444444444444',  100.00);

-- Championships
INSERT INTO championships (id, title, description, is_active, status) VALUES
(1, 'Copa do Mundo FIFA 2026', 'Copa do Mundo FIFA 2026 — EUA, Canadá e México', TRUE, 'active');

-- Teams
-- Grupo A: Brasil, Croácia, México, Japão
-- Grupo B: Argentina, Uruguai, EUA, Marrocos
-- Grupo C: França, Bélgica, Portugal, Sérvia
-- Grupo D: Espanha, Holanda, Alemanha, Inglaterra
INSERT INTO teams (id, name, badge_url) VALUES
(1,  'Brasil',         'https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg'),
(2,  'Croácia',        'https://upload.wikimedia.org/wikipedia/commons/1/1b/Flag_of_Croatia.svg'),
(3,  'México',         'https://upload.wikimedia.org/wikipedia/commons/f/fc/Flag_of_Mexico.svg'),
(4,  'Japão',          'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg'),
(5,  'Argentina',      'https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg'),
(6,  'Uruguai',        'https://upload.wikimedia.org/wikipedia/commons/f/fe/Flag_of_Uruguay.svg'),
(7,  'Estados Unidos', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Flag_of_the_United_States.svg'),
(8,  'Marrocos',       'https://upload.wikimedia.org/wikipedia/commons/2/2c/Flag_of_Morocco.svg'),
(9,  'França',         'https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg'),
(10, 'Bélgica',        'https://upload.wikimedia.org/wikipedia/commons/6/65/Flag_of_Belgium.svg'),
(11, 'Portugal',       'https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg'),
(12, 'Sérvia',         'https://upload.wikimedia.org/wikipedia/commons/f/ff/Flag_of_Serbia.svg'),
(13, 'Espanha',        'https://upload.wikimedia.org/wikipedia/commons/9/9a/Flag_of_Spain.svg'),
(14, 'Holanda',        'https://upload.wikimedia.org/wikipedia/commons/2/20/Flag_of_the_Netherlands.svg'),
(15, 'Alemanha',       'https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg'),
(16, 'Inglaterra',     'https://upload.wikimedia.org/wikipedia/commons/b/be/Flag_of_England.svg');

-- Championship Teams — Copa do Mundo FIFA 2026 (16 seleções)
INSERT INTO championship_teams (championship_id, team_id) VALUES
(1,  1), (1,  2), (1,  3), (1,  4),
(1,  5), (1,  6), (1,  7), (1,  8),
(1,  9), (1, 10), (1, 11), (1, 12),
(1, 13), (1, 14), (1, 15), (1, 16);

-- Matches — Copa do Mundo FIFA 2026
-- Fase de Grupos
--   Grupo A: Brasil(1) Croácia(2) México(3) Japão(4)
--   Grupo B: Argentina(5) Uruguai(6) EUA(7) Marrocos(8)
--   Grupo C: França(9) Bélgica(10) Portugal(11) Sérvia(12)
--   Grupo D: Espanha(13) Holanda(14) Alemanha(15) Inglaterra(16)
INSERT INTO matches (id, championship_id, home_team_id, away_team_id, match_date, home_score, away_score, status) VALUES
-- Grupo A (rodada 1)
(1,  1,  1,  2, '2026-06-11 16:00:00',  2, 0, 'finished'),  -- Brasil 2-0 Croácia
(2,  1,  3,  4, '2026-06-11 20:00:00',  1, 1, 'finished'),  -- México 1-1 Japão
-- Grupo B (rodada 1)
(3,  1,  5,  7, '2026-06-12 16:00:00',  2, 0, 'finished'),  -- Argentina 2-0 EUA
(4,  1,  6,  8, '2026-06-12 20:00:00',  1, 0, 'finished'),  -- Uruguai 1-0 Marrocos
-- Grupo C (rodada 1)
(5,  1,  9, 12, '2026-06-13 16:00:00',  2, 0, 'finished'),  -- França 2-0 Sérvia
(6,  1, 10, 11, '2026-06-13 20:00:00',  1, 2, 'finished'),  -- Bélgica 1-2 Portugal
-- Grupo D (rodada 1)
(7,  1, 13, 14, '2026-06-14 16:00:00',  2, 1, 'finished'),  -- Espanha 2-1 Holanda
(8,  1, 15, 16, '2026-06-14 20:00:00',  0, 0, 'finished'),  -- Alemanha 0-0 Inglaterra
-- Grupo A (rodada 2)
(9,  1,  1,  3, '2026-06-15 16:00:00',  3, 0, 'finished'),  -- Brasil 3-0 México
(10, 1,  2,  4, '2026-06-15 20:00:00',  2, 1, 'finished'),  -- Croácia 2-1 Japão
-- Grupo B (rodada 2)
(11, 1,  5,  6, '2026-06-16 16:00:00',  1, 1, 'finished'),  -- Argentina 1-1 Uruguai
(12, 1,  7,  8, '2026-06-16 20:00:00',  2, 1, 'finished'),  -- EUA 2-1 Marrocos
-- Grupo C (rodada 2)
(13, 1,  9, 10, '2026-06-17 16:00:00',  1, 0, 'finished'),  -- França 1-0 Bélgica
(14, 1, 11, 12, '2026-06-17 20:00:00',  3, 0, 'finished'),  -- Portugal 3-0 Sérvia
-- Grupo D (rodada 2)
(15, 1, 13, 15, '2026-06-18 16:00:00', NULL, NULL, 'scheduled'),  -- Espanha x Alemanha
(16, 1, 14, 16, '2026-06-18 20:00:00', NULL, NULL, 'scheduled'),  -- Holanda x Inglaterra
-- Grupo A (rodada 3 — simultâneas)
(17, 1,  1,  4, '2026-06-19 20:00:00', NULL, NULL, 'scheduled'),  -- Brasil x Japão
(18, 1,  2,  3, '2026-06-19 20:00:00', NULL, NULL, 'scheduled'),  -- Croácia x México
-- Grupo B (rodada 3 — simultâneas)
(19, 1,  5,  8, '2026-06-20 20:00:00', NULL, NULL, 'scheduled'),  -- Argentina x Marrocos
(20, 1,  6,  7, '2026-06-20 20:00:00', NULL, NULL, 'scheduled'),  -- Uruguai x EUA
-- Grupo C (rodada 3 — simultâneas)
(21, 1,  9, 11, '2026-06-21 20:00:00', NULL, NULL, 'scheduled'),  -- França x Portugal
(22, 1, 10, 12, '2026-06-21 20:00:00', NULL, NULL, 'scheduled'),  -- Bélgica x Sérvia
-- Grupo D (rodada 3 — simultâneas)
(23, 1, 13, 16, '2026-06-22 20:00:00', NULL, NULL, 'scheduled'),  -- Espanha x Inglaterra
(24, 1, 14, 15, '2026-06-22 20:00:00', NULL, NULL, 'scheduled'),  -- Holanda x Alemanha
-- Oitavas de Final
(25, 1,  1,  6, '2026-06-26 16:00:00', NULL, NULL, 'scheduled'),  -- 1ºA (Brasil) x 2ºB (Uruguai)
(26, 1,  5,  2, '2026-06-26 20:00:00', NULL, NULL, 'scheduled'),  -- 1ºB (Argentina) x 2ºA (Croácia)
(27, 1,  9, 14, '2026-06-27 16:00:00', NULL, NULL, 'scheduled'),  -- 1ºC (França) x 2ºD (Holanda)
(28, 1, 13, 11, '2026-06-27 20:00:00', NULL, NULL, 'scheduled');  -- 1ºD (Espanha) x 2ºC (Portugal)

-- Groups
INSERT INTO `groups` (id, owner_id, championship_id, title, invite_code, privacy_type, entry_deadline, max_members, entry_fee, has_prize, is_active) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 1, 'Bolão dos Amigos', 'ABC123',  'public',  '2026-06-10 23:59:59', 20, 10.00, TRUE, TRUE),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 1, 'Bolão da Firma',   'XYZ789',  'private', '2026-06-10 23:59:59', 10, 20.00, TRUE, TRUE),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 1, 'Copa do Mundo BR', 'WORLD26', 'public',  '2026-06-10 23:59:59', 50,  5.00, TRUE, TRUE);

-- Group Prizes
INSERT INTO group_prizes (group_id, first_place_pct, second_place_pct, third_place_pct) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 50.00, 30.00, 20.00),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 60.00, 25.00, 15.00),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 50.00, 30.00, 20.00);

-- Group Members
INSERT INTO group_members (group_id, user_id, paid, joined_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', TRUE,  NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', TRUE,  NOW()),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', FALSE, NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', TRUE,  NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', TRUE,  NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', TRUE,  NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333', TRUE,  NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', TRUE,  NOW());

-- Predictions
-- Resultado dos jogos finalizados:
--   match 1:  Brasil 2-0 Croácia
--   match 2:  México 1-1 Japão
--   match 3:  Argentina 2-0 EUA
--   match 4:  Uruguai 1-0 Marrocos
--   match 5:  França 2-0 Sérvia
--   match 6:  Bélgica 1-2 Portugal
--   match 7:  Espanha 2-1 Holanda
--   match 8:  Alemanha 0-0 Inglaterra
--   match 9:  Brasil 3-0 México
--   match 10: Croácia 2-1 Japão
--   match 11: Argentina 1-1 Uruguai
--   match 12: EUA 2-1 Marrocos
--   match 13: França 1-0 Bélgica
--   match 14: Portugal 3-0 Sérvia
INSERT INTO predictions (user_id, group_id, match_id, home_guess, away_guess, points_earned) VALUES
-- Bolão dos Amigos (aaaa) — Grupo A
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',  1, 2, 0, 10),  -- Brasil 2-0: palpite exato = 10pts
('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',  2, 0, 0,  7),  -- México 1-1: palpite 0-0 (empate, mesma diferença) = 7pts
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',  1, 1, 0,  5),  -- Brasil 2-0: palpite 1-0 (vencedor certo) = 5pts
('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',  9, 3, 1,  2),  -- Brasil 3-0: palpite 3-1 (1 placar certo) = 2pts
('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',  1, 0, 1,  0),  -- Brasil 2-0: palpite 0-1 (errado) = 0pts
-- Bolão da Firma (bbbb) — jogo ainda não disputado
('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 17, 2, 0,  0),  -- Brasil x Japão (scheduled)
('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 17, 1, 0,  0),  -- Brasil x Japão (scheduled)
-- Copa do Mundo BR (cccc) — Grupos B e C
('22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc',  3, 3, 1,  7),  -- Argentina 2-0: palpite 3-1 (vencedor + mesma diferença) = 7pts
('33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 11, 1, 1, 10),  -- Argentina 1-1: palpite exato 1-1 = 10pts
('44444444-4444-4444-4444-444444444444', 'cccccccc-cccc-cccc-cccc-cccccccccccc',  6, 1, 2, 10);  -- Bélgica 1-2 Portugal: palpite exato 1-2 = 10pts
