<?php
namespace Controllers;

use Models\HorarioModel;
use Utils\Response;
use Config\JWT;

class HorarioController {
    private HorarioModel $horarioModel;

    public function __construct() {
        $this->horarioModel = new HorarioModel();
    }

    // GET /api/horarios
    public function getAllHorarios() {
        $horarios = $this->horarioModel->getAll();
        Response::json([
            "hydra:member" => $horarios,
            "hydra:totalItems" => count($horarios)
        ]);
    }

    // GET /api/horarios/{id}
    public function getHorario($id) {
        $horario = $this->horarioModel->getById($id);
        if (!$horario) {
            Response::json(["error" => "Horário não encontrado"], 404);
        }
        Response::json($horario);
    }

    // POST /api/horarios (admin)
    public function createHorario() {
        $authUser = $this->checkAdmin();

        $inputData = json_decode(file_get_contents('php://input'), true);
        if (!isset($inputData["dia_semana"], $inputData["hora_inicio"], $inputData["hora_fim"], $inputData["modalidade"], $inputData["nivel"])) {
            Response::json(["error" => "Campos obrigatórios ausentes"], 400);
        }
        $newId = $this->horarioModel->create(
            $inputData["dia_semana"],
            $inputData["hora_inicio"],
            $inputData["hora_fim"],
            $inputData["modalidade"],
            $inputData["nivel"]
        );
        Response::json(["success" => true, "id" => $newId], 201);
    }

    // PUT /api/horarios/{id} (admin)
    public function updateHorario($id) {
        $authUser = $this->checkAdmin();
        $inputData = json_decode(file_get_contents('php://input'), true);

        $ok = $this->horarioModel->update($id, $inputData);
        if (!$ok) {
            Response::json(["error" => "Falha ao atualizar horário"], 500);
        }
        Response::json(["success" => true]);
    }

    // DELETE /api/horarios/{id} (admin)
    public function deleteHorario($id) {
        $authUser = $this->checkAdmin();
        $ok = $this->horarioModel->delete($id);
        if (!$ok) {
            Response::json(["error" => "Falha ao excluir horário"], 500);
        }
        Response::json(["success" => true]);
    }

    private function checkAdmin(): ?array {
        $headers = apache_request_headers();
        if (!isset($headers["Authorization"])) {
            Response::json(["error" => "Acesso não autorizado"], 401);
        }
        $token = str_replace("Bearer ", "", $headers["Authorization"]);
        $payload = JWT::verify($token);
        if (!$payload || ($payload["role"] ?? '') !== 'admin') {
            Response::json(["error" => "Permissão negada"], 403);
        }
        return $payload;
    }
}
