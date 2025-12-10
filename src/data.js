export const RestaurantData = () => {
    console.log('this is the restaurant data handler. i will change it as i go.')

    function loadJsonFile(filename) {
        return require(`./data/${filename}.json`);
    }

    const menu = loadJsonFile('menu');
    const nav = loadJsonFile('nav');

    return { menu, nav };
}