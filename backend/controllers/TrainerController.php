<?php
namespace Controllers;

use Models\TrainerModel;
use Utils\Response;
use Config\JWT;

class TrainerController {
    private TrainerModel $trainerModel;

    public function __construct() {
        $this->trainerModel = new TrainerModel();
    }

    // GET /api/trainers
    public function getAllTrainers() {
        $trainers = $this->trainerModel->getAll();
        Response::json([
            "hydra:member" => $trainers,
            "hydra:totalItems" => count($trainers)
        ]);
    }

    // GET /api/trainers/{id}
    public function getTrainer($id) {
        $trainer = $this->trainerModel->getById($id);
        if (!$trainer) {
            Response::json(["error" => "Treinador não encontrado"], 404);
        }
        Response::json($trainer);
    }

    // POST /api/trainers (admin)
    public function createTrainer() {
        $authUser = $this->checkAdmin();
        $inputData = json_decode(file_get_contents('php://input'), true);
        if (!isset($inputData["nome"])) {
            Response::json(["error" => "Nome obrigatório"], 400);
        }
        $especialidade = $inputData["especialidade"] ?? '';
        $experience    = $inputData["experience"]    ?? '';
        $descricao     = $inputData["descricao"]     ?? '';
        $availability  = $inputData["availability"]  ?? '';
        $imagem        = $inputData["imagem"]        ?? '';

        $newId = $this->trainerModel->create(
            $inputData["nome"],
            $especialidade,
            $experience,
            $descricao,
            $availability,
            $imagem
        );
        Response::json(["success" => true, "id" => $newId], 201);
    }

    // PUT /api/trainers/{id} (admin)
    public function updateTrainer($id) {
        $authUser = $this->checkAdmin();
        $inputData = json_decode(file_get_contents('php://input'), true);
        $ok = $this->trainerModel->update($id, $inputData);
        if (!$ok) {
            Response::json(["error" => "Falha ao atualizar treinador"], 500);
        }
        Response::json(["success" => true]);
    }

    // DELETE /api/trainers/{id} (admin)
    public function deleteTrainer($id) {
        $authUser = $this->checkAdmin();
        $ok = $this->trainerModel->delete($id);
        if (!$ok) {
            Response::json(["error" => "Falha ao excluir treinador"], 500);
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
