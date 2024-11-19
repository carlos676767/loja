CREATE TABLE USER (
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    status_assinatura TEXT NOT NULL DEFAULT 'NAO ASSINANTE',
    CONSTRAINT check_status CHECK (status_assinatura IN ('NAO ASSINANTE', 'ASSINANTE'))
);



CREATE TABLE HISTORICO_PAGAMENTO(
    iD_USER CONSTRAINT INTEGER  NOT NULL,
    DIA PAGAMENTO  VARCHAR(255) NOT NULL,
    HORA PAGAMENTO TIME NOT NULL,
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    FOREIGN KEY (iD_USER) REFERENCES USER(ID) ON DELETE CASCADE
)

CREATE TABLE CONTEUDO(
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    DATACONTEUDO DATE NOT NULL,
    NOME_IMG VARCHAR(255) NOT NULL,
    CONTEUDO VARCHAR(255) NOT NULL,
)