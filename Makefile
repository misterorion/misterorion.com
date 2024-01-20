
clean:
	@rm -rf ./node_modules
	@rm -rf ./dist
	@rm package-lock.json
	@make lockfile

install:
	@npm install

build: install
	@npm run build

lockfile:
	@npm install --package-lock-only

dev:
	@npm run dev

deploy:
	@aws codebuild start-build --project-name misterorion-com

run: install build dev
