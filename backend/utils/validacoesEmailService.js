class EmailValide {


 static valideEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    
    if (!regex.test(email)) {
      throw new Error("Invalid email");
    }


    if (!email) {
        throw new Error("please send email");
    }

    return true;
  }
}

module.exports = EmailValide
