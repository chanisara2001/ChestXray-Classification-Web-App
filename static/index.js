var cropper = null;
var form_data = null;

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

    if (cropper === null) {
      return;
    }
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
    width: 720,
    height: 720,
    fillColor: "#fff",
    imageSmoothingEnabled: false,
    imageSmoothingQuality: "high",
  });

  $("#preview").attr("src", canvas.toDataURL());
  $("#crop-modal").modal("hide");
});

$("#prediction").click(function () {
  var img = $("#preview").attr("src");

  // // Convert base64 data to a Blob
  var byteString = atob(img.split(",")[1]);
  var mimeString = img.split(",")[0].split(":")[1].split(";")[0];
  var buffer = new ArrayBuffer(byteString.length);
  var intArray = new Uint8Array(buffer);
  for (var i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([buffer], { type: mimeString });

  // Append the Blob to the FormData object
  var formdata = new FormData();
  formdata.append("image", blob);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/predict/");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      try {
        var response = JSON.parse(xhr.responseText);
        window.location.href = "/predict/result/?prediction=" + encodeURIComponent(JSON.stringify(response.percent_results)) + "&input_image_data_url=" + encodeURIComponent(response.input_image_data_url);
      } catch (error) {
        // console.error("Error parsing JSON response:", error);
        // You can display an error message or handle the non-JSON response here.
      }
    }
  };
  xhr.send(formdata);
  
});

