from app import db

class Contrato(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"Contrato('{self.nome}', '{self.descricao}')"