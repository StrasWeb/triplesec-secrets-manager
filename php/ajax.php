<?php

require_once 'conf.php';
require_once 'auth.php';

$dbh = new PDO('mysql:dbname='.MYSQL_DB.';host='.MYSQL_HOST, MYSQL_USER, MYSQL_PASS);

function getSecret($name)
{
    global $dbh;
    $sth = $dbh->prepare('SELECT name, triplesec FROM triplesec WHERE name = :name');
    $sth->bindParam(':name', $name);
    $sth->execute();
    return $sth->fetch(PDO::FETCH_ASSOC);
}

function getList()
{
    global $dbh;
    $sth = $dbh->prepare('SELECT name FROM triplesec');
    $sth->execute();
    return $sth->fetchAll(PDO::FETCH_ASSOC);
}

function addSecret($name, $triplesec)
{
    global $dbh;
    $sth = $dbh->prepare(
        'INSERT INTO triplesec (name, triplesec) VALUES (:name, :triplesec)'
    );
    $sth->bindParam(':name', $name);
    $sth->bindParam(':triplesec', $triplesec);
    $sth->execute();
}

function deleteSecret($name)
{
    global $dbh;
    $sth = $dbh->prepare('DELETE FROM triplesec WHERE name = :name');
    $sth->bindParam(':name', $name);
    $sth->execute();
}

header('Content-Type: application/json; charset=UTF-8');

switch ($_GET['action']) {
case 'add':
    addSecret($_POST['name'], $_POST['triplesec']);
    echo json_encode(getList()).PHP_EOL;
    break;
case 'del':
    deleteSecret($_POST['name']);
    echo json_encode(getList()).PHP_EOL;
    break;
case 'list':
    echo json_encode(getList()).PHP_EOL;
    break;
case 'get':
    echo json_encode(getSecret($_POST['name'])).PHP_EOL;
}

?>
