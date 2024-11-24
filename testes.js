// Supondo que você tenha um token JWT armazenado em uma variável ou no localStorage
const token = 'seu-token-jwt-aqui';  // Substitua com seu token real

fetch('http://localhost:8080/middleware-login', {
  method: 'GET',  // Método GET
  headers: {
    'Authorization': `Bearer ${token}`,  // Passando o token JWT no cabeçalho Authorization
    'Content-Type': 'application/json'   // Se necessário, defina o tipo de conteúdo
  }
})
  .then(response => response.json())  // Resposta em JSON
  .then(data => {
    console.log('Dados recebidos:', data);
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
  });
