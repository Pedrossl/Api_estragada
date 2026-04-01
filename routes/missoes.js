import { Router } from "express";
import * as ctrl from "../controllers/missoesController.js";

const router = Router();

router.get("/", ctrl.listar);
router.get("/:id", ctrl.buscarPorId);
router.post("/", ctrl.criar);
router.patch("/:id/status", ctrl.atualizarStatus);
router.delete("/:id", ctrl.remover);

export default router;
