from flask import Flask, jsonify
from app import app

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "Backend funcionando!"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)