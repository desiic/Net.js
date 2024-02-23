echo "1. Pack"
echo "2. Pack Dev"
read -p "Enter a choice (1..2): " Choice
echo

if [[ $Choice == 1 ]]; then
    webpack bundle --stats-error-details
elif [[ $Choice == 2 ]]; then
    webpack bundle --stats-error-details --config webpack-dev.config.js
else
    echo "No such choice"
fi
# EOF