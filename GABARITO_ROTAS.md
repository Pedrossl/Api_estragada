# Gabarito — Comportamento Esperado das Rotas

> Leitura: cada cenário descreve **o que fazer** e **o que deve acontecer**.
> Os dados de exemplo do banco estão no final como referência.

---

## /pilotos

**GET /pilotos**
Ao chamar a rota, a API retorna a lista completa de pilotos cadastrados.
- Resposta esperada: status 200 com array de pilotos.

**GET /pilotos/:id**
Ao buscar pelo id de um piloto existente (ex: id 1 — Han Solo), a API retorna os dados daquele piloto.
- Resposta esperada: status 200 com o objeto do piloto.

Ao buscar por um id que não existe (ex: id 999), a API informa que não foi encontrado.
- Resposta esperada: status 404 com `{ "erro": "Piloto não encontrado" }`.

**POST /pilotos**
Ao criar um piloto enviando `id`, `nome` e `patente` no body, o piloto é salvo no banco.
- Resposta esperada: status 201 com os dados enviados.

Ao tentar criar um piloto sem um dos campos obrigatórios (ex: sem `patente`), a API rejeita a requisição.
- Resposta esperada: status 400 com mensagem de erro sobre os campos obrigatórios.

**PUT /pilotos/:id**
Ao atualizar um piloto existente enviando `nome` e `patente`, os dados são alterados no banco.
- Resposta esperada: status 200 com os dados atualizados.

Ao tentar atualizar um piloto que não existe, a API informa que não foi encontrado.
- Resposta esperada: status 404 com `{ "erro": "Piloto não encontrado" }`.

Ao enviar o body sem `nome` ou sem `patente`, a API rejeita.
- Resposta esperada: status 400 com mensagem de campos obrigatórios.

**DELETE /pilotos/:id**
Ao deletar um piloto existente, ele é removido do banco.
- Resposta esperada: status 200 com `{ "deleted": "<id>" }`.

Ao tentar deletar um piloto que não existe, a API informa que não foi encontrado.
- Resposta esperada: status 404 com `{ "erro": "Piloto não encontrado" }`.

---

## /naves

**GET /naves**
Ao listar todas as naves, a API retorna cada nave com o nome do piloto designado junto (`piloto`).
- Se a nave não tiver piloto, o campo `piloto` vem como `null`.
- Resposta esperada: status 200 com array de naves, cada uma com o campo `piloto`.

**GET /naves/:id**
Ao buscar uma nave existente (ex: id 1 — Millennium Falcon), a API retorna os dados da nave com o nome do piloto.
- Resposta esperada: status 200 com o objeto da nave + campo `piloto`.

Ao buscar por um id que não existe, a API informa que não foi encontrada.
- Resposta esperada: status 404 com `{ "erro": "Nave não encontrada" }`.

**POST /naves**
Ao criar uma nave enviando `nome` e `modelo` (sem piloto), a nave é criada normalmente.
- Resposta esperada: status 201 com os dados da nave e `piloto_id: null`.

Ao criar uma nave e informar um `piloto_id` de um piloto ativo (ex: id 1 — Han Solo, status ativo), a nave é criada com aquele piloto.
- Resposta esperada: status 201 com os dados da nave.

Ao criar uma nave e informar um `piloto_id` de um piloto **inativo** (ex: id 3 — Poe Dameron, status inativo), a API rejeita a designação.
- Resposta esperada: status 422 com `{ "erro": "Não é possível designar um piloto inativo para uma nave" }`.

Ao criar uma nave e informar um `piloto_id` que não existe, a API rejeita.
- Resposta esperada: status 404 com `{ "erro": "Piloto não encontrado" }`.

Ao tentar criar uma nave sem `nome` ou sem `modelo`, a API rejeita.
- Resposta esperada: status 400 com mensagem de campos obrigatórios.

**PUT /naves/:id**
Ao atualizar uma nave existente com dados válidos, as alterações são salvas.
- Resposta esperada: status 200 com os dados atualizados.

Ao tentar atualizar e informar um `piloto_id` de piloto inativo, a mesma validação do POST se aplica.
- Resposta esperada: status 422 com a mesma mensagem de piloto inativo.

Ao tentar atualizar uma nave que não existe, a API informa.
- Resposta esperada: status 404 com `{ "erro": "Nave não encontrada" }`.

**DELETE /naves/:id**
Ao deletar uma nave existente, ela é removida do banco.
- Resposta esperada: status 200 com `{ "deleted": "<id>" }`.

Ao tentar deletar uma nave que não existe, a API informa.
- Resposta esperada: status 404 com `{ "erro": "Nave não encontrada" }`.

---

## /planetas

**GET /planetas**
Ao listar todos os planetas, a API retorna todos os registros do banco.
- Resposta esperada: status 200 com array de planetas.

**GET /planetas/:id**
Ao buscar um planeta existente (ex: id 1 — Tatooine), a API retorna os dados dele.
- Resposta esperada: status 200 com o objeto do planeta.

Ao buscar por um id que não existe, a API informa.
- Resposta esperada: status 404 com `{ "erro": "Planeta não encontrado" }`.

**POST /planetas**
Ao criar um planeta enviando `id`, `nome` e `galaxia`, o planeta é salvo.
- Resposta esperada: status 201 com os dados enviados.

Ao tentar criar sem algum dos três campos, a API rejeita.
- Resposta esperada: status 400 com mensagem de campos obrigatórios.

**PUT /planetas/:id**
Ao atualizar um planeta existente com `nome` e `galaxia`, os dados são alterados.
- Resposta esperada: status 200 com os dados atualizados.

Ao tentar atualizar um planeta que não existe, a API informa.
- Resposta esperada: status 404 com `{ "erro": "Planeta não encontrado" }`.

**DELETE /planetas/:id**
Ao deletar um planeta existente, ele é removido.
- Resposta esperada: status 200 com `{ "deleted": "<id>" }`.

---

## /missoes

**GET /missoes**
Ao listar todas as missões, a API retorna cada missão com os nomes do piloto, nave e planeta (não apenas os ids).
- Resposta esperada: status 200 com array de missões, cada uma com campos `piloto`, `nave` e `planeta`.

**GET /missoes/:id**
Ao buscar uma missão existente (ex: id 2 — Exploração em Hoth), a API retorna os dados completos com piloto, nave e planeta.
- Resposta esperada: status 200 com o objeto da missão.

Ao buscar por um id que não existe, a API informa.
- Resposta esperada: status 404 com `{ "erro": "Missão não encontrada" }`.

**POST /missoes**
Ao criar uma missão com todos os campos obrigatórios (`titulo`, `tipo`, `nave_id`, `piloto_id`, `planeta_id`, `data_partida`) e tudo válido, a missão é criada.
- Resposta esperada: status 201 com os dados da missão.

Ao tentar criar sem algum dos campos obrigatórios, a API rejeita antes de qualquer validação.
- Resposta esperada: status 400 com mensagem listando todos os campos obrigatórios.

Ao tentar criar uma missão com um piloto **inativo** (ex: Poe Dameron, id 3), a API rejeita.
- Resposta esperada: status 422 com `{ "erro": "Piloto não está ativo e não pode ser designado a uma missão" }`.

Ao tentar criar uma missão com uma nave que não está com `status = "ativa"` (ex: Black One, id 3, status "manutencao"), a API rejeita.
- Resposta esperada: status 422 com `{ "erro": "Nave não está disponível (status: manutencao)" }`.

Ao tentar criar uma missão cuja `carga_kg` excede a `capacidade_carga` da nave (ex: carga 6000 para a X-Wing que suporta 1000), a API rejeita.
- Resposta esperada: status 422 com `{ "erro": "Carga (6000kg) excede a capacidade da nave (1000kg)" }`.

Ao tentar criar uma missão do tipo `"transporte"` tendo como destino um planeta **não habitável** (ex: Hoth, id 3, habitavel = false), a API rejeita.
- Resposta esperada: status 422 com `{ "erro": "Missões de transporte só podem ter como destino planetas habitáveis" }`.

Ao criar uma missão do tipo `"exploracao"` para um planeta não habitável (ex: Hoth), a API **permite** — a restrição de habitabilidade é só para `"transporte"`.
- Resposta esperada: status 201 com os dados da missão.

**PATCH /missoes/:id/status**
Ao atualizar o status de uma missão `"planejada"` para `"em_andamento"`, a alteração é salva.
- Resposta esperada: status 200 com `{ "id": ..., "status": "em_andamento" }`.

Ao tentar atualizar o status de uma missão já `"concluida"`, a API bloqueia — missão encerrada não pode ser reaberta.
- Resposta esperada: status 422 com `{ "erro": "Missão já está concluida e não pode ser alterada" }`.

Ao tentar atualizar o status de uma missão já `"cancelada"`, o mesmo bloqueio se aplica.
- Resposta esperada: status 422 com `{ "erro": "Missão já está cancelada e não pode ser alterada" }`.

Ao enviar um valor de status inválido (ex: `"pausada"`), a API rejeita.
- Resposta esperada: status 400 com mensagem listando os valores aceitos: `planejada`, `em_andamento`, `concluida`, `cancelada`.

Ao tentar atualizar uma missão que não existe, a API informa.
- Resposta esperada: status 404 com `{ "erro": "Missão não encontrada" }`.

**DELETE /missoes/:id**
Ao deletar uma missão com status `"planejada"` ou `"cancelada"`, ela é removida normalmente.
- Resposta esperada: status 200 com `{ "deleted": "<id>" }`.

Ao tentar deletar uma missão com status `"em_andamento"` (ex: Exploração em Hoth, id 2), a API bloqueia — não pode excluir missão que já saiu.
- Resposta esperada: status 422 com `{ "erro": "Não é possível excluir uma missão em andamento" }`.

Ao tentar deletar uma missão que não existe, a API informa.
- Resposta esperada: status 404 com `{ "erro": "Missão não encontrada" }`.

---

## Dados de exemplo no banco (para referência dos testes)

| Recurso | id | Nome | Detalhe relevante |
|---------|----|----- |-------------------|
| Piloto  | 1  | Han Solo      | status: ativo |
| Piloto  | 2  | Rey Skywalker | status: ativo |
| Piloto  | 3  | Poe Dameron   | status: **inativo** |
| Planeta | 1  | Tatooine  | habitavel: sim |
| Planeta | 2  | Coruscant | habitavel: sim |
| Planeta | 3  | Hoth      | habitavel: **não** |
| Nave    | 1  | Millennium Falcon | status: ativa, capacidade: 5000kg, piloto: Han Solo |
| Nave    | 2  | X-Wing T-70       | status: ativa, capacidade: 1000kg, piloto: Rey Skywalker |
| Nave    | 3  | Black One         | status: **manutencao**, capacidade: 1000kg, piloto: Poe Dameron |
| Missão  | 1  | Entrega em Tatooine  | status: **concluida** |
| Missão  | 2  | Exploração em Hoth   | status: **em_andamento** |
| Missão  | 3  | Resgate em Coruscant | status: planejada |
