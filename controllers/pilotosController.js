import db from "../database/db.js";

async function listar(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM pilotos");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar pilotos", detalhe: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM pilotos WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Piloto não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar piloto", detalhe: err.message });
  }
}

async function criar(req, res) {
  try {
    const { id, nome, patente } = req.body;
    if (!id || !nome || !patente) {
      return res.status(400).json({ erro: "Campos id, nome e patente são obrigatórios" });
    }
    await db.query("INSERT INTO pilotos VALUES (?, ?, ?)", [id, nome, patente]);
    res.status(201).json({ id, nome, patente });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar piloto", detalhe: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nome, patente } = req.body;
    if (!nome || !patente) {
      return res.status(400).json({ erro: "Campos nome e patente são obrigatórios" });
    }
    const [result] = await db.query("UPDATE pilotos SET nome=?, patente=? WHERE id=?", [nome, patente, req.params.id]);
    res.json({ id: req.params.id, nome, patente });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar piloto", detalhe: err.message });
  }
}

async function remover(req, res) {
  try {
    const [result] = await db.query("DELETE FROM pilotos WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Piloto não encontrado" });
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover piloto", detalhe: err.message });
  }
}

export { listar, buscarPorId, criar, atualizar, remover };
