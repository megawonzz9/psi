<?php
if ($_SERVER["REQUEST_METHOD"] === "POST" && !empty($_POST['funkcja'])) {
    $mysqli = new mysqli("localhost:33306", "root", "", "kalkulator");
    if ($mysqli->connect_error) {
        die("Błąd połączenia: " . $mysqli->connect_error);
    }

    $funkcja = $mysqli->real_escape_string($_POST['funkcja']);
    $mysqli->query("INSERT INTO funkcje (tresc) VALUES ('$funkcja')");
    header("Location: ../historia.php");
    exit;
}
?>
