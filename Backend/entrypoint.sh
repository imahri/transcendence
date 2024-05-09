#!/bin/bash

pipenv shell

django-admin makemigrations

django-admin migrate

django-admin runserver 0.0.0.0:4242