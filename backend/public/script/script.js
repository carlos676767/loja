
"use strict";

class GetToken {
  static getTokenJwt() {
    return location.href.split(`=`)[1];
  }
}

class DadosInput {
  static objectValues() {
    const novasenha = document.getElementById(`nova-senha`).value;
    const senhaAntiga = document.getElementById(`nova-senha`).value;
    return {
      OldPassword: novasenha,
      NewPassword: senhaAntiga,
    };
  }
}


class HttpRequest extends GetToken {
  static async httpSendDados() {
    try {
      const dados = await fetch(`http://localhost:8080/resetPass`, {
        method: `PATCH`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${HttpRequest.getTokenJwt()}`,
        },
        body: JSON.stringify(DadosInput.objectValues()),
      });
    
     
      if (dados.ok) {
        const config = {
          title: `the password has been changed successfully.`,
          msgErr: `Your password has been changed successfully.`,
          icon: `success`,
        };
        alert(config.title, config.msgErr, config.icon);
      }
    } catch (error) {
        alert(`unexpected error`, error, `error`);
    }
  }
}

class ButtonEvent extends HttpRequest {
  static button = document.querySelector(`button`);
  static buttonEventAdd(){
    this.button.addEventListener(`click`,async () => {
      await this.httpSendDados()
    })
  }
}

ButtonEvent.buttonEventAdd()