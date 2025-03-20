<?php
namespace Models;

use Config\Database;
use PDO;

class TrainerModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll() {
        $sql = "SELECT * FROM trainers ORDER BY id ASC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $sql = "SELECT * FROM trainers WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($nome, $especialidade, $experience, $descricao, $availability, $imagem) {
        $sql = "INSERT INTO trainers (nome, especialidade, experience, descricao, availability, imagem)
                VALUES (:nome, :esp, :exp, :descr, :avail, :img)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':nome' => $nome,
            ':esp' => $especialidade,
            ':exp' => $experience,
            ':descr' => $descricao,
            ':avail' => $availability,
            ':img' => $imagem
        ]);
        $stmt = $this->db->query("SELECT LASTVAL()");
        return $stmt->fetchColumn();
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
        $sql = "UPDATE trainers SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $params[':id'] = $id;
        return $stmt->execute($params);
    }

    public function delete($id) {
        $sql = "DELETE FROM trainers WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
}
