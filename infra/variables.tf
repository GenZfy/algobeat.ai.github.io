variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the Pages project."
  type        = string
}

variable "project_name" {
  description = "Cloudflare Pages project name."
  type        = string
  default     = "algobeat"
}

variable "custom_domain" {
  description = "Optional custom domain already active in the Cloudflare account."
  type        = string
  default     = "algobeat.ai"
}
