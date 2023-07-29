#!/usr/bin/env bash

# Dependencies: openssl, xmlsec1, xmllint (libxml2-utils), xpath (libxml-xpath-perl)

red=`tput setaf 1`
green=`tput setaf 2`
blue=`tput setaf 4`
reset=`tput sgr0`

function err () {
  echo "$red$1$reset"
  exit 1;
}

function progress () {
  echo "$blue$1...$reset"
}

[[ -z "$1" ]] && err "No URL provided"
url=$1
domain=$(echo $url | awk -F[/:] '{print $4}')
[[ -z "$domain" ]] && err "Invalid URL provided"

temp_dir=$(mktemp --directory)
trap 'rm -rf -- "$temp_dir"' EXIT

# Fetch provided URL into $alert_path
progress "Fetching URL"
alert_path=$(mktemp --tmpdir=$temp_dir)
wget --quiet --output-document $alert_path $url

# Ensure provided URL is valid XML
progress ".Verifying valid XML"
xmllint --noout $alert_path > /dev/null 2>&1
[[ $? -ne 0 ]] && err "Invalid XML"

# Get the CANONICAL_URL parameter in the CAP alert -- this is the host whose TLS cert the
#  alert should have been signed with
progress "..Extracting source URL from XML"
url=$(xpath -q -e 'alert/info/parameter[valueName="CANONICAL_URL"]/value/text()' $alert_path)

# Ensure the CANONICAL_URL is valid
progress "Verifying $url"
domain=$(echo $url | awk -F[/:] '{print $4}')
[[ -z "$domain" ]] && err "Invalid URL provided"

# Verify the TLS certificate of the <web> URL
progress ".Verifying TLS Certificate"
verification="$(echo '' | openssl s_client -status -connect $domain:443 2>&1)"

verification_error=$(echo $verification | grep 'Verification error')
[[ $? -eq 0 ]] && err "TLS Verification failed"

verification_success=$(echo $verification | grep 'Verification: OK')
[[ $? -ne 0 ]] && err "TLS Verification failed"

progress "..Extracting TLS Certificate"
certificate="$(echo "$verification" | sed -n '/-----BEGIN/,/-----END/p')"

progress "...Extracting Public Key"
pubkey="$(echo "$certificate" | openssl x509 -pubkey -noout)"

pubkey_path=$(mktemp --tmpdir=$temp_dir)
echo "$pubkey" > $pubkey_path

progress "..Verifying XML Signature"
xmlsec1 --verify --pubkey-pem $pubkey_path $alert_path > /dev/null 2>&1

[[ $? -ne 0 ]] && err "Alert Signature Verification failed"

echo "${green}Alert is valid$reset"
