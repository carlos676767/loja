const getHours = () => {
  const agora = new Date();
  return `${agora.getHours().toString()}:${agora.getMinutes()}`;
};

export default getHours