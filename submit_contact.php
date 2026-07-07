<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

require_once __DIR__ . '/db_connect.php';

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$service = trim($_POST['service'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $service === '' || $message === '') {
    header('Location: contact.html?status=missing');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: contact.html?status=invalid-email');
    exit;
}

$stmt = $conn->prepare(
    'INSERT INTO contact_messages (full_name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)'
);

if (!$stmt) {
    die('Unable to prepare database query: ' . $conn->error);
}

$stmt->bind_param('sssss', $name, $email, $phone, $service, $message);

if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    header('Location: contact.html?status=success');
    exit;
}

$stmt->close();
$conn->close();
header('Location: contact.html?status=error');
exit;
?>
