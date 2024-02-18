
clean:
	@rm -rf ./node_modules
	@rm -rf ./dist
	@rm -rf ./.astro
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
	@git add .
	@git commit -m "Make deploy"
	@git push origin main
	@aws codebuild start-build --project-name misterorion-com --query 'build.buildStatus'

run: install build dev
