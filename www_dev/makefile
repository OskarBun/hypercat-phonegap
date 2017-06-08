build:
	node_modules/.bin/jspm bundle-sfx --minify app/main ../www/main.min.js
	html-dist index.html --remove-all --minify --insert cordova.js --insert main.min.js -o ../www/main.html
