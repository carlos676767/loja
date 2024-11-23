 export default class Alert {
  static alert(title, text, icon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
    });
  }
}


