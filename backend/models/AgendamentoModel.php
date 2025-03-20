<?php
namespace Models;

use Config\Database;
use PDO;

class AgendamentoModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll() {
        $sql = "SELECT * FROM agendamentos ORDER BY id ASC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByUserId($userId) {
        $sql = "SELECT * FROM agendamentos WHERE user_id = :uid";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':uid' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id) {
        $sql = "SELECT * FROM agendamentos WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($userId, $trainerId, $data, $horaInicio, $horaFim, $status) {
        $sql = "INSERT INTO agendamentos (user_id, trainer_id, data, hora_inicio, hora_fim, status)
                VALUES (:uid, :tid, :data, :inicio, :fim, :status)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':uid' => $userId,
            ':tid' => $trainerId,
            ':data' => $data,
            ':inicio' => $horaInicio,
            ':fim' => $horaFim,
            ':status' => $status
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
        $sql = "UPDATE agendamentos SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $params[':id'] = $id;
        return $stmt->execute($params);
    }

    public function delete($id) {
        $sql = "DELETE FROM agendamentos WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
}
