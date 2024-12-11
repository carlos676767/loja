CREATE TABLE USER (
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    status_assinatura TEXT NOT NULL DEFAULT 'NAO ASSINANTE',
    CONSTRAINT check_status CHECK (status_assinatura IN ('NAO ASSINANTE', 'ASSINANTE'))
);


 
CREATE TABLE CONTEUDO(
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    DATACONTEUDO DATE NOT NULL,
    NOME_IMG VARCHAR(255) NOT NULL,
    CONTEUDO VARCHAR(255) NOT NULL,
    PRECO_CONTEUDO REAL NOT NULL
)

CREATE TABLE HISTORICO_PAGAMENTO(
    iD_USER CONSTRAINT INTEGER  NOT NULL,
    DIA_PAGAMENTO  VARCHAR(255) NOT NULL,
    HORA_PAGAMENTO VARCHAR(255) NOT NULL,
    ID INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    FOREIGN KEY (iD_USER) REFERENCES USER(ID) ON DELETE CASCADE
)


CREATE TABLE CONTEUDOSCOMPRADOSUSUARIO(
    ID_CONTEUDO INTEGER NOT NULL,
    ID_USUARIO INTEGER NOT NULL,
    FOREIGN KEY ( ID_USUARIO) REFERENCES USER(ID) ,
    FOREIGN KEY (ID_CONTEUDO ) REFERENCES CONTEUDO(ID) 
)



CREATE TABLE CUPOM(
    CUPOM VARCHAR(255) UNIQUE NOT NULL,
    VALOR_CUPOM REAL NOT NULL,
    DATA_EXPIRACAO VARCHAR(255) NOT NULL,
    TOTAL_USUARIOS_CUPOM  REAL NOT NULL
)


SELECT 
    CONTEUDOSCOMPRADOSUSUARIO.ID_CONTEUDO, 
    CONTEUDO.CONTEUDO,
    HISTORICO_PAGAMENTO.DIA_PAGAMENTO, 
    HISTORICO_PAGAMENTO.HORA_PAGAMENTO
FROM 
    CONTEUDOSCOMPRADOSUSUARIO
JOIN 
    CONTEUDO 
ON 
    CONTEUDOSCOMPRADOSUSUARIO.ID_CONTEUDO = CONTEUDO.ID
JOIN 
    HISTORICO_PAGAMENTO 
ON 
    HISTORICO_PAGAMENTO.ID_USER = CONTEUDOSCOMPRADOSUSUARIO.ID_USUARIO
WHERE 
    CONTEUDOSCOMPRADOSUSUARIO.ID_USUARIO = 3
ORDER BY 
    CONTEUDO.NOME_IMG ASC;