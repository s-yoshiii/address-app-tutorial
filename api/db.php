<?php

function get_pdo(): PDO
{
    $pdo = new PDO("sqlite:" . __DIR__ . "/../contacts.db");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
}
