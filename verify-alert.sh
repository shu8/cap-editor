#!/usr/bin/env bash

# Dependencies: openssl, xmlsec1

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

progress "Verifying $url"

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

temp_dir=$(mktemp --directory)
trap 'rm -rf -- "$temp_dir"' EXIT

pubkey_path=$(mktemp --tmpdir=$temp_dir)
echo "$pubkey" > $pubkey_path

alert_path=$(mktemp --tmpdir=$temp_dir)

progress ".Fetching Alert XML"
wget --quiet --output-document $alert_path $url

progress "..Verifying XML Signature"
xmlsec1 --verify --pubkey-pem $pubkey_path $alert_path > /dev/null 2>&1

[[ $? -ne 0 ]] && err "Alert Signature Verification failed"

echo "${green}Alert is valid$reset"

# TODO only check the URL written inside the alert
# https://dzone.com/articles/ocsp-validation-with-openssl
# openssl s_client -connect revoked.badssl.com:443 < /dev/null 2>&1 |  sed -n '/-----BEGIN/,/-----END/p' > certificate.pem
# openssl s_client -showcerts -connect revoked.badssl.com:443 < /dev/null 2>&1 |  sed -n '/-----BEGIN/,/-----END/p' > chain.pem
# OCSP_URL=`openssl x509 -noout -ocsp_uri -in certificate.pem`
# openssl ocsp -issuer chain.pem -cert certificate.pem -text -url $OCSP_URL
