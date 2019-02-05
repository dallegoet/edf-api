import fetch from "node-fetch";
import convert from "xml-js";

export default class Client {
  constructor(username, password) {
    if (!username || !password) {
      throw new Error(
        "You need to specify your API username and password! (Find them on https://www.edf.fr/)"
      );
    }

    this.username = username;
    this.password = password;

    // tokens
    this._edfToken = null;
    this._edeliaToken = null;
  }

  async _getEdfToken() {
    return new Promise(async (resolve, reject) => {
      if (this._edfToken !== null) {
        resolve(this._edfToken);
      } else {
        // generated from curl
        let response = await fetch(
          "https://ws-mobile-particuliers.edf.com/ws/authentifierUnClientParticulier_restsso_V4-0/invoke",
          {
            body: `<tns:authentifierUnClientParticulier_Request xmlns:tns="http://www.edf.fr/commerce/psc/0175/authentifierUnClientParticulier/v4"><login>${
              this.username
            }</login><password>${
              this.password
            }</password><code>555256</code></tns:authentifierUnClientParticulier_Request>`,
            headers: {
              Host: "ws-mobile-particuliers.edf.com",
              "Content-Type": "text/xml",
              "Accept-Language": "fr-fr",
              Accept: "*/*",
              "User-Agent": "edfetmoi/8.0.1/iOS",
              Authorization: "Basic RURGRVRNT0lfaVBob25lOlNtNVpCQC1lJWt0Sw=="
            },
            method: "POST"
          }
        );

        response = await response.text();
        const parsedXml = convert.xml2js(response);
        this._edfToken =
          parsedXml.elements[0].elements[1].elements[0].elements[0].text;

        resolve(this._edfToken);
      }
    });
  }

  async _getEdeliaToken() {
    return new Promise(async (resolve, reject) => {
      if (this._edeliaToken !== null) {
        resolve(this._edeliaToken);
      } else {
        const edfToken = await this._getEdfToken();
        // generated from curl
        let response = await fetch(
          "https://api.edelia.fr/authorization-server/oauth/token",
          {
            body: `bp=5008783804&client_id=u2x7nzywGM443r36J4E8276BQq257284UC23M4QAxz96eAPn92qyDw6tLs76SnsAi9HrcQH3AV7Mx4LCFke9A7F8L9Eg2kCpg2uP48XWhe6qwt2eg59Np3SP243TEpM87vGXHfX3hYiU4CK9ki2LpsH8uM67v9uw2tfq7RiBysG6iMZvQh2yC98djAuNX2ZDnQZs74Fh&grant_type=edf_sso&jeton_sso=${edfToken}&pdl=19149348566146`,
            headers: {
              Host: "api.edelia.fr",
              "Content-Type":
                "application/x-www-form-urlencoded; charset=utf-8",
              Accept: "*/*",
              "User-Agent": "EDFetMoi/2 CFNetwork/976 Darwin/18.2.0",
              "Accept-Language": "fr-fr",
              "Accept-Encoding": "deflate, gzip"
            },
            method: "POST"
          }
        );

        response = await response.json();

        this._edeliaToken = response.access_token;
        resolve(this._edeliaToken);
      }
    });
  }

  async getDailyElectricConsumptions(begin, end) {
    const edeliaToken = await this._getEdeliaToken();

    // format moment objects
    begin = begin.format("YYYY-MM-DD");
    end = end.format("YYYY-MM-DD");

    // generated from curl
    let response = await fetch(`https://api.edelia.fr/api/v1/sites/-/daily-elec-consumptions?begin-date=${begin}&end-date=${end}&isIndicatorEstimationWanted=1`,
      {
        headers: {
          Host: "api.edelia.fr",
          Accept: "*/*",
          "User-Agent": "EDFetMoi/2 CFNetwork/976 Darwin/18.2.0",
          "Accept-Language": "fr-fr",
          Authorization: `Bearer ${edeliaToken}`,
          "Accept-Encoding": "deflate, gzip"
        },
        method: "GET"
      }
    );
    
    response = await response.json();

    return response;
  }
}