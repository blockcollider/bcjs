#! /bin/sh

echo -e "GitHub Personal Token: \c"
# shellcheck disable=SC2039
read -rs token
echo "$token" | svn export --trust-server-cert-failures=unknown-ca\
    --force --username "$(git config --global github.user)"\
    --password-from-stdin\
    --non-interactive https://github.com/mmpmm/internalbcnode/branches/master/protos protos

# ugly hack for removing double global export
sed -i '' -e 's/package bc.*$/package bcsdk;/g' protos/*.proto
