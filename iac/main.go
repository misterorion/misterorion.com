package main

import (
	"os"

	"github.com/pulumi/pulumi-cloudflare/sdk/v5/go/cloudflare"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi/config"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {

		config := config.New(ctx, "")

		pagesProject, err := cloudflare.NewPagesProject(ctx, "misterorion.com", &cloudflare.PagesProjectArgs{
			AccountId: config.RequireSecret("cf-account-id"),
			BuildConfig: &cloudflare.PagesProjectBuildConfigArgs{
				BuildCaching:   pulumi.Bool(false),
				BuildCommand:   pulumi.String("npm run build"),
				DestinationDir: pulumi.String("dist"),
			},
			DeploymentConfigs: &cloudflare.PagesProjectDeploymentConfigsArgs{
				Production: &cloudflare.PagesProjectDeploymentConfigsProductionArgs{
					EnvironmentVariables: pulumi.StringMap{
						"PUBLIC_FRONTEND_AUTH_KEY": config.RequireSecret("public-frontend-auth-key"),
					},
				},
			},
			Name:             pulumi.String("misterorion-com"),
			ProductionBranch: pulumi.String("main"),
			Source: &cloudflare.PagesProjectSourceArgs{
				Config: &cloudflare.PagesProjectSourceConfigArgs{
					ProductionBranch:  pulumi.String("main"),
					Owner:             pulumi.String("misterorion"),
					PrCommentsEnabled: pulumi.Bool(false),
					RepoName:          pulumi.String("misterorion.com"),
				},
				Type: pulumi.String("github"),
			},
		})
		if err != nil {
			return err
		}

		mailerScriptContents, err := os.ReadFile("mailer.js")
		if err != nil {
			return err
		}

		worker, err := cloudflare.NewWorkersScript(ctx, "mailer", &cloudflare.WorkersScriptArgs{
			AccountId:         config.RequireSecret("cf-account-id"),
			CompatibilityDate: pulumi.String("2024-09-02"),
			Content:           pulumi.String(string(mailerScriptContents)),
			Module:            pulumi.Bool(true),
			Name:              pulumi.String("misterorion-com-mailer"),
			PlainTextBindings: cloudflare.WorkersScriptPlainTextBindingArray{
				&cloudflare.WorkersScriptPlainTextBindingArgs{
					Name: pulumi.String("ALLOWED_ORIGIN"),
					Text: pulumi.String("misterorion.com"),
				},
			},
		})
		if err != nil {
			return err
		}

		_, err = cloudflare.NewWorkersRoute(ctx, "mailer", &cloudflare.WorkersRouteArgs{
			ZoneId:     config.RequireSecret("cf-zone-id"),
			Pattern:    pulumi.String("misterorion.com/contact/"),
			ScriptName: worker.Name,
		}, pulumi.DeleteBeforeReplace(true))
		if err != nil {
			return err
		}

		_, err = cloudflare.NewWorkersSecret(ctx, "mg-api-key", &cloudflare.WorkersSecretArgs{
			AccountId:  config.RequireSecret("cf-account-id"),
			Name:       pulumi.String("MAILGUN_API_KEY"),
			ScriptName: worker.Name,
			SecretText: config.RequireSecret("mg-api-key"),
		}, pulumi.DeleteBeforeReplace(true))
		if err != nil {
			return err
		}

		_, err = cloudflare.NewWorkersSecret(ctx, "frontend-auth-key", &cloudflare.WorkersSecretArgs{
			AccountId:  config.RequireSecret("cf-account-id"),
			Name:       pulumi.String("PUBLIC_FRONTEND_AUTH_KEY"),
			ScriptName: worker.Name,
			SecretText: config.RequireSecret("public-frontend-auth-key"),
		}, pulumi.DeleteBeforeReplace(true))
		if err != nil {
			return err
		}

		_, err = cloudflare.NewPagesDomain(ctx, "misterorion.com", &cloudflare.PagesDomainArgs{
			AccountId:   config.RequireSecret("cf-account-id"),
			ProjectName: pagesProject.Name,
			Domain:      pulumi.String("misterorion.com"),
		})
		if err != nil {
			return err
		}

		return nil
	})
}
