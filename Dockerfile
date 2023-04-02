# Build stage

FROM node:17.9.1-buster AS build


WORKDIR /api

COPY package.json .

RUN yarn 

COPY . .

# Final stage

FROM node:17.9.1-buster

WORKDIR /api

COPY --from=build /api/node_modules /api/node_modules
COPY --from=build /api/package.json /api/package.json
COPY --from=build /api/ /api/

EXPOSE 5000

CMD ["yarn","start"]