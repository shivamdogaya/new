FROM node:alpine
EXPOSE 3000
WORKDIR ./
COPY package.json ./
RUN npm install --force
COPY . ./
CMD ["npm","start"]