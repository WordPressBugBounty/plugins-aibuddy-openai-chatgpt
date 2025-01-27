.PHONY: build install package

install:
	@echo "Installing..."
	composer install
	npm install

build:
	@echo "Building..."
	npm run build
	npm run free-build
	npm run pro-build

package:
	zip -r aibud-plugin.zip . -x ".git/*" ".github/*" "node_modules/*" ".editorconfig" ".gitignore" "DOCKER_ENV" "docker_tag" "Dockerfile-php-build" "gulpfile.js" "openapi.json" "output.log" "package-lock.json" "package.json" "README.md" "composer.json" "composer.lock" "webpack-free.config.js" "webpack-pro.config.js" "resources/*" "pro/resources/*" "blocks/*"
