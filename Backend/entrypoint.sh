#!/bin/bash

export DJANGO_SETTINGS_MODULE="core.settings"

while ! psql -h database -U $POSTGRES_USER  -d $POSTGRES_DB -c "SELECT 1" 2> /dev/null | grep -c column 2> /dev/null
    do
        echo "Waiting for database to be created;"
    done

./manage.py makemigrations

./manage.py migrate


openssl req -x509 -newkey rsa:4096 -keyout transcendence.com.key -out transcendence.com.crt -days 365 -subj "/C=MA/ST=BNK/L=KH/O=1337/CN=transcendence.com"

# daphne -b 0.0.0.0 -p 8080 -e ssl:443:privateKey=./transcendence.com.key:certKey=./transcendence.com.crt core.asgi:application

daphne -b 0.0.0.0 -p 8000 core.asgi:application