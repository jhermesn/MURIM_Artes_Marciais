<?php
namespace Controllers;

use Models\ProductModel;
use Utils\Response;
use Config\JWT;

class ProductController {
    private ProductModel $prodModel;

    public function __construct() {
        $this->prodModel = new ProductModel();
    }

    // GET /api/produtos
    public function getAllProducts() {
        $products = $this->prodModel->getAll();
        Response::json([
            "hydra:member" => $products,
            "hydra:totalItems" => count($products)
        ]);
    }

    // GET /api/produtos/{id}
    public function getProduct($id) {
        $product = $this->prodModel->getById($id);
        if (!$product) {
            Response::json(["error" => "Produto não encontrado"], 404);
        }
        Response::json($product);
    }

    // POST /api/produtos (admin)
    public function createProduct() {
        $authUser = $this->checkAdmin();
        $inputData = json_decode(file_get_contents('php://input'), true);

        if (!isset($inputData["nome"], $inputData["descricao"], $inputData["preco"])) {
            Response::json(["error" => "Campos obrigatórios ausentes"], 400);
        }
        $imagem = $inputData["imagem"] ?? '';
        $categoria = $inputData["categoria"] ?? '';

        $newId = $this->prodModel->create(
            $inputData["nome"],
            $inputData["descricao"],
            $inputData["preco"],
            $imagem,
            $categoria
        );
        Response::json(["success" => true, "id" => $newId], 201);
    }

    // PUT /api/produtos/{id} (admin)
    public function updateProduct($id) {
        $authUser = $this->checkAdmin();
        $inputData = json_decode(file_get_contents('php://input'), true);
        $ok = $this->prodModel->update($id, $inputData);
        if (!$ok) {
            Response::json(["error" => "Falha ao atualizar"], 500);
        }
        Response::json(["success" => true]);
    }

    // DELETE /api/produtos/{id} (admin)
    public function deleteProduct($id) {
        $authUser = $this->checkAdmin();
        $ok = $this->prodModel->delete($id);
        if (!$ok) {
            Response::json(["error" => "Falha ao excluir"], 500);
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
