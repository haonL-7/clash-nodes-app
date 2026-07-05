# Clash Nodes - Native Windows App Launcher
# Uses Edge WebView2 (built into Windows 11) for a native app window
# No browser chrome, no address bar — a real desktop app experience

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Resolve paths relative to script location
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$HtmlPath = Join-Path $ScriptDir "src\index.html"
$IconPath = Join-Path $ScriptDir "src\assets\icon.png"

# Create the main form (native window)
$form = New-Object System.Windows.Forms.Form
$form.Text = "Clash Nodes"
$form.Size = New-Object System.Drawing.Size(980, 720)
$form.MinimumSize = New-Object System.Drawing.Size(440, 520)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(10, 15, 30)
$form.ForeColor = [System.Drawing.Color]::FromArgb(232, 237, 245)
$form.ShowIcon = $true

# Try to load icon
if (Test-Path $IconPath) {
    try { $form.Icon = [System.Drawing.Icon]::FromHandle(([System.Drawing.Bitmap]::new($IconPath)).GetHicon()) } catch {}
}

# Create WebView2 control
$webView = New-Object Microsoft.Web.WebView2.WinForms.WebView2
$webView.Dock = [System.Windows.Forms.DockStyle]::Fill
$webView.CreationProperties = New-Object Microsoft.Web.WebView2.WinForms.CoreWebView2CreationProperties
$webView.CreationProperties.BrowserExecutableFolder = $null  # Use system WebView2

# Navigate to the local HTML file
$webView.Source = New-Object System.Uri("file:///$($HtmlPath -replace '\\', '/')")

# Set dark background to avoid white flash
$webView.DefaultBackgroundColor = [System.Drawing.Color]::FromArgb(10, 15, 30)

$form.Controls.Add($webView)

# Ensure WebView2 runtime is available
try {
    $task = $webView.EnsureCoreWebView2Async($null)
    # Wait up to 5 seconds for WebView2 to initialize
    $task.Wait(5000) | Out-Null
} catch {
    [System.Windows.Forms.MessageBox]::Show(
        "WebView2 runtime is required but not found.`n`nPlease install it from: https://go.microsoft.com/fwlink/p/?LinkId=2124703",
        "Clash Nodes - Missing Runtime",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Error
    )
    exit 1
}

# Handle external links (open in default browser)
$webView.CoreWebView2.NewWindowRequested.Add({
    param($sender, $args)
    Start-Process $args.Uri
    $args.Handled = $true
})

# Show window and run message loop
$form.ShowDialog() | Out-Null
