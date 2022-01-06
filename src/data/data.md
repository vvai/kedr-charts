## Some useful information about data

- convert to task_to_level_flat

```js
const pData = data.flatMap((el) => {
  return el.questionIdList.map((q) => ({ [q]: el.level }))
})
let readyData = {}
pData.forEach((d) => {
  readyData[Object.keys(d)[0]] = Object.values(d)[0]
})
```
