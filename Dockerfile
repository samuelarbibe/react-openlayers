FROM node:16-alpine as build-deps
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm rebuild esbuild
RUN npm run build

FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=build-deps /usr/src/app/build /usr/src/app/build/
RUN npm install serve -g --silent
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]