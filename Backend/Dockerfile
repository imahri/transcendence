FROM python:3.10

RUN apt-get update

RUN apt-get -y install postgresql openssl pip

WORKDIR /app

COPY . .

RUN pip install pipenv

RUN pipenv install

CMD [ "pipenv", "run", "bash", "entrypoint.sh"]