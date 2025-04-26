<?php
$mysqli = new mysqli("localhost:33306", "root", "", "kalkulator");
if ($mysqli->connect_error) {
    die("Błąd połączenia: " . $mysqli->connect_error);
}

$result = $mysqli->query("SELECT * FROM funkcje ORDER BY data DESC");
?>
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Historia funkcji</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>
    <h1>Historia funkcji</h1>
    <nav>
      <a href="index.html">Strona główna</a>
      <a href="wykresy.html">Rysuj wykres</a>
      <a href="historia.php">Historia</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>Ostatnie funkcje:</h2>
      <ul>
        <?php while ($row = $result->fetch_assoc()): ?>
          <li><?= htmlspecialchars($row['tresc']) ?> (<?= $row['data'] ?>)</li>
        <?php endwhile; ?>
      </ul>
    </section>
  </main>
</body>
</html>
