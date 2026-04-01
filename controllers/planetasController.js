import db from "../database/db.js";

async function listar(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM planetas");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar planetas", detalhe: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const [rows] = await db.query("SELECT * FROM planetas WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ erro: "Planeta não encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar planeta", detalhe: err.message });
  }
}

async function criar(req, res) {
  try {
    const { id, nome, galaxia } = req.body;
    if (!id || !nome || !galaxia) {
      return res.status(400).json({ erro: "Campos id, nome e galaxia são obrigatórios" });
    }
    await db.query("INSERT INTO planetas VALUES (?, ?, ?)", [id, nome, galaxia]);
    res.status(201).json({ id, nome, galaxia });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao criar planeta", detalhe: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nome, galaxia } = req.body;
    if (!nome || !galaxia) {
      return res.status(400).json({ erro: "Campos nome e galaxia são obrigatórios" });
    }
    const [result] = await db.query("UPDATE planetas SET nome=?, galaxia=? WHERE id=?", [nome, galaxia, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Planeta não encontrado" });
    res.json({ id: req.params.id, nome, galaxia });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar planeta", detalhe: err.message });
  }
}

async function remover(req, res) {
  try {
    const [result] = await db.query("DELETE FROM planetas WHERE id=?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ erro: "Planeta não encontrado" });
    res.json({ deleted: req.params.id });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao remover planeta", detalhe: err.message });
  }
}

export { listar, buscarPorId, criar, atualizar, remover };
