export const loadImage = async url => {
  let response = await new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.src = url;
  });
  return response;
}

export const loadLevel = async name => {
  // mock server
  const data = await require(`../lavels/${name}.json`);
  return data;
}
