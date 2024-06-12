/* eslint-disable no-useless-escape */
export function extractJSONFromGptResponse(text: string): unknown | Error {
  try {
    text = text.replace(/(`)/g, "");
    text = text.replace(/json/g, "");

    const regex = /((\[[^\}]{3,})?\{s*[^\}\{]{3,}?:.*\}([^\{]+\])?)/g;
    const findJsonObj = text
      .replace(/\s(?=(?:[^"]*"[^"]*")*[^"]*$)/g, "")
      .match(regex);

    if (!findJsonObj) throw new Error("Objeto JSON não encontrado");
    const jsonObj = JSON.parse(
      findJsonObj[0].replace(/\,(?!\s*?[\{\[\"\'\w])/g, "")
    );

    return jsonObj;
    // return findJsonObj[0];
  } catch (err) {
    if (err instanceof Error) return new Error(err.message);
    return new Error("Impossivel formatar objeto JSON!");
  }
}

export function _extractJSONFromGptResponse(str: string): unknown | Error {
  let firstOpen = 0; let firstClose; let candidate;
  firstOpen = str.indexOf("{", firstOpen + 1);
  do {
    firstClose = str.lastIndexOf("}");
    if (firstClose <= firstOpen) {
      return null;
    }
    do {
      candidate = str.substring(firstOpen, firstClose + 1);
      try {
        const res = JSON.parse(candidate);
        return [res, firstOpen, firstClose + 1];
      } catch (e) {
        console.log("...failed");
      }
      firstClose = str.substr(0, firstClose).lastIndexOf("}");
    } while (firstClose > firstOpen);
    firstOpen = str.indexOf("{", firstOpen + 1);
  } while (firstOpen != -1);
  return null;
}
