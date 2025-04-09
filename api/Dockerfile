# Stage 1: Build da aplicação
FROM node:20-alpine AS builder

# Configurar um diretório de trabalho
WORKDIR /app

# Usar PNPM para instalação 
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar somente os arquivos necessários para a instalação das dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar o resto dos arquivos do projeto
COPY . .

# Construir a aplicação
RUN pnpm run build

# Remover arquivos de desenvolvimento
RUN pnpm prune --prod

# Stage 2: Criar a imagem de produção
FROM node:20-alpine AS production

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Criar um usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Configurar diretório de trabalho
WORKDIR /app

# Copiar os arquivos de build do estágio anterior
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json

# Expor a porta que a aplicação usa
EXPOSE 3000

# Configurar permissões corretas
RUN chmod -R 755 ./dist

# Mudar para o usuário não-root
USER appuser

# Configurar healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Comando para iniciar a aplicação
CMD ["node", "dist/main"]