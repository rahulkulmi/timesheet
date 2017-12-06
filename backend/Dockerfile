# Pull base image.
FROM ubuntu:16.04

# Install Node.js
RUN apt-get update && apt-get install -y curl
# Fix for sudo user in latest ubuntu image
RUN apt-get install -y sudo && rm -rf /var/lib/apt/lists/*
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential

# Install PM2
RUN npm install -g pm2

ENV NODE_ENV development

# ADD start.sh /start.sh
# RUN chmod 755 /start.sh

# Define working directory
WORKDIR /backend

# Define mountable directories.
VOLUME ["/backend"]


# Binds to port 9095
EXPOSE 9095

# ENTRYPOINT ["node"]
# Defines your runtime(define default command)
# pm2 start app.js --max-memory-restart 120M -i 4
CMD ["pm2-docker", "process.yml"]
# CMD ["/start.sh"]
