# Usa uma imagem base do Python
FROM python:3.9-slim

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código do projeto
COPY . .

# Expõe a porta 5001 (para evitar conflito com o outro projeto)
EXPOSE 5001

# Comando para rodar o backend
CMD ["python", "run.py"]  # Substitua "app.py" pelo arquivo principal do seu backend