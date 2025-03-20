<?php
namespace Controllers;

use Models\MessageModel;
use Utils\Response;
use Config\JWT;

class MessageController {
    private MessageModel $msgModel;

    public function __construct() {
        $this->msgModel = new MessageModel();
    }

    // GET /api/mensagens (admin)
    public function getAllMessages() {
        $authUser = $this->checkAdmin();
        $messages = $this->msgModel->getAll();
        Response::json([
            "hydra:member" => $messages,
            "hydra:totalItems" => count($messages)
        ]);
    }

    // POST /api/mensagens
    public function createMessage() {
        $inputData = json_decode(file_get_contents('php://input'), true);
        if (!isset($inputData["nome_completo"], $inputData["email"], $inputData["telefone"], $inputData["mensagem"])) {
            Response::json(["error" => "Campos obrigatórios ausentes."], 400);
        }
        $assunto = $inputData["assunto"] ?? '';
        $newId = $this->msgModel->create(
            $inputData["nome_completo"],
            $inputData["email"],
            $inputData["telefone"],
            $assunto,
            $inputData["mensagem"]
        );
        Response::json(["success" => true, "id" => $newId], 201);
    }

    // GET /api/mensagens/{id} (admin)
    public function getMessage($id) {
        $authUser = $this->checkAdmin();
        $msg = $this->msgModel->getById($id);
        if (!$msg) {
            Response::json(["error" => "Mensagem não encontrada"], 404);
        }
        Response::json($msg);
    }

    // PUT /api/mensagens/{id} (admin)
    public function updateMessage($id) {
        $authUser = $this->checkAdmin();
        $inputData = json_decode(file_get_contents('php://input'), true);
        $ok = $this->msgModel->update($id, $inputData);
        if (!$ok) {
            Response::json(["error" => "Falha ao atualizar mensagem"], 500);
        }
        Response::json(["success" => true]);
    }

    // DELETE /api/mensagens/{id} (admin)
    public function deleteMessage($id) {
        $authUser = $this->checkAdmin();

        $msg = $this->msgModel->getById($id);
        if (!$msg) {
            Response::json(["error" => "Mensagem não encontrada"], 404);
        }
        $ok = $this->msgModel->delete($id);
        if (!$ok) {
            Response::json(["error" => "Falha ao excluir"], 500);
        }
        Response::json(["success" => true]);
    }

    // PATCH /api/mensagens/{id}/read (admin)
    public function markAsRead($id) {
        $authUser = $this->checkAdmin();
        $ok = $this->msgModel->markAsRead($id);
        if (!$ok) {
            Response::json(["error" => "Falha ao marcar como lida"], 500);
        }
        Response::json(["success" => true]);
    }

    // GET /api/mensagens/unread/count (admin)
    public function countUnread() {
        $authUser = $this->checkAdmin();
        $count = $this->msgModel->countUnread();
        Response::json(["count" => $count]);
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
