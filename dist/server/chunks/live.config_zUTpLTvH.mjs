import "./base64-B-PsqheR_CqpGr57O.mjs";
import "./types-XrQQ-Aex_D1dMYdDm.mjs";
import { i as emdashLoader } from "./loader-C1XOLV5b_C3i6HyEe.mjs";
import { t as defineLiveCollection } from "./config_DVajSuk3.mjs";
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
