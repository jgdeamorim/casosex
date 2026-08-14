//#region \0virtual:emdash/config
var config_default = {
	"database": {
		"entrypoint": "emdash/db/sqlite",
		"config": { "url": "file:./data.db" },
		"type": "sqlite"
	},
	"storage": {
		"entrypoint": "emdash/storage/local",
		"config": {
			"directory": "./uploads",
			"baseUrl": "/_emdash/api/media/file"
		}
	},
	"astroVersion": "7.2.1",
	"astroCspEnabled": false,
	"trailingSlash": "ignore",
	"i18n": {
		"defaultLocale": "pt-BR",
		"locales": ["pt-BR", "en"],
		"fallback": { "en": "pt-BR" },
		"prefixDefaultLocale": false
	}
};
//#endregion
export { config_default as t };
