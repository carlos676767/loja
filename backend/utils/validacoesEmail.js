class EmailValide {
#email
  constructor(email) {
    this.#email = this.#email;
  }

  valideEmail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test();

    if (!regex.test(this.#email)) {
      throw new Error("Invalid email");
    }

    return true;
  }
}

module.exports = EmailValide
