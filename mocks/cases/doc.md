# http://localhost:5008/#!/layout/judgment/cases

## `/cases`
* describe: `查询案件列表`
* type: `GET`
* param: `* + {currentPageNumber:当前页码，itemsPerPage:每页条数}`
* return: 

```javascript
[
  {
    "id": "案件ID",
    "title": "案件名称",
    "type": "案件类型"
    "number": "案号",
    "accuser": "原告",
    "accused": "被告",
    "courtDay": "开庭时间",
    "limitationTime": "审限",
    "isJudge": "是否判决(即是否已经生成裁判文书)",
    "recordIDs": "当前裁判文书关联的庭审记录的ID"
  }
]
```
