<?php
require __DIR__ . '/_bootstrap.php';
csrf_check();
$_SESSION = [];
session_regenerate_id(true);
session_destroy();
redirect('login.php');
