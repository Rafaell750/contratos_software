from flask import Flask

# Cria a instância do Flask
app = Flask(__name__)

# Configurações e extensões do Flask podem ser adicionadas aqui

# Importa as rotas (se estiverem em outro arquivo, como routes.py)
from .routes import *