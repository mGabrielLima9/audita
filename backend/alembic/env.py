from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# --- NOSSAS ADIÇÕES - INÍCIO ---

# 1. Importa as configurações para ler a URL do banco de dados do arquivo .env
from app.core.config import settings

# 2. Importa a Base dos nossos modelos para que o Alembic saiba qual estrutura usar
from app.core.database import Base

# 3. Importa todos os modelos para que o Alembic os detecte automaticamente
from app.models.empresa import Empresa
from app.models.declaracao_pgdas import DeclaracaoPGDAS
from app.models.pagamento_daf import PagamentoDAF

# --- NOSSAS ADIÇÕES - FIM ---


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata

# --- NOSSA ALTERAÇÃO ---
# Aponta para os metadados da nossa Base, que contém todos os nossos modelos
target_metadata = Base.metadata
# --- FIM DA ALTERAÇÃO ---


# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    # Usaremos a URL do nosso arquivo de configuração também no modo offline
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # --- NOSSA ALTERAÇÃO ---
    # Esta seção usa um dicionário 'configuration' para pegar os dados do alembic.ini
    configuration = config.get_section(config.config_ini_section)
    
    # Nós forçamos o Alembic a usar a URL do nosso arquivo .env
    configuration['sqlalchemy.url'] = settings.DATABASE_URL
    
    connectable = engine_from_config(
        configuration, # Agora ele usa a configuração que acabamos de modificar
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    # --- FIM DA ALTERAÇÃO ---

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()