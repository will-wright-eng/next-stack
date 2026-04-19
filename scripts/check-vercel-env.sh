#!/bin/bash

# Check if required environment variables are present in Vercel
# Reads variable names from .env.local file
#
# Usage:
#   ./scripts/check-vercel-env.sh [environment]
#
# Examples:
#   ./scripts/check-vercel-env.sh production
#   ./scripts/check-vercel-env.sh preview
#   ./scripts/check-vercel-env.sh development

set -e

readonly PROD_ENV_FILE="src/.env.production"
readonly PREVIEW_ENV_FILE="src/.env.local"
readonly ENVIRONMENT="${1:-production}"

declare -a REQUIRED_VARS=()
declare -a PRESENT_VARS=()
declare -a MISSING_VARS=()

check_vercel_cli() {
  if ! command -v vercel &> /dev/null; then
    echo "Error: Vercel CLI is not installed"
    echo "   Install it with: npm i -g vercel"
    exit 1
  fi
}

set_env_file() {
  local env_file
  if [ "$ENVIRONMENT" == "production" ]; then
    env_file="$PROD_ENV_FILE"
  elif [ "$ENVIRONMENT" == "preview" ]; then
    env_file="$PREVIEW_ENV_FILE"
  else
    echo "Error: Invalid environment: $ENVIRONMENT"
    exit 1
  fi
  export ENV_FILE="$env_file"
}

check_env_file() {
  if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file not found at: $ENV_FILE"
    exit 1
  fi
}

parse_var_name() {
  local line="$1"
  local var_name="${line%%=*}"
  var_name=$(echo "$var_name" | xargs)
  echo "$var_name"
}

is_comment_or_empty() {
  local line="$1"
  [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]]
}

read_env_variables() {
  local var_name

  while IFS= read -r line || [ -n "$line" ]; do
    if is_comment_or_empty "$line"; then
      continue
    fi

    var_name=$(parse_var_name "$line")

    if [ -z "$var_name" ]; then
      continue
    fi

    REQUIRED_VARS+=("$var_name")
  done < "$ENV_FILE"

  if [ ${#REQUIRED_VARS[@]} -eq 0 ]; then
    echo "Error: No environment variables found in $ENV_FILE"
    exit 1
  fi
}

var_exists_in_vercel() {
  local var_name="$1"
  local env="$2"

  vercel env ls "$env" 2> /dev/null |
    awk 'NR>1 && $1=="'"$var_name"'" {found=1; exit} END {exit !found}'
}

check_all_variables() {
  echo "Checking Variables:"

  for var in "${REQUIRED_VARS[@]}"; do
    if var_exists_in_vercel "$var" "$ENVIRONMENT"; then
      echo "  [ok] $var"
      PRESENT_VARS+=("$var")
    else
      echo "  [missing] echo 'secret' | vercel env add $var $ENVIRONMENT"
      MISSING_VARS+=("$var")
    fi
  done
}

print_header() {
  echo "Checking Vercel environment variables for: $ENVIRONMENT"
  echo "Reading variables from: $ENV_FILE"
  echo ""
}

print_summary() {
  local total=${#REQUIRED_VARS[@]}
  local present=${#PRESENT_VARS[@]}
  local missing=${#MISSING_VARS[@]}

  echo ""
  echo "Summary:"
  echo "  Present: $present/$total"
  echo "  Missing: $missing/$total"
}

print_missing_vars_help() {
  echo ""
  echo "Missing required variables: ${MISSING_VARS[*]}"
  echo ""
  echo "To add missing variables, use:"
  echo "   vercel env add <VARIABLE_NAME> $ENVIRONMENT"
}

print_success() {
  echo ""
  echo "All required environment variables are present!"
}

main() {
  set_env_file
  check_env_file
  check_vercel_cli

  print_header
  read_env_variables
  echo "Found ${#REQUIRED_VARS[@]} variable(s) to check"
  echo ""

  check_all_variables

  print_summary

  if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    print_missing_vars_help
    exit 1
  else
    print_success
  fi
}

main
