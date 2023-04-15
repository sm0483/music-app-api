#Build stage

FROM node:17.9.1-buster AS build


WORKDIR /api

COPY package.json .

RUN yarn 

COPY . .

# Final stage

FROM build AS development

WORKDIR /api


COPY --from=build /api/ /api/

EXPOSE 5000

CMD ["yarn","start"]