from fastapi import FastAPI

app = FastAPI(title='Auditor Digital API')

@app.get('/')
def read_root():
    return {'message': 'Bem-vindo à API do Auditor Digital'}
