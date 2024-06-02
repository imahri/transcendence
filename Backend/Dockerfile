FROM python:3.10

WORKDIR /app

COPY . .

RUN apt-get update

RUN apt-get -y install openssl pip \
        && pip install pipenv

RUN pipenv install

CMD [ "pipenv", "run", "entrypoint.sh"]