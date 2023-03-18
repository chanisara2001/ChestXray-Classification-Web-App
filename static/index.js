var cropper = null;
var form_data = null;

function previewImage(event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("preview");
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}



