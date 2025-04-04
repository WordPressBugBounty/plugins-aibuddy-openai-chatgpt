.PHONY: build install package-free package cleanup-build
# Variables for directories, zip file and filter file
BUILD_DIR := prod
install:
	@echo "Installing..."
	composer install
	npm install
build:
	@echo "Building..."
	npm run build
	npm run free-build
	npm run pro-build

cleanup-build:
	rm -rf $(BUILD_DIR)

package-free: cleanup-build 
	mkdir -p $(BUILD_DIR)/aibud-free
	rsync -r --delay-updates --filter=". build/free/filter" ./* prod/aibud-free
	cd $(BUILD_DIR)/ && zip -r aibud-free.zip ./aibud-free && rm -rf aibud-free

package:
	zip -r aibud-plugin.zip . -x ".git/*" ".github/*" "node_modules/*" ".editorconfig" ".gitignore" "DOCKER_ENV" "docker_tag" "Dockerfile-php-build" "gulpfile.js" "openapi.json" "output.log" "package-lock.json" "package.json" "README.md" "composer.lock" "webpack-free.config.js" "webpack-pro.config.js" "pro/resources/*" "prod/*" "Makefile" ".idea/*" ".DS_Store"
