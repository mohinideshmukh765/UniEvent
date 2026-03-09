$path = 'src/main/resources/static/js/coordinator.js'
$content = [System.IO.File]::ReadAllText($path)
$old = "coordinatorMobile: document.getElementById('evCoordinatorMobile').value"
$new = "coordinatorMobile: document.getElementById('evCoordinatorMobile').value,`r`n            requiresName: document.getElementById('field-name')?.checked ?? true,`r`n            requiresEmail: document.getElementById('field-email')?.checked ?? true,`r`n            requiresCollege: document.getElementById('field-college')?.checked ?? true,`r`n            requiresPayment: (parseFloat(document.getElementById('evFee').value) > 0) || (document.getElementById('field-payment')?.checked ?? false)"
$content = $content.Replace($old, $new)

$old2 = "coordinatorMobile: created.coordinatorMobile || document.getElementById('evCoordinatorMobile').value,"
$new2 = "coordinatorMobile: created.coordinatorMobile || document.getElementById('evCoordinatorMobile').value,`r`n                    requiresName: created.requiresName,`r`n                    requiresEmail: created.requiresEmail,`r`n                    requiresCollege: created.requiresCollege,`r`n                    requiresPayment: created.requiresPayment,"
$content = $content.Replace($old2, $new2)

[System.IO.File]::WriteAllText($path, $content)
