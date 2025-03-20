<?php
namespace Models;

use Config\Database;
use PDO;

class HorarioModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll() {
        $sql = "SELECT * FROM horarios ORDER BY id ASC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $sql = "SELECT * FROM horarios WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($dia_semana, $hora_inicio, $hora_fim, $modalidade, $nivel) {
        $sql = "INSERT INTO horarios (dia_semana, hora_inicio, hora_fim, modalidade, nivel)
                VALUES (:dia, :inicio, :fim, :mod, :nivel)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':dia' => $dia_semana,
            ':inicio' => $hora_inicio,
            ':fim' => $hora_fim,
            ':mod' => $modalidade,
            ':nivel' => $nivel
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
        $sql = "UPDATE horarios SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $params[':id'] = $id;
        return $stmt->execute($params);
    }

    public function delete($id) {
        $sql = "DELETE FROM horarios WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
}
