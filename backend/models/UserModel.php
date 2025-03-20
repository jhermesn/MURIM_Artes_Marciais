<?php
namespace Models;

use Config\Database;
use PDO;

class UserModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function createUser($nome_completo, $email, $telefone, $senhaHash, $role = "aluno") {
        $sql = "INSERT INTO users (nome_completo, email, telefone, senha, role)
                VALUES (:nome, :email, :tel, :pass, :role)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':nome' => $nome_completo,
            ':email' => $email,
            ':tel' => $telefone,
            ':pass' => $senhaHash,
            ':role' => $role
        ]);
        $stmt = $this->db->query("SELECT LASTVAL()");
        return $stmt->fetchColumn();
    }

    public function findByEmail($email) {
        $sql = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':email' => $email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function findById($id) {
        $sql = "SELECT * FROM users WHERE id = :id";
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
        $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $params[":id"] = $id;
        return $stmt->execute($params);
    }

    public function delete($id) {
        $sql = "DELETE FROM users WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    public function getUserStats() {
        $sqlTotal = "SELECT COUNT(*) AS total FROM users";
        $stmt = $this->db->query($sqlTotal);
        $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;

        $sqlAlunos = "SELECT COUNT(*) AS count FROM users WHERE role != 'admin'";
        $alunos = $this->db->query($sqlAlunos)->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

        $sqlAdm = "SELECT COUNT(*) AS count FROM users WHERE role = 'admin'";
        $admin = $this->db->query($sqlAdm)->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

        return [
            'total' => (int)$total,
            'alunos' => (int)$alunos,
            'admin' => (int)$admin
        ];
    }

    public function getAll() {
        $sql = "SELECT id, nome_completo, email, telefone, role, created_at FROM users ORDER BY id ASC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
