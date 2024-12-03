class RandomCod {
   static code(){
    return Array.from(Array(5).keys()).map( value =>  Math.floor(Math.random() * 50)).join(``)
    
   }
}

module.exports = RandomCod