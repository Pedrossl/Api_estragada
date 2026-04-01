import db from "../database/db.js";

async function listar(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT missoes.*,
             pilotos.nome AS piloto,
             naves.nome   AS nave,
             planetas.nome AS planeta
      FROM missoes
      JOIN pilotos  ON missoes.piloto_id  = pilotos.id
      JOIN naves    ON missoes.nave_id    = naves.id
      JOIN planetas ON missoes.planeta_id = planetas.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar missões", detalhe: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT missoes.*,
             pilotos.nome AS piloto,
             naves.nome   AS nave,
             planetas.nome AS planeta
      FROM missoes
      JOIN pilotos  ON missoes.piloto_id  = pilotos.id
      JOIN naves    ON missoes.nave_id    = naves.id
      JOIN planetas ON missoes.planeta_id = planetas.id
      WHERE missoes.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Missão não encontrada" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar missão", detalhe: err.message });
  }
}

async function criar(req, res) {
  try {
    const { titulo, tipo, nave_id, piloto_id, planeta_id, carga_kg, data_partida } = req.body;

    if (!titulo || !tipo || !nave_id || !piloto_id || !planeta_id || !data_partida) {
      return res.status(400).json({ erro: "Campos titulo, tipo, nave_id, piloto_id, planeta_id e data_partida são obrigatórios" });
    }

    // Regra: piloto deve estar ativo
    const [[piloto]] = await db.query("SELECT status FROM pilotos WHERE id = ?", [piloto_id]);
    if (!piloto) return res.status(404).json({ erro: "Piloto não encontrado" });
    if (piloto.status !== "ativo") {
      return res.status(422).json({ erro: "Piloto não está ativo e não pode ser designado a uma missão" });
    }

    // Regra: nave deve estar ativa
    const [[nave]] = await db.query("SELECT status, capacidade_carga FROM naves WHERE id = ?", [nave_id]);
    if (!nave) return res.status(404).json({ erro: "Nave não encontrada" });
    if (nave.status !== "ativa") {
      return res.status(422).json({ erro: `Nave não está disponível (status: ${nave.status})` });
    }

    // Regra: carga não pode exceder capacidade da nave
    const carga = carga_kg ?? 0;
    if (carga > nave.capacidade_carga) {
      return res.status(422).json({
        erro: `Carga (${carga}kg) excede a capacidade da nave (${nave.capacidade_carga}kg)`,
      });
    }

    // Regra: missão de transporte só pode ir a planeta habitável
    const [[planeta]] = await db.query("SELECT habitavel FROM planetas WHERE id = ?", [planeta_id]);
    if (!planeta) return res.status(404).json({ erro: "Planeta não encontrado" });
    if (tipo === "transporte" && !planeta.habitavel) {
      return res.status(422).json({ erro: "Missões de transporte só podem ter como destino planetas habitáveis" });
    }

    const [result] = await db.query(
      "INSERT INTO missoes (titulo, tipo, nave_id, piloto_id, planeta_id, carga_kg, data_partida) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [titulo, tipo, nave_id, piloto_id, planeta_id, carga, data_partida]
    );
    res.status(201).json({ id: result.insertId, titulo, tipo, nave_id, piloto_id, planeta_id, carga_kg: carga, data_partida });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar missão", detalhe: err.message });
  }
}

async function atualizarStatus(req, res) {
  try {
    const { status } = req.body;
    const statusValidos = ["planejada", "em_andamento", "concluida", "cancelada"];

    if (!status) return res.status(400).json({ erro: "Campo status é obrigatório" });
    if (!statusValidos.includes(status)) {
      return res.status(400).json({ erro: `Status inválido. Use: ${statusValidos.join(", ")}` });
    }

    // Regra: missão concluída ou cancelada não pode ser reaberta
    const [[missao]] = await db.query("SELECT status FROM missoes WHERE id = ?", [req.params.id]);
    if (!missao) return res.status(404).json({ erro: "Missão não encontrada" });
    if (["concluida", "cancelada"].includes(missao.status)) {
      return res.status(422).json({ erro: `Missão já está ${missao.status} e não pode ser alterada` });
    }

    await db.query("UPDATE missoes SET status = ? WHERE id = ?", [status, req.params.id]);
    res.json({ id: req.params.id, status });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar missão", detalhe: err.message });
  }
}

async function remover(req, res) {
  try {
    // Regra: só pode excluir missão que ainda não saiu
    const [[missao]] = await db.query("SELECT status FROM missoes WHERE id = ?", [req.params.id]);
    if (!missao) return res.status(404).json({ erro: "Missão não encontrada" });
    if (missao.status === "em_andamento") {
      return res.status(422).json({ erro: "Não é possível excluir uma missão em andamento" });
    }

    await db.query("DELETE FROM missoes WHERE id = ?", [req.params.id]);
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover missão", detalhe: err.message });
  }
}

export { listar, buscarPorId, criar, atualizarStatus, remover };
