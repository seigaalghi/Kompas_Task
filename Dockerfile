FROM node:14.15 AS client-build
WORKDIR /usr/src/app
COPY client/ ./client/
RUN cd client && npm install && npm run build

FROM node:14.15 AS server-build
WORKDIR /root/
COPY --from=client-build /usr/src/app/client/build ./my-app/build
COPY api/server ./my-app/
RUN cd my-app && npm install

EXPOSE 3080

CMD ["node", "./my-app/index.js"]