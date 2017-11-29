# Pull base image.
FROM ubuntu:16.04

# Install Node.js
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential

# Install PM2
RUN npm install -g pm2

ENV NODE_ENV development

ADD start.sh /start.sh
RUN chmod 755 /start.sh

# Define working directory
WORKDIR /ts-bot

# Define mountable directories.
VOLUME ["/ts-bot"]

# RUN npm install

# Binds to port 8085
EXPOSE 8085

# ENTRYPOINT ["node"]
# Defines your runtime(define default command)
# pm2 start app.js --max-memory-restart 120M -i 4
# CMD ["pm2-docker", "process.yml"]
CMD ["/start.sh"]
