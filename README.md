# Algobeat website

A fast, accessible static website for Algobeat, deployed on Cloudflare Pages.

## Local development

```bash
npm install
npm run dev
```

Run the repository checks with `npm run check`.

## Cloudflare deployment

The production site is the `public/` directory. `wrangler.jsonc` keeps the Pages
runtime configuration in source control.

### Automatic deployment

The GitHub Actions workflow validates pull requests and deploys `main`. Add these
repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN` (Account / Cloudflare Pages / Edit)

The workflow deploys to the `algobeat` Pages project.

### Infrastructure as code

Terraform in `infra/` creates the Pages project and attaches `algobeat.ai`.
Authenticate with `CLOUDFLARE_API_TOKEN`, then:

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# Add the real account ID to terraform.tfvars.
terraform init
terraform plan
terraform apply
```

If the project already exists, import it before applying:

```bash
terraform import cloudflare_pages_project.website '<account-id>/algobeat'
```

For an existing custom domain, import it as documented by the Cloudflare
provider or temporarily set `custom_domain = ""`.

## Cloudflare dashboard alternative

For Git integration, use no framework preset, leave the build command blank
(or use `exit 0`), and set the output directory to `public`.
