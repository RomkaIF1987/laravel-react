<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>Admin Panel</title>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <script>
      window.Laravel = {!! json_encode([
            'csrfToken' => csrf_token(),
        ], JSON_THROW_ON_ERROR) !!};
    </script>
</head>
<body>
<noscript>
    <strong>We're sorry but this app doesn't work properly without JavaScript enabled. Please enable it to
        continue.</strong>
</noscript>
<div id="app"></div>
<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
