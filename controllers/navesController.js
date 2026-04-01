import db from "../database/db.js";

const SELECT_JOIN = `
  SELECT naves.*, pilotos.nome AS piloto
  FROM naves
  LEFT JOIN pilotos ON naves.piloto_id = pilotos.id
`;

async function listar(req, res) {
  try {
    const [rows] = await db.query(SELECT_JOIN);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar naves", detalhe: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const [rows] = await db.query(`${SELECT_JOIN} WHERE naves.id = ?`, [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ erro: "Nave não encontrada" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar nave", detalhe: err.message });
  }
}

async function criar(req, res) {
  try {
    const { nome, modelo, piloto_id } = req.body;
    if (!nome || !modelo) {
      return res.status(400).json({ erro: "Campos nome e modelo são obrigatórios" });
    }

    // Regra: piloto designado deve estar ativo
    if (piloto_id) {
      const [[piloto]] = await db.query("SELECT status FROM pilotos WHERE id = ?", [piloto_id]);
      if (!piloto) {
        return res.status(404).json({ erro: "Piloto não encontrado" });
      }
      if (piloto.status !== "ativo") {
        return res.status(422).json({ erro: "Não é possível designar um piloto inativo para uma nave" });
      }
    }

    const [result] = await db.query(
      "INSERT INTO naves (nome, modelo, piloto_id) VALUES (?, ?, ?)",
      [nome, modelo, piloto_id ?? null]
    );
    res.status(201).json({ id: result.insertId, nome, modelo, piloto_id });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar nave", detalhe: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nome, modelo, status, piloto_id } = req.body;
    if (!nome || !modelo) {
      return res.status(400).json({ erro: "Campos nome e modelo são obrigatórios" });
    }

    // Regra: piloto designado deve estar ativo
    if (piloto_id) {
      const [[piloto]] = await db.query("SELECT status FROM pilotos WHERE id = ?", [piloto_id]);
      if (!piloto) {
        return res.status(404).json({ erro: "Piloto não encontrado" });
      }
      if (piloto.status !== "ativo") {
        return res.status(422).json({ erro: "Não é possível designar um piloto inativo para uma nave" });
      }
    }

    const [result] = await db.query(
      "UPDATE naves SET nome=?, modelo=?, status=?, piloto_id=? WHERE id=?",
      [nome, modelo, status ?? "ativa", piloto_id ?? null, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Nave não encontrada" });
    }
    res.json({ id: req.params.id, nome, modelo, status, piloto_id });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar nave", detalhe: err.message });
  }
}

async function remover(req, res) {
  try {
    const [result] = await db.query("DELETE FROM naves WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Nave não encontrada" });
    }
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover nave", detalhe: err.message });
  }
}

export { listar, buscarPorId, criar, atualizar, remover };
