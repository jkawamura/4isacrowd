<!DOCTYPE html>
<html lang="en">
<body>
<link rel="stylesheet" href="php.css">
<?php
//gets the score and name of the latest player
$score = $_POST['score'];
$name = $_POST['name'];
$servername = "localhost";
$username = "jkawamur_1";
$password = "zJJxva8f'+hN";
$dbname = "jkawamur_4isacrowd";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
  exit;
}

$query = "INSERT INTO highscores(username, score) VALUES('$name', '$score')";
if ($conn->query($query) === TRUE) {
  } else {
    echo "Error inserting: " . $conn->error;
  }
  
$query = "set @row_number = 0;"; 
$conn->query($query); 
$query = "SELECT (@row_number:=@row_number + 1) as row, username, score from highscores order by score desc;";
$result = $conn->query($query);

echo '<div><table><tr><th>Rank</th><th>Score</th><th>Name</th></tr><caption>High Scores</caption>';

$i = 0;
while($row = $result->fetch_assoc()){
    if($i == 10){
        break;
    }
    $i += 1;
    echo '<tr><td>' . $row["row"] . '</td><td>' . $row["score"] . '</td><td>' . $row["username"] . '</td></tr>';
}

$i = 0;
while($row = $result->fetch_assoc()) {
    $i += 1;
    if($row['username'] == $name && $row['score'] == $score) {
        echo "<tr><td class='user'>" . $row['row'] . "</td><td class='user'>" . $row['score'] . "</td><td class='user'>" . $row['username'] . "</td></tr>";
        break;
    }
}
echo "</table><br><br>";
echo "<a href='index.html' class='button'>Play Again</a></div>";
?>
</body>
</html>