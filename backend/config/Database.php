<?php
namespace Config;

use PDO;
use PDOException;

class Database {
    private static $host = "127.0.0.1"; // Endereço do servidor PostgreSQL
    private static $port = "5432"; // Porta padrão do PostgreSQL
    private static $dbName = "murim_artes_marciais"; // Nome do banco de dados
    private static $user = "postgres"; // Usuário do banco de dados
    private static $password = "12345678"; // Senha do usuário do banco de dados

    public static ?PDO $connection = null;

    public static function getConnection(): PDO {
        if (self::$connection === null) {
            try {
                $dsn = "pgsql:host=" . self::$host . ";port=" . self::$port . ";dbname=" . self::$dbName;
                self::$connection = new PDO($dsn, self::$user, self::$password);
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Erro ao conectar ao PostgreSQL: " . $e->getMessage());
            }
        }
        return self::$connection;
    }
}
