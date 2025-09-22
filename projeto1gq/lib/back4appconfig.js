import Parse from "parse/dist/parse.min.js";

const APPLICATION_ID = "ZoPTUv6OGe6Fut1x3eVh5vsQrkhFKWMkCw379cCC";
const JAVASCRIPT_KEY = "zG4LP2AFWJ0co5JknL5DFZn0jp19kJnXy81jTmUV";
const SERVER_URL = "https://parseapi.back4app.com/";

// Inicializa a conexÃ£o com o Back4app
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

export default Parse;