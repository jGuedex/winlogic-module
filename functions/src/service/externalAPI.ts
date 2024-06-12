import axios, {AxiosError} from "axios";
import ExternalAPIData from "../conf/secrets/ApiAuthData.json";

export class ExternalAPI {
  token: string | undefined;

  async post(endpoint: string, object: object): Promise<object | Error> {
    try {
      if (!this.token) await this.auth();

      const fetch = await axios.post(
        `${ExternalAPIData.apiUrl}/${endpoint}`,
        object,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

      if (!("data" in fetch)) throw new Error("Não foi possível conectar à API externa. [#1008]");
      const data = fetch.data;

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
      }

      let msg = "Erro desconhecido";
      if (err instanceof AxiosError) {
        switch (err.response?.status) {
        case 400:
          msg = "Impossível conectar à API externa. [#1007]";
          break;
        case 401:
          msg = "Usuário e senha da API externa estão errados. [#1001]";
          break;
        case 403:
          msg = "Acesso proibido à API externa. [#1002]";
          break;
        case 404:
          msg = "API Externa inalcançável. [#1005]";
          break;
        case 409:
          msg = "O registro a ser enserido já existe no banco de dados externo. [#10014]";
          break;
        default:
          msg = "Houve algum erro desconhecido ao tentar se conectar à API externa. [#1003]";
        }
      }

      return new Error(msg);
    }
  }

  async get(endpoint: string): Promise<object | Error> {
    try {
      if (!this.token) await this.auth();

      const fetch = await axios.get(
        `${ExternalAPIData.apiUrl}/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

      if (!("data" in fetch)) throw new Error("Não foi possível conectar à API externa. [#1008]");
      const data = fetch.data;

      return data;
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err);
      }

      let msg = "Erro desconhecido";
      if (err instanceof AxiosError) {
        switch (err.response?.status) {
        case 400:
          msg = "Impossível conectar à API externa. [#1007]";
          break;
        case 401:
          msg = "Usuário e senha da API externa estão errados. [#1001]";
          break;
        case 403:
          msg = "Acesso proibido à API externa. [#1002]";
          break;
        case 404:
          msg = "API Externa inalcançável. [#1005]";
          break;
        default:
          msg = "Houve algum erro desconhecido ao tentar se conectar à API externa. [#1003]";
        }
      }

      return new Error(msg);
    }
  }

  async auth(): Promise<boolean | Error> {
    try {
      const fetch = await axios.post(`${ExternalAPIData.apiUrl}/auth/permission/getToken`, {user: ExternalAPIData.user, password: ExternalAPIData.password});

      if (!("data" in fetch)) throw new Error("Não foi possível conectar à API externa. [#1000]");
      const data = fetch.data;

      this.token = data.access_token;

      return true;
    } catch (err) {
      let msg = "Erro desconhecido";
      if (err instanceof AxiosError) {
        switch (err.response?.status) {
        case 401:
          msg = "Impossível conectar à API externa. [#901]";
          break;
        case 404:
          msg = "API Externa inalcançável. [#902]";
          break;
        default:
          msg = "Houve algum erro ao tentar se conectar à API externa. [#903]";
        }
      }

      return new Error(msg);
    }
  }
}
