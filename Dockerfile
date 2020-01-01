FROM node:17-alpine3.12

RUN mkdir -p /home/swiftbot/
WORKDIR /home/swiftbot/

COPY package.json /home/swiftbot/

COPY /src /home/swiftbot/src
COPY /assets /home/swiftbot/assets
COPY config.js /home/swiftbot/config.js

WORKDIR /home/swiftbot/src
CMD ["node", "shard.js"]