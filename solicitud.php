<?php
declare(strict_types=1);
function finish(int $code, string $message): void {
    http_response_code($code);
    header('Cache-Control: no-store');
    if (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['mensaje' => $message]);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo '<html lang="es"><meta charset="utf-8"><p>'.htmlspecialchars($message).'</p><a href="/">Volver a Mednology Apps</a></html>';
    }
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Allow: POST'); finish(405,'Utiliza el formulario de la web.'); }
function field(string $name): string {
    return is_string($_POST[$name] ?? null) ? trim($_POST[$name]) : '';
}
$email = field('correo');
$type = field('tipo');
if (!in_array($type,['cotizacion','portafolio'],true) || !filter_var($email,FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/',$email)) finish(422,'Revisa el correo ingresado.');
$body = "Correo: ".$email."\n";
if ($type === 'cotizacion') {
    foreach (['nombre','apellido','empresa','celular','descripcion'] as $key) {
        $value = field($key);
        if ($value === '' || strlen($value) > ($key === 'descripcion' ? 20000 : 800)) finish(422,'Completa todos los campos de la cotización.');
        $body .= ucfirst($key).': '.$value."\n";
    }
}
$recipient = 'hola@mednologyapps.com';
$headers = "From: Mednology Apps <".$recipient.">\r\nReply-To: ".$email."\r\nContent-Type: text/plain; charset=UTF-8";
$subject = $type === 'cotizacion' ? 'Solicitud de cotizacion' : 'Solicitud de portafolio';
if (!function_exists('mail') || !mail($recipient,$subject,$body,$headers)) finish(503,'El envío no está disponible. Escríbenos a hola@mednologyapps.com.');
finish(200,'Solicitud enviada. Te responderemos al correo indicado.');
