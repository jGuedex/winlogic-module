import {OpenAIGPTservice} from "./genAIservice";
import {OPEN_AI_GPT_PROMPT_IDLE_CHAT} from "../conf/GptConstants";
import {extractJSONFromGptResponse} from "../utils/json";
import {Entity, EntityField} from "../model/Entity";
import {v4 as uuidv4} from "uuid";
import {ExternalAPI} from "./externalAPI";
import {randomId} from "../utils/id";
import {Module} from "../model/Module";

export class ModuleServices {
  async processGeneratedObjectModuleFromGPT(url: string): Promise<boolean | Error> {
    try {
      console.log(url);
    } catch (err) {
      return Error(err instanceof Error ? err.message : "Erro desconhecido");
    }
    return true;
  }

  handleRequiredFields(object: Entity): Entity {
    const modifiedObject = {...object};
    const entityId: EntityField = {
      "idEntityField": uuidv4(),
      "idEntity": "",
      "columnType": "NUMERIC",
      "length": "",
      "numDecimals": 0,
      "mandatory": true,
      "primaryKey": true,
      "single": true,
      "defaultValue": "",
      "defaultValueDate": "",
      "defaultValueSelect": null,
      "defaultValueMultiSelect": null,
      "defaultValueTextarea": "",
      "visibleInList": true,
      "viewApp": false,
      "autocompleteType": null,
      "entityFieldSelectValues": [],
      "listToDelete": [],
      "name": "id",
      "columnName": "id",
      "columnTypeTranslate": "Id",
      "witdh": "10",
      "position": 0,
    };

    const findPrimaryKeyIdx = object.entityFields?.findIndex((x) => x.columnName === "id") || -1;
    const randomCode = randomId(3).toUpperCase();

    modifiedObject.tableName += randomCode;

    // Alterando Module
    if (modifiedObject.module) {
      modifiedObject.module.codeModule = randomCode;
      modifiedObject.module.name += randomCode;
      modifiedObject.module.idModule = uuidv4();
    }

    // Verificando se um campo de primaryKey com nome de ID foi inserido pela IA. Caso contrário será inserido manualmente
    if (modifiedObject.entityFields) {
      if (findPrimaryKeyIdx > 0) {
        modifiedObject.entityFields[findPrimaryKeyIdx] = entityId;
      } else {
        modifiedObject.entityFields.unshift(entityId);
      }
    }

    object.entityFields?.forEach((entity, idx) => {
      // Tratando os tipos de colunas para garantir que estejam associadas corretamente

      if (modifiedObject.entityFields) {
        switch (entity.columnType) {
        case "SELECT":
          if (entity.defaultValue) {
            modifiedObject.entityFields[idx].defaultValueSelect = entity.defaultValue;
            modifiedObject.entityFields[idx].defaultValue = "";
          }
          break;
        case "MULTISELECT":
          if (entity.defaultValue) {
            modifiedObject.entityFields[idx].defaultValueMultiSelect = entity.defaultValue;
            modifiedObject.entityFields[idx].defaultValue = "";
          }
          break;
        }
      }
    });

    return modifiedObject;
  }

  async processUserQuestion(question: string): Promise<Entity | Error> {
    try {
      const gptService = new OpenAIGPTservice();

      // Prevenindo que o usuário jogue conversa fora com o GPT
      const gptIdleMessage = await gptService.fetch(question, OPEN_AI_GPT_PROMPT_IDLE_CHAT);
      if (gptIdleMessage instanceof Error) throw new Error(gptIdleMessage.message);

      let extractJSON = extractJSONFromGptResponse(gptIdleMessage.choices[0].message.content);
      let formatedJSON = extractJSON instanceof Array ? extractJSON[0] : extractJSON;

      if (!("status" in formatedJSON)) throw new Error("Objeto de retorno do GPT malformado. [#1134]");
      if (!formatedJSON.status) throw new Error(formatedJSON.message);

      // Solicitando ao LLM o objeto para ser gravado no banco
      const gpt = await gptService.fetch(question);

      if (gpt instanceof Error) throw new Error(gpt.message);

      extractJSON = extractJSONFromGptResponse(gpt.choices[0].message.content);
      formatedJSON = extractJSON instanceof Array ? extractJSON[0] : extractJSON;

      if (!("status" in formatedJSON)) throw new Error("Objeto de retorno do GPT malformado. [#1124]");
      if ("message" in formatedJSON) throw new Error(formatedJSON.message as unknown as string);
      if (!("module_insert" in formatedJSON) && !("message" in formatedJSON)) throw new Error("Objeto de retorno do GPT malformado. [#1125]");

      let entity: Entity = formatedJSON.module_insert as Entity;

      if (!entity) throw new Error("Objeto de entidade malformado. [#1135]");
      if (!entity.module) throw new Error("Objeto de módulo malformado. [#1136]");

      const externalAPI = new ExternalAPI();

      entity = this.handleRequiredFields(entity);

      // Consumindo API externa para cadastrar o módulo
      const postModule = await externalAPI.post("dynamic-modules/module/insert", entity.module as Module);
      if (postModule instanceof Error) throw new Error(postModule.message);
      if (!postModule) throw new Error("Impossível criar módulo. [#1127]");

      const newGeneratedModule = postModule as Module;
      if (entity.module) entity.module.idModule = newGeneratedModule.idModule;

      // Consumindo API externa para cadastrar a entidade
      const postEntity = await externalAPI.post("dynamic-modules/entity/insert", entity);
      if (postEntity instanceof Error) throw new Error(postEntity.message + "Objeto: " + JSON.stringify(entity));
      if (!postEntity) throw new Error("O módulo foi criado, mas houve algum erro ao inserir a entidade. [#1128]");

      return entity;
    } catch (err) {
      console.log("Erro em moduleServices");
      return Error(err instanceof Error ? err.message : "Erro desconhecido. [#1124]");
    }
  }
}
