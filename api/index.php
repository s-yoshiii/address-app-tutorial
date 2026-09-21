<?php
header("Content-Type: application/json");

$pdo = new PDO("sqlite:" . __DIR__ . "/../contacts.db");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$method = $_SERVER["REQUEST_METHOD"];
$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if (preg_match('#^/api/contacts(?:/(\d+))?$#', $uri, $matches)) {
    $id = $matches[1] ?? null;
} else {
    http_response_code(404);
    echo json_encode(["error" => "Not Found"]);
    exit();
}

if ($method === "GET" && $id === null) {
    $stmt = $pdo->query("SELECT * FROM contacts");
    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($contacts, JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === "GET" && $id !== null) {
    $stmt = $pdo->prepare("SELECT * FROM contacts WHERE id = ?");
    $stmt->execute([$id]);
    $contact = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($contact === false) {
        http_response_code(404);
        echo json_encode(["error" => "Not Found"], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode($contact, JSON_UNESCAPED_UNICODE);
    }
    exit();
}

if ($method === "POST" && $id === null) {
    $input = json_decode(file_get_contents("php://input"), true);
    if (!is_array($input)) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON body"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    $name = trim($input["name"] ?? "");
    if ($name === "") {
        http_response_code(400);
        echo json_encode(["error" => "name is required"], JSON_UNESCAPED_UNICODE);
        exit();
    }
    $stmt = $pdo->prepare("INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)");
    $stmt->execute([$name, $input["email"] ?? null, $input["phone"] ?? null]);
    http_response_code(201);
    echo json_encode(
        [
            "id" => $pdo->lastInsertId(),
            "message" => "Created",
        ],
        JSON_UNESCAPED_UNICODE,
    );
    exit();
}

if ($method === "PUT" && $id !== null) {
    $input = json_decode(file_get_contents("php://input"), true);
    $stmt = $pdo->prepare("UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?");
    $stmt->execute([$input["name"], $input["email"] ?? null, $input["phone"] ?? null, $id]);
    echo json_encode(["message" => "updated"], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === "DELETE" && $id !== null) {
    $stmt = $pdo->prepare("DELETE FROM contacts WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Deleted"], JSON_UNESCAPED_UNICODE);
    exit();
}

http_response_code(405);
echo json_encode([
    "error" => "Method Not Allowed",
]);
exit();
