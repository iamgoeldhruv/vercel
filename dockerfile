FROM ubuntu:focal

RUN apt-get update
RUN apt-get install -y curl


# Install Node.js using curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

RUN apt-get install git -y


# Create a working directory
WORKDIR /home/app

# Copy script files into the container
COPY main.sh main.sh
COPY .env .env
COPY script.js script.js
COPY package.json package-lock.json ./
RUN npm install
# Give execution permissions to the script
RUN chmod +x main.sh
RUN chmod +x script.js

# Run the script on container startup
CMD ["bash", "./clone_and_run.sh"]