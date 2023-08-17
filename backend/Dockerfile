# https://github.com/docker/awesome-compose/tree/master/flask
# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM python:3.10-alpine AS builder

WORKDIR /app

COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip \
    pip3 install -r requirements.txt

COPY . /app

RUN /bin/sh -c "ls --color -al /app"

# ENTRYPOINT ["python3"]

FROM builder as dev-envs

RUN apk update 
RUN apk add git


RUN addgroup -S docker
RUN adduser -S --shell /bin/bash --ingroup docker vscode

# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /

EXPOSE 5000

COPY ./docker-run.sh /app/docker-run.sh
RUN chmod +x /app/docker-run.sh
CMD ["/app/docker-run.sh"]