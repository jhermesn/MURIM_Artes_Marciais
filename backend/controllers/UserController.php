<?php
namespace Controllers;

use Models\UserModel;
use Utils\Response;
use Config\JWT;

class UserController {
    private UserModel $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    // GET /api/usuarios (admin)
    public function getAll() {
        $authUser = $this->checkAdmin();
        $users = $this->userModel->getAll();
        Response::json([
            "hydra:member" => $users,
            "hydra:totalItems" => count($users)
        ]);
    }

    // GET /api/usuarios/stats (admin)
    public function getStats() {
        $authUser = $this->checkAdmin();
        $stats = $this->userModel->getUserStats();
        Response::json($stats);
    }

    // GET /api/usuarios/{id} (admin)
    public function getById($id) {
        $authUser = $this->checkAdmin();
        $user = $this->userModel->findById($id);
        if (!$user) {
            Response::json(["error" => "Usuário não encontrado"], 404);
        }
        unset($user["senha"]);
        Response::json($user);
    }

    // PUT /api/usuarios/{id} (admin)
    public function updateUser($id) {
        $authUser = $this->checkAdmin();
        $inputData = json_decode(file_get_contents('php://input'), true);
        if (isset($inputData["senha"])) {
            $inputData["senha"] = password_hash($inputData["senha"], PASSWORD_BCRYPT);
        }
        $ok = $this->userModel->update($id, $inputData);
        if (!$ok) {
            Response::json(["error" => "Falha ao atualizar usuário"], 500);
        }
        Response::json(["success" => true]);
    }

    // DELETE /api/usuarios/{id} (admin)
    public function deleteUser($id) {
        $authUser = $this->checkAdmin();
        $ok = $this->userModel->delete($id);
        if (!$ok) {
            Response::json(["error" => "Falha ao excluir usuário"], 500);
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
