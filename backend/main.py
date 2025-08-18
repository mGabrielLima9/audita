# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Importa o nosso novo arquivo de endpoint
from app.api.endpoints import dashboard

app = FastAPI(title='Auditor Digital API')

# Adiciona CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas do dashboard na nossa API principal
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get('/')
def read_root():
    return {'message': 'Bem-vindo à API do Auditor Digital'}