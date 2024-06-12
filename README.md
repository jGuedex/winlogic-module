# Winlogic - Módulos Dinâmicos

Instruções sobre a instalação dos módulos e como rodar a aplicação

## Instalação

Utilize o gestor de pacotes [npm](https://www.npmjs.com/) para instalar todos os pacotes.

```nodejs
npm install
```

## Rodando

Os módulos serão executados quando o *build* de TS para JS for efetuado.

A aplicação roda a partir da pasta **./functions/lib/**

Para efetuar o *build* execute o comando:
```nodejs
npx tsc
```

Para rodar a aplicação execute:
```nodejs
nodemon
```

Você não precisará efetuar o build todas as vezes que alterar o código. Em um outro terminal, execute:
```nodejs
npm run build:watch
```
Apenas aguarde alguns segundos para que o *hot reload* efetue o *build* novamente da aplicação.

## Importante!
O arquivo **conf/secrets/ApiAuthData.json** está com os seus valores de suas propriedades vazios.

O arquivo **conf/secrets/FirebaseKeys.json** está com os seus valores de suas propriedades vazios.

A constante OPEN_AI_KEY, em **conf/GptConstants.ts**, está vazia!

