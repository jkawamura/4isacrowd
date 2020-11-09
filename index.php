<!DOCTYPE html>
<html lang="en">
<body>
<link rel="stylesheet" href="php.css">
<?php
//gets the score and name of the latest player
$score = $_POST['score'];
$name = $_POST['name'];

//opens the two files holding the names and scores and appends the player's scores 
$scoreFile = fopen("scores.txt", "a+");
$nameFile = fopen("names.txt", "a+");
fwrite($scoreFile, $score . "\n" );
fwrite($nameFile, $name . "\n");

//turns the contents of each file into an array and typecasts the score array to integers
$names = explode("\n", file_get_contents('names.txt'));
$scores = explode("\n", file_get_contents('scores.txt'));
$scores = array_map('intval', $scores);

//closes the file
fclose($scoreFile);

//sorts the scores from largest to smallest with insertion sort. 
//the names are sorted using the same swaps so that they are indexed to match their corresponding score
for($i = 1; $i < count($scores); $i++){
    $skey = $scores[$i];
    $nkey = $names[$i];
    $j = $i - 1;
    while($j >= 0 && $skey > $scores[$j]){
        $scores[$j+1] = $scores[$j];
        $names[$j+1] = $names[$j];
        $j -= 1;
    } 
    $scores[$j + 1] = $skey;
    $names[$j + 1] = $nkey;
}

//removes the last score from each array (\n automatically adds a blank line to the end of the file)
$removed = array_pop($names);
$removed2 = array_pop($scores);


//finds the user's score so it can be ranked separately
$index = 0;
for($i = 0; $i < count($scores); $i++){
    if($scores[$i] == intval($score) && $names[$i] == $name){
        $index = $i + 1;
    }
}

//prints out the top 10 scores in a table with the users score at the bottom. Has a button returning to welcome page.
echo '<div><table><tr><th>Rank</th><th>Name</th><th>Score</th></tr><caption>High Scores</caption>';
for($i=0; $i<min(10, count($names));$i++){
    echo '<tr><td>' . ($i + 1) . '</td><td>' . $names[$i] . '</td><td>' . $scores[$i] . '</td></tr>';
}
echo "<tr><td class='user'>" . $index . "</td><td class='user'>" . $name . "</td><td class='user'>" . $score . "</td></tr>";
echo "</table><br><br>";
echo "<a href='index.html' class='button'>Play Again</a></div>";
?>
</body>
</html>

