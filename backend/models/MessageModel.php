<?php
namespace Models;

use Config\Database;
use PDO;

class MessageModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create($nome, $email, $telefone, $assunto, $mensagem) {
        $sql = "INSERT INTO mensagens (nome_completo, email, telefone, assunto, mensagem, lida)
                VALUES (:nome, :email, :tel, :assunto, :msg, false)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':nome' => $nome,
            ':email' => $email,
            ':tel' => $telefone,
            ':assunto' => $assunto,
            ':msg' => $mensagem
        ]);
        $stmt = $this->db->query("SELECT LASTVAL()");
        return $stmt->fetchColumn();
    }

    public function getAll() {
        $sql = "SELECT * FROM mensagens ORDER BY id DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $sql = "SELECT * FROM mensagens WHERE id = :id";
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
        $sql = "UPDATE mensagens SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $params[":id"] = $id;
        return $stmt->execute($params);
    }

    public function markAsRead($id) {
        $sql = "UPDATE mensagens SET lida = true WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    public function delete($id) {
        $sql = "DELETE FROM mensagens WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }

    public function countUnread() {
        $sql = "SELECT COUNT(*) AS count FROM mensagens WHERE lida = false";
        $stmt = $this->db->query($sql);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$row['count'];
    }
}
