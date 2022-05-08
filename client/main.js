const form = document.getElementById("upload-form");
const catsContainer = document.getElementById("cats-container");

function submitForm(e) {
  e.preventDefault();
  const formData = new FormData();
  const name = document.getElementById("name");
  const pic = document.getElementById("pic");
  formData.append("name", name.value);
  formData.append("file", pic.value);
  console.log(pic.value);
  fetch("http://localhost:3000/cats", {
    method: "POST",
    body: formData
  })
    .then((res) => {
      console.log(res);
      displayCats(res);
    })
    .catch((err) => ("Error occured", err));
}

function getCats() {
  fetch("http://localhost:3000/cats", {
    method: "GET",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then((res) => {
      console.log(res);
      displayCats(res);
    })
    .catch((err) => ("Error occured", err));
}

function displayCats(cats) {
  cats.forEach((cat) => {
    const content = document.createElement("div");
    const img = document.createElement("img");
    img.src = cat.media;
    img.alt = `A cat name ${cat.name}`;
    // define img attributes
    // add delete and update button
    content.prepend(img);
    generateLabel("name", "img.id", content);
    catsContainer.append(content);
  });
}

function generateLabel(labelText, associatedElement, parent) {
  const newLabel = document.createElement("label");
  newLabel.setAttribute("for", associatedElement);
  newLabel.innerHTML = labelText;
  parent.appendChild(newLabel);
}
