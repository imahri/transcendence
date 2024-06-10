#!/bin/bash

export DJANGO_SETTINGS_MODULE="core.settings"

while ! pg_isready  -h database -U $POSTGRES_USER  -d $POSTGRES_DB  2> /dev/null
    do
        echo "Waiting for database to be created;"
    done

./manage.py makemigrations

./manage.py migrate

./manage.py init_badges

./manage.py init_paddles 

./manage.py init_boards 

./manage.py init_grades

./manage.py init_users

./manage.py init_acheivement

openssl req -x509 -newkey rsa:4096 -keyout transcendence.com.key -out transcendence.com.crt -days 365 -subj "/C=MA/ST=BNK/L=KH/O=1337/CN=transcendence.com" -nodes

daphne -b 0.0.0.0 -e ssl:443:privateKey=./transcendence.com.key:certKey=./transcendence.com.crt core.asgi:application