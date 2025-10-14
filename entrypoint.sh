#!/bin/sh

# Garante que o arquivo crontab seja lido e aplicado
# (boa prática, embora o Docker já o copie)
crontab /etc/crontabs/root

# Inicia o daemon do cron em primeiro plano (foreground)
# O 'exec' é importante: ele substitui o processo do script pelo do crond,
# permitindo que o container pare corretamente quando receber um sinal.
exec crond -f