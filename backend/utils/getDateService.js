const GetDate = () => {
  const agora = new Date();
  const day = agora.getDay();
  const year = agora.getFullYear();
  const month = String(agora.getMonth() + 1);

  return `${month}/${day}/${year}`;
};

module.exports = GetDate;
