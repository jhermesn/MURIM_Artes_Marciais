<?php
namespace Controllers;

use Models\UserModel;
use Config\JWT;
use Utils\Response;

class AuthController {
    private UserModel $userModel;

    public function __construct() {
        $this->userModel = new UserModel();
    }

    // POST /api/register
    public function register() {
        $inputData = json_decode(file_get_contents('php://input'), true);
        if (!isset($inputData["nome_completo"], $inputData["email"], $inputData["telefone"], $inputData["senha"])) {
            Response::json(["error" => "Campos obrigatórios ausentes."], 400);
        }

        $existing = $this->userModel->findByEmail($inputData["email"]);
        if ($existing) {
            Response::json(["error" => "Email já cadastrado."], 409);
        }

        $passwordHash = password_hash($inputData["senha"], PASSWORD_BCRYPT);

        $newId = $this->userModel->createUser(
            $inputData["nome_completo"],
            $inputData["email"],
            $inputData["telefone"],
            $passwordHash
        );

        Response::json(["success" => true, "user_id" => $newId], 201);
    }

    // POST /api/login
    public function login() {
        $inputData = json_decode(file_get_contents('php://input'), true);
        if (!isset($inputData["email"], $inputData["senha"])) {
            Response::json(["error" => "Email e senha são obrigatórios."], 400);
        }

        $user = $this->userModel->findByEmail($inputData["email"]);
        if (!$user) {
            Response::json(["error" => "Credenciais inválidas."], 401);
        }

        if (!password_verify($inputData["senha"], $user["senha"])) {
            Response::json(["error" => "Credenciais inválidas."], 401);
        }

        $payload = [
            "user_id" => $user["id"],
            "email"   => $user["email"],
            "role"    => $user["role"] ?? 'aluno'
        ];
        $token = JWT::generate($payload);

        Response::json([
            "token" => $token,
            "user" => [
                "id" => (int)$user["id"],
                "nome_completo" => $user["nome_completo"],
                "email" => $user["email"],
                "telefone" => $user["telefone"],
                "role" => $user["role"]
            ]
        ]);
    }

    // POST /api/logout (auth)
    public function logout() {
        $authUser = $this->checkAuth();
        if (!$authUser) {
            Response::json(["error" => "Não autenticado"], 401);
        }

        Response::json(["message" => "Logout realizado com sucesso"]);
    }

    // GET /api/profile (auth)
    public function profile() {
        $authUser = $this->checkAuth();
        if (!$authUser) {
            Response::json(["error" => "Não autenticado"], 401);
        }

        $user = $this->userModel->findById($authUser["user_id"]);
        if (!$user) {
            Response::json(["error" => "Usuário não encontrado"], 404);
        }

        unset($user["senha"]);
        Response::json($user);
    }

    // PUT /api/profile (auth)
    public function updateProfile() {
        $authUser = $this->checkAuth();
        if (!$authUser) {
            Response::json(["error" => "Não autenticado"], 401);
        }

        $inputData = json_decode(file_get_contents('php://input'), true);
        if (!$inputData) {
            Response::json(["error" => "Nenhum dado enviado."], 400);
        }

        if (isset($inputData["senha"])) {
            $inputData["senha"] = password_hash($inputData["senha"], PASSWORD_BCRYPT);
        }

        $ok = $this->userModel->update($authUser["user_id"], $inputData);
        if (!$ok) {
            Response::json(["error" => "Falha ao atualizar perfil"], 500);
        }
        Response::json(["success" => true]);
    }

    // Lê o Authorization: Bearer <token> e valida
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
