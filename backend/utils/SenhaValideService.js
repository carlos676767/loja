class SenhaValide {
  static regexSenhaValide = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

 static validacoesSenha(senha) {
    if (senha.length < 7) {
        throw new Error("The password must be at least 7 characters long");
    }

    if (!senha) {
        throw new Error("please send password");  
    }

    if (!SenhaValide.regexSenhaValide.test(senha)) {
        throw new Error("The password must contain at least one uppercase letter, one lowercase letter, one number and one special character");
    }
    
    return true
  } 
}

module.exports = SenhaValide;
