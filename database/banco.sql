CREATE DATABASE IF NOT EXISTS navesdb;
USE navesdb;

CREATE TABLE pilotos (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  nome      VARCHAR(100) NOT NULL,
  patente   VARCHAR(50)  NOT NULL,
  status    VARCHAR(20)  NOT NULL DEFAULT 'ativo',
  horas_voo INT          NOT NULL DEFAULT 0
);

CREATE TABLE planetas (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  nome      VARCHAR(100) NOT NULL,
  galaxia   VARCHAR(100) NOT NULL,
  habitavel TINYINT(1)   NOT NULL DEFAULT 1
);

CREATE TABLE naves (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  nome             VARCHAR(100) NOT NULL,
  modelo           VARCHAR(100) NOT NULL,
  status           VARCHAR(20)  NOT NULL DEFAULT 'ativa',
  capacidade_carga INT          NOT NULL DEFAULT 1000,
  piloto_id        INT,
  FOREIGN KEY (piloto_id) REFERENCES pilotos(id)
);

CREATE TABLE missoes (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  titulo       VARCHAR(150) NOT NULL,
  tipo         VARCHAR(50)  NOT NULL,
  status       VARCHAR(20)  NOT NULL DEFAULT 'planejada',
  nave_id      INT          NOT NULL,
  piloto_id    INT          NOT NULL,
  planeta_id   INT          NOT NULL,
  carga_kg     INT          NOT NULL DEFAULT 0,
  data_partida DATE         NOT NULL,
  FOREIGN KEY (nave_id)   REFERENCES naves(id),
  FOREIGN KEY (piloto_id) REFERENCES pilotos(id),
  FOREIGN KEY (planeta_id) REFERENCES planetas(id)
);

-- ── DADOS DE EXEMPLO ───────────────────────────────────────────────────────────

INSERT INTO pilotos (nome, patente, status, horas_voo) VALUES
  ('Han Solo',      'Comandante', 'ativo',   8500),
  ('Rey Skywalker', 'Capitão',    'ativo',   3200),
  ('Poe Dameron',   'Tenente',    'inativo', 5100);

INSERT INTO planetas (nome, galaxia, habitavel) VALUES
  ('Tatooine',  'Via Láctea', 1),
  ('Coruscant', 'Via Láctea', 1),
  ('Hoth',      'Via Láctea', 0);

INSERT INTO naves (nome, modelo, status, capacidade_carga, piloto_id) VALUES
  ('Millennium Falcon', 'YT-1300', 'ativa',      5000, 1),
  ('X-Wing T-70',       'T-70',    'ativa',      1000, 2),
  ('Black One',         'T-70',    'manutencao', 1000, 3);

INSERT INTO missoes (titulo, tipo, status, nave_id, piloto_id, planeta_id, carga_kg, data_partida) VALUES
  ('Entrega em Tatooine',  'transporte', 'concluida',    1, 1, 1, 2000, '2024-01-10'),
  ('Exploração em Hoth',   'exploracao', 'em_andamento', 2, 2, 3,    0, '2024-06-01'),
  ('Resgate em Coruscant', 'resgate',    'planejada',    1, 1, 2,    0, '2024-12-01');
