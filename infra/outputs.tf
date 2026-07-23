output "pages_project" {
  value = cloudflare_pages_project.website.name
}

output "pages_subdomain" {
  value = cloudflare_pages_project.website.subdomain
}
