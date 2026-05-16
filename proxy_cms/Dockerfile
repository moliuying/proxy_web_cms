FROM node:16.14-alpine
RUN mkdir -p /code
WORKDIR /code
COPY . .
RUN yarn
RUN yarn build
CMD [ "yarn", "start" ]
