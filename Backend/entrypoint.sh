#!/bin/bash

django-admin makemigrations

django-admin migrate

openssl req -x509 -newkey rsa:4096 -keyout transcendence.com.key -out transcendence.com.crt -days 365 -subj "/C=MA/ST=BNK/L=KH/O=1337/CN=transcendence.com"

daphne -b 0.0.0.0:8080 --ssl --cert-file transcendence.com.crt --key-file transcendence.com.key core.asgi:application