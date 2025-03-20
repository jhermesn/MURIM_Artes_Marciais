<?php
namespace Models;

use Config\Database;
use PDO;

class ProductModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create($nome, $descricao, $preco, $imagem, $categoria) {
        $sql = "INSERT INTO produtos (nome, descricao, preco, imagem, categoria)
                VALUES (:nome, :desc, :preco, :img, :cat)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':nome' => $nome,
            ':desc' => $descricao,
            ':preco' => $preco,
            ':img' => $imagem,
            ':cat' => $categoria
        ]);
        $stmt = $this->db->query("SELECT LASTVAL()");
        return $stmt->fetchColumn();
    }

    public function getAll() {
        $sql = "SELECT * FROM produtos ORDER BY id ASC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $sql = "SELECT * FROM produtos WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update($id, $data) {
        $fields = [];
        $params = [];
        foreach ($data as $key => $value) {
            $fields[] = "$key = :$key";
            $params[":$key"] = $value;
        }
        if (empty($fields)) {
            return false;
        }
        $sql = "UPDATE produtos SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $params[":id"] = $id;
        return $stmt->execute($params);
    }

    public function delete($id) {
        $sql = "DELETE FROM produtos WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
}
