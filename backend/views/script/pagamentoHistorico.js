
class InputDados {
   static select = document.querySelector(`select`)
   static input = document.querySelector(`input`)


   static optionSelect(){
    return this.select.value
   }

   static inputValue(){
    return this.input.value.trim()
   }
}


class GetItens extends InputDados {
  static async getItens(){
    const getItem = await fetch(`http://localhost:8080/filter/${GetItens.optionSelect()}/${GetItens.inputValue()}`, {
        method: `GET`
    })
    console.log(await getItem.json(), `aaaaaaaaaaaaa`);
    
    if (getItem.ok) {
        return await getItem.json()
    }
  }
}


class ViewItem extends GetItens {
  static ul = document.querySelector(`ul`);
  static async viewItem() {
    const itens = await GetItens.getItens()
    console.log(itens);
    
  }
}

class ButtonEvent extends ViewItem {
   static button = document.querySelector(`button`)


   static buttonEvent(){
    this.button.addEventListener(`click`, () => {
        this.viewItem()
    })
   }
}

ButtonEvent.buttonEvent()