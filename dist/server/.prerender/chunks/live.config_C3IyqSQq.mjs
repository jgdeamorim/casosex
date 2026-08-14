import { t as defineLiveCollection } from "./config_CiG08VVD.mjs";
import { i as emdashLoader } from "./loader-C1XOLV5b_BlhHvfIP.mjs";
import "./types-XrQQ-Aex_rb6o-8d1.mjs";
//#endregion
//#region src/live.config.ts
/**
* EmDash Live Content Collections
*
* Defines the _emdash collection that handles all content types from the database.
* Query specific types using getEmDashCollection() and getEmDashEntry().
*/
var collections = { _emdash: defineLiveCollection({ loader: emdashLoader() }) };
//#endregion
export { collections };
