<?php
namespace Controllers;

use Models\AgendamentoModel;
use Utils\Response;
use Config\JWT;

class AgendamentoController {
    private AgendamentoModel $agModel;

    public function __construct() {
        $this->agModel = new AgendamentoModel();
    }

    // GET /api/agendamentos (admin)
    public function getAllAgendamentos() {
        $authUser = $this->checkAdmin();
        $list = $this->agModel->getAll();
        Response::json([
            "hydra:member" => $list,
            "hydra:totalItems" => count($list)
        ]);
    }

    // GET /api/agendamentos/{id} (admin)
    public function getAgendamento($id) {
        $authUser = $this->checkAdmin();
        $ag = $this->agModel->getById($id);
        if (!$ag) {
            Response::json(["error" => "Agendamento não encontrado"], 404);
        }
        Response::json($ag);
    }

    // GET /api/agendamentos/usuario/{userId} (auth)
    public function getAgendamentosByUser($userId) {
        $authUser = $this->checkAuth();
        if (!$authUser) {
            Response::json(["error" => "Não autenticado"], 401);
            return;
        }

        if ($authUser["user_id"] != $userId && ($authUser["role"] ?? '') !== 'admin') {
            Response::json(["error" => "Acesso negado"], 403);
            return;
        }

        $list = $this->agModel->getByUserId($userId);
        Response::json([
            "hydra:member" => $list,
            "hydra:totalItems" => count($list)
        ]);
    }

    // POST /api/agendamentos (auth)
    public function createAgendamento() {
        $authUser = $this->checkAuth();

        $inputData = json_decode(file_get_contents('php://input'), true);
        if (!isset($inputData["user_id"], $inputData["trainer_id"], $inputData["data"], $inputData["hora_inicio"], $inputData["hora_fim"])) {
            Response::json(["error" => "Campos obrigatórios ausentes"], 400);
        }

        $status = $inputData["status"] ?? 'pending';
        $newId = $this->agModel->create(
            $inputData["user_id"],
            $inputData["trainer_id"],
            $inputData["data"],
            $inputData["hora_inicio"],
            $inputData["hora_fim"],
            $status
        );
        Response::json(["success" => true, "id" => $newId], 201);
    }

    // PUT /api/agendamentos/{id} (admin)
    public function updateAgendamento($id) {
        $authUser = $this->checkAdmin();
        $inputData = json_decode(file_get_contents('php://input'), true);

        $ok = $this->agModel->update($id, $inputData);
        if (!$ok) {
            Response::json(["error" => "Falha ao atualizar agendamento"], 500);
        }
        Response::json(["success" => true]);
    }

    // DELETE /api/agendamentos/{id} (admin)
    public function deleteAgendamento($id) {
        $authUser = $this->checkAdmin();
        $ok = $this->agModel->delete($id);
        if (!$ok) {
            Response::json(["error" => "Falha ao excluir agendamento"], 500);
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

    private function checkAuth(): ?array {
        $headers = apache_request_headers();
        if (!isset($headers["Authorization"])) {
            return null;
        }
        $token = str_replace("Bearer ", "", $headers["Authorization"]);
        $payload = JWT::verify($token);
        return $payload;
    }

}
