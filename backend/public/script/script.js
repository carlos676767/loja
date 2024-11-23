// import Alert from '../../utils/alert';
"use strict";

class HttpRequest {
  static button = document.querySelector(`button`);

  static getTokenJwt() {
    console.log(location.href.split(`=`)[1]);
    
    return location.href.split(`=`)[1];
  }

  static objectValues() {
    const novasenha = document.getElementById(`nova-senha`).value;
    const senhaAntiga = document.getElementById(`nova-senha`).value;

    return {
      OldPassword: novasenha,
      NewPassword: senhaAntiga,
    };
  }

  static async httpSendDados() {
    try {
      const dados = await fetch(`http://localhost:8080/resetPass`, {
        method: `PATCH`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HttpRequest.getTokenJwt()}`,
        },
        body: JSON.stringify(this.objectValues()),
      });
    
      console.log(dados);
      const jsonReponse = await dados.json()
      console.log(jsonReponse);
      
      if (dados.ok) {
        const config = {
          title: `the password has been changed successfully.`,
          msgErr: `Your password has been changed successfully.`,
          icon: `success`,
        };
        Alert.alert(config.title, config.msgErr, config.icon);
      }
    } catch (error) {
        Alert.alert(`unexpected error`, error, `error`);
    }
  }

  static eventButton() {
    this.button.addEventListener(`click`, async (e) => {
        e.preventDefault()
      await this.httpSendDados();
    });
  }
}


HttpRequest.eventButton()