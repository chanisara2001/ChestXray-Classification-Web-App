var cropper = null;

function previewImage(event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("preview");
    output.src = reader.result;
    $("#crop-button").show();
    $("#crop-image").attr("src", reader.result);
  };
  reader.readAsDataURL(event.target.files[0]);

  $("#crop-image").one("load", function () {
    var originalWidth = this.naturalWidth;
    var originalHeight = this.naturalHeight;
    var croppedWidth = cropper.getCroppedCanvas().width;
    var croppedHeight = cropper.getCroppedCanvas().height;
    var maxWidth = $("#preview").parent().width();
    var maxHeight = $("#preview").parent().height();

    // console.log(originalWidth, originalHeight, croppedWidth, croppedHeight, maxWidth, maxHeight);

    if (croppedWidth > originalWidth || croppedHeight > originalHeight) {
      var scale = Math.min(maxWidth / croppedWidth, maxHeight / croppedHeight);
      $("#preview").css("max-width", croppedWidth * scale + "px");
      $("#preview").css("max-height", croppedHeight * scale + "px");
    } else {
      $("#preview").css("max-width", "100%");
      $("#preview").css("max-height", "100%");
    }
  });
}

$("#crop-button").click(function () {
  $("#crop-modal").modal("show");
  if (cropper !== null) {
    cropper.destroy();
  }
  cropper = new Cropper(document.getElementById("crop-image"), {
    aspectRatio: 1,
    viewMode: 2,
    background: false,
  });
});

$("#crop-submit").click(function () {
  var canvas = cropper.getCroppedCanvas({
    width: 150,
    height: 150,
    fillColor: "#fff",
    imageSmoothingEnabled: false,
    imageSmoothingQuality: "high",
  });
  canvas.toBlob(function (blob) {
    var formdata = new FormData();
    formdata.append("image", blob);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/predict/");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        window.location.href =
          "/predict/result?prediction=" + response.prediction;
      }
    };
    xhr.send(formdata);
    $("#preview").attr("src", canvas.toDataURL());
  });
});

$("#prediction").click(function () {
  var img = $("preview").attr("src");
  console.log(img);

  var formdata = new FormData();
  formdata.append("image", img);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/predict/");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      window.location.href =
        "/predict/result?prediction=" + response.prediction;
    }
  };
  xhr.send(formdata);
  alert("Using API Prediction Success!");
});