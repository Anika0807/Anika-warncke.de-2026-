// Entferne Custom-Cursor-Code
document.body.style.cursor = 'auto';

// Projektvorschau bei Hover/Focus auf Projektbuttons anzeigen (wie in P2_IA_Schlaf.html)
document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll('.projekt-btn').forEach(function(btn) {
		var vorschau = btn.parentElement.querySelector('.projekt-vorschau');
		btn.addEventListener('mouseenter', function() {
			if(vorschau) vorschau.style.display = 'block';
		});
		btn.addEventListener('mouseleave', function() {
			if(vorschau) vorschau.style.display = 'none';
		});
		btn.addEventListener('focus', function() {
			if(vorschau) vorschau.style.display = 'block';
		});
		btn.addEventListener('blur', function() {
			if(vorschau) vorschau.style.display = 'none';
		});
		if(vorschau) {
			vorschau.addEventListener('mouseenter', function() {
				vorschau.style.display = 'block';
			});
			vorschau.addEventListener('mouseleave', function() {
				vorschau.style.display = 'none';
			});
		}
	});
});