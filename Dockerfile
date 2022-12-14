FROM elixir:1.14

RUN apt-get update \
  && apt-get install -y \
    build-essential \
    curl

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -

RUN curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg \
  && echo "deb http://apt.postgresql.org/pub/repos/apt/ bullseye-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list

RUN apt-get update \
  && apt-get install -y \
    postgresql-client-14 \
    nodejs \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g npm prettier prettier-plugin-sh
RUN mix local.hex --force && mix local.rebar --force

RUN mkdir /test_apps
WORKDIR /test_apps

CMD ["bash"]
