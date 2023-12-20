/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const snapshot = [
    {
      "id": "_pb_users_auth_",
      "created": "2023-11-02 15:17:01.042Z",
      "updated": "2023-11-15 08:19:54.650Z",
      "name": "users",
      "type": "auth",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "users_name",
          "name": "name",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "users_avatar",
          "name": "avatar",
          "type": "file",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": [
              "image/jpeg",
              "image/png",
              "image/svg+xml",
              "image/gif",
              "image/webp"
            ],
            "thumbs": null,
            "protected": false
          }
        }
      ],
      "indexes": [],
      "listRule": "id = @request.auth.id && @request.auth.verified = true",
      "viewRule": "",
      "createRule": "",
      "updateRule": "id = @request.auth.id && @request.auth.verified = true",
      "deleteRule": "id = @request.auth.id && @request.auth.verified = true",
      "options": {
        "allowEmailAuth": true,
        "allowOAuth2Auth": true,
        "allowUsernameAuth": true,
        "exceptEmailDomains": null,
        "manageRule": null,
        "minPasswordLength": 8,
        "onlyEmailDomains": null,
        "requireEmail": false
      }
    },
    {
      "id": "n2638o4obmw7ght",
      "created": "2023-11-07 13:54:50.768Z",
      "updated": "2023-11-07 17:53:37.033Z",
      "name": "boards",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "fllp6ifm",
          "name": "title",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "tfreee8v",
          "name": "creator",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        }
      ],
      "indexes": [],
      "listRule": null,
      "viewRule": "",
      "createRule": "creator.id = @request.auth.id && @request.auth.verified = true",
      "updateRule": "@request.auth.verified = true && (creator.id = @request.auth.id || (@request.data.creator:isset = false && @request.data.title:isset = false))",
      "deleteRule": "creator.id = @request.auth.id && @request.auth.verified = true",
      "options": {}
    },
    {
      "id": "j1cu1ap2yex4nwr",
      "created": "2023-11-07 16:47:32.079Z",
      "updated": "2023-11-09 12:19:37.788Z",
      "name": "entries",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "xwsk5nez",
          "name": "creator",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "vv4maw6b",
          "name": "board",
          "type": "relation",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "collectionId": "n2638o4obmw7ght",
            "cascadeDelete": true,
            "minSelect": null,
            "maxSelect": 1,
            "displayFields": null
          }
        },
        {
          "system": false,
          "id": "icitiyko",
          "name": "body",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        },
        {
          "system": false,
          "id": "z6iycmzz",
          "name": "gif",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": {
            "min": null,
            "max": null,
            "pattern": ""
          }
        }
      ],
      "indexes": [],
      "listRule": "",
      "viewRule": "",
      "createRule": "creator.id = @request.auth.id && @request.auth.verified = true",
      "updateRule": "creator.id = @request.auth.id && @request.auth.verified = true",
      "deleteRule": "creator.id = @request.auth.id && @request.auth.verified = true",
      "options": {}
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));

  return Dao(db).importCollections(collections, true, null);
}, (db) => {
  return null;
})
