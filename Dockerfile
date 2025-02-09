# Сборка фронтенда
FROM node:18 AS frontend

WORKDIR /deepseek
COPY . .
RUN npm install && npm run build

# Основной контейнер
FROM ubuntu:latest

# Устанавливаем только Supervisor
RUN apt update && apt install -y supervisor

# Копируем весь проект в контейнер
WORKDIR /deepseek
COPY . .

# Копируем Supervisor конфиг
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Открываем порты
EXPOSE 3000 11434

# Запускаем Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
