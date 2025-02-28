from flask import Flask

app = Flask(__name__)

# Aqui você pode adicionar outras configurações globais, se necessário

from app import routes