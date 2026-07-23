terraform {
  required_version = ">= 1.5.0"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.22"
    }
  }
}

provider "cloudflare" {}

resource "cloudflare_pages_project" "website" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "main"
}

resource "cloudflare_pages_domain" "website" {
  count        = var.custom_domain == "" ? 0 : 1
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.website.name
  name         = var.custom_domain
}
