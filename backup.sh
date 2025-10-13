#!/bin/sh
set -e

# Gera um nome de arquivo com data e hora (formato ISO 8601)
FILENAME="backup_$(date -Iseconds).db"

echo "Copiando /data/contratos.db para /backups/$FILENAME"

# Copia o arquivo de um volume para o outro
cp /data/contratos.db /backups/$FILENAME

echo "Backup concluído."