#!/bin/bash

export DJANGO_SETTINGS_MODULE="core.settings"

./manage.py makemigrations

./manage.py migrate


openssl req -x509 -newkey rsa:4096 -keyout transcendence.com.key -out transcendence.com.crt -days 365 -subj "/C=MA/ST=BNK/L=KH/O=1337/CN=transcendence.com"

# daphne -b 0.0.0.0 -p 8080 -e ssl:443:privateKey=./transcendence.com.key:certKey=./transcendence.com.crt core.asgi:application

daphne -b 0.0.0.0 -p 8000 core.asgi:application