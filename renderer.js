const fs = require("fs");

const mergeValues = (values, content) => {
  for(let key in values) { //Cycle over the keys
    content = content.replace("{{" + key + "}}", values[key]);  //show only the values, without the keys
  }
  return content;
}

const view = (templateName, values, res) => {
  let fileContents = fs.readFileSync(`./views/${templateName}.html`, {encoding: "utf8"});
  fileContents = mergeValues(values, fileContents); //Insert values into the content
  res.write(fileContents);  //Write out the contents to the response
}

module.exports.view = view;