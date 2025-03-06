# Usa uma imagem base do Node.js (versão 18)
FROM node:18-alpine as build-stage

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Constrói o projeto
RUN npm run build

# Usa uma imagem leve do Nginx para servir o frontend
FROM nginx:alpine as production-stage

# Copia os arquivos construídos para o diretório do Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expõe a porta 8080 (para evitar conflito com o outro projeto)
EXPOSE 8080

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]