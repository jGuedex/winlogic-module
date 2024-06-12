import {Module} from "./Module";

type EntityFieldSelect = {
	code: string;
	value: string;
}

export class EntityField {
  idEntityField: string | undefined;
  idEntity: string | undefined;
  columnType: string | undefined;
  length: string | undefined;
  numDecimals: number | undefined;
  mandatory: boolean | undefined;
  primaryKey: boolean | undefined;
  single: boolean | undefined;
  defaultValue: string | undefined;
  defaultValueDate: string | undefined;
  defaultValueSelect: string | undefined | null;
  defaultValueMultiSelect: string | undefined | null;
  defaultValueTextarea: string | undefined;
  visibleInList: boolean | undefined;
  viewApp: boolean | undefined;
  autocompleteType: string | undefined | null;
  entityFieldSelectValues: Array<EntityFieldSelect> | undefined;
  listToDelete: Array<string> | undefined;
  name: string | undefined;
  columnName: string | undefined;
  columnTypeTranslate: string | undefined;
  witdh: string | undefined;
  position: number | undefined;
}

export class Entity {
  geometryType: null | undefined;
  entityFields: Array<EntityField> | undefined;
  entityFieldsEes: Array<string> | undefined;
  hasAttachments: boolean | undefined;
  idEntity: string | undefined;
  name: string | undefined;
  tableName: string | undefined;
  module: Module | undefined;
  description: string | undefined;
  icon: string | undefined;
}
