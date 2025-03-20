<?php

require_once __DIR__ . "/vendor/autoload.php";

spl_autoload_register(function ($class) {
    $prefix = __DIR__ . '/';
    $file = $prefix . str_replace('\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

use Controllers\AuthController;
use Controllers\UserController;
use Controllers\MessageController;
use Controllers\ProductController;
use Controllers\HorarioController;
use Controllers\AgendamentoController;
use Controllers\TrainerController;

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$path = parse_url($requestUri, PHP_URL_PATH);
$path = str_replace('/backend', '', $path);
$segments = explode('/', trim($path, '/'));

if (count($segments) < 1 || $segments[0] !== 'api') {
    echo json_encode(["message" => "API Rodando. Rota inválida ou incompleta."], JSON_PRETTY_PRINT);
    exit;
}



$resource = $segments[1] ?? null;
$idParam  = $segments[2] ?? null;
$extra    = $segments[3] ?? null;

switch ($resource) {

    // ROTAS DE AUTH
    case 'register':
        // api/register/
        if ($method === 'POST') {
            $controller = new AuthController();
            $controller->register();
            exit;
        }
        break;

    case 'login':
        // api/login/
        if ($method === 'POST') {
            $controller = new AuthController();
            $controller->login();
            exit;
        }
        break;

    case 'logout':
        // api/logout/
        if ($method === 'POST') {
            $controller = new AuthController();
            $controller->logout();
            exit;
        }
        break;

    case 'profile':
        // api/profile/
        $controller = new AuthController();
        if ($method === 'GET') {
            $controller->profile();
            exit;
        } elseif ($method === 'PUT') {
            $controller->updateProfile();
            exit;
        }
        break;


    // ROTAS DE USUÁRIOS
    case 'usuarios':
        $controller = new UserController();
        // api/usuarios
        if (!$idParam) {
            if ($method === 'GET') {
                $controller->getAll();
                exit;
            }
        } else {
            // api/usuarios/stats
            if ($idParam === 'stats' && $method === 'GET') {
                $controller->getStats();
                exit;
            }
            // api/usuarios/{id}
            if (is_numeric($idParam)) {
                $id = (int)$idParam;
                if ($method === 'GET') {
                    $controller->getById($id);
                    exit;
                } elseif ($method === 'PUT') {
                    $controller->updateUser($id);
                    exit;
                } elseif ($method === 'DELETE') {
                    $controller->deleteUser($id);
                    exit;
                }
            }
        }
        break;

    // ROTAS DE MENSAGENS
    case 'mensagens':
        $controller = new MessageController();
        // api/mensagens
        if (!$idParam) {
            if ($method === 'GET') {
                $controller->getAllMessages();
                exit;
            } elseif ($method === 'POST') {
                $controller->createMessage();
                exit;
            }
        } else {
            // api/mensagens/unread/count
            if ($idParam === 'unread' && $extra === 'count' && $method === 'GET') {
                $controller->countUnread();
                exit;
            }
            // api/mensagens/{id}
            if (is_numeric($idParam)) {
                $id = (int)$idParam;
                if ($method === 'GET') {
                    $controller->getMessage($id);
                    exit;
                } elseif ($method === 'PUT') {
                    $controller->updateMessage($id);
                    exit;
                } elseif ($method === 'DELETE') {
                    $controller->deleteMessage($id);
                    exit;
                } elseif ($method === 'PATCH') {
                    // api/mensagens/{id}/read
                    if ($extra === 'read') {
                        $controller->markAsRead($id);
                        exit;
                    }
                }
            }
        }
        break;

    // ROTAS DE PRODUTOS
    case 'produtos':
        $controller = new ProductController();
        // api/produtos
        if (!$idParam) {
            if ($method === 'GET') {
                $controller->getAllProducts();
                exit;
            } elseif ($method === 'POST') {
                $controller->createProduct();
                exit;
            }
        } else {
            // api/produtos/{id}
            if (is_numeric($idParam)) {
                $id = (int)$idParam;
                if ($method === 'GET') {
                    $controller->getProduct($id);
                    exit;
                } elseif ($method === 'PUT') {
                    $controller->updateProduct($id);
                    exit;
                } elseif ($method === 'DELETE') {
                    $controller->deleteProduct($id);
                    exit;
                }
            }
        }
        break;

    // ROTAS DE HORÁRIOS
    case 'horarios':
        $controller = new HorarioController();
        // api/horarios/
        if (!$idParam) {
            if ($method === 'GET') {
                $controller->getAllHorarios();
                exit;
            } elseif ($method === 'POST') {
                $controller->createHorario();
                exit;
            }
        } else {
        // api/horarios/{id}
            if (is_numeric($idParam)) {
                $id = (int)$idParam;
                if ($method === 'GET') {
                    $controller->getHorario($id);
                    exit;
                } elseif ($method === 'PUT') {
                    $controller->updateHorario($id);
                    exit;
                } elseif ($method === 'DELETE') {
                    $controller->deleteHorario($id);
                    exit;
                }
            }
        }
        break;

    // ROTAS DE AGENDAMENTOS
    case 'agendamentos':
        $controller = new AgendamentoController();
        // api/agendamentos/
        if (!$idParam) {
            if ($method === 'GET') {
                $controller->getAllAgendamentos();
                exit;
            } elseif ($method === 'POST') {
                $controller->createAgendamento();
                exit;
            }
        } else {
            // api/agendamentos/{id}
            if (is_numeric($idParam)) {
                $id = (int)$idParam;
                if ($method === 'GET') {
                    $controller->getAgendamento($id);
                    exit;
                } elseif ($method === 'PUT') {
                    $controller->updateAgendamento($id);
                    exit;
                } elseif ($method === 'DELETE') {
                    $controller->deleteAgendamento($id);
                    exit;
                }
            }
            // api/agendamentos/usuario/{id}
            if ($idParam === "usuario" && is_numeric($extra) && $method === 'GET') {
                $controller->getAgendamentosByUser($extra);
            }
        }
        break;

    // ROTAS DE TREINADORES
    case 'trainers':
        $controller = new TrainerController();
        // api/trainers/
        if (!$idParam) {
            if ($method === 'GET') {
                $controller->getAllTrainers();
                exit;
            } elseif ($method === 'POST') {
                $controller->createTrainer();
                exit;
            }
        } else {
            // api/trainers/{id}
            if (is_numeric($idParam)) {
                $id = (int)$idParam;
                if ($method === 'GET') {
                    $controller->getTrainer($id);
                    exit;
                } elseif ($method === 'PUT') {
                    $controller->updateTrainer($id);
                    exit;
                } elseif ($method === 'DELETE') {
                    $controller->deleteTrainer($id);
                    exit;
                }
            }
        }
        break;

    default:
        // Rota não identificada
        echo json_encode(["error" => "Rota não encontrada: /api/$resource"], JSON_PRETTY_PRINT);
        exit;
}

echo json_encode(["error" => "Método não suportado ou rota incompleta."], JSON_PRETTY_PRINT);
