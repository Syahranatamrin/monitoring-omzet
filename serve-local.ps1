$root = "C:\Users\Acer\monitoring-omzet"
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:8081/")
$l.Start()
while ($l.IsListening) {
  $c = $l.GetContext()
  $p = $c.Request.Url.LocalPath.TrimStart("/")
  if ($p -eq "") { $p = "monitoring-omzet.html" }
  $f = Join-Path $root ($p -replace "/", "\")
  if ((Test-Path $f -PathType Leaf) -and $f.StartsWith($root)) {
    $c.Response.ContentType = switch ([IO.Path]::GetExtension($f)) { ".html" {"text/html; charset=utf-8"} ".json" {"application/json"} ".png" {"image/png"} default {"application/octet-stream"} }
    $b = [IO.File]::ReadAllBytes($f)
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } else { $c.Response.StatusCode = 404 }
  $c.Response.Close()
}
