function onPageLoaded()
{
 var str = localStorage.getItem("email");
 document.form.emailAddress.value = str;
 
 str = localStorage.getItem("password");
 document.form.password.value = str;
}
  	
function onSubmitClicked()
{
 if (document.form.emailAddress.value === "" ||
 document.form.password.value === "") {
 	alert("Пожалуйста, заполните все необходимые поля");
	return;
 }
  	 
 localStorage.setItem("email", document.form.emailAddress.value);
 localStorage.setItem("password", document.form.password.value);

 alert("Внимание: начинаем процесс загрузки протокола (" + sessionStorage.getItem("imagesCount") + " страниц) на сервер КАРИК. Нажмите OK для продолжения.");

 sessionStorage.uploadedFilesCount = 0;
 
 if (sessionStorage.getItem("imagesCount") !== null) {
	for (var i = 0; i < sessionStorage.imagesCount; i++) {
		uploadFile(sessionStorage.getItem("picture" + i));
	}
} else {
	alert("error: imagesCount не существует!");
       }	
}
  	
function uploadFile(imgSrc) { 

var uploadSuccess = function(r) {
    sessionStorage.uploadedFilesCount++;

    var msg = new String("Произошла ошибка: ");
    var showErr = false;

    if(r.responseCode == 403) { // Authentication failed
        msg += "Неверный адрес электропочты или пароль. Протоколы НЕ загружены на сервер nk12.su.";
        showErr = true;
    } else if (r.responseCode == 404) { // Не найден УИК
        msg += "Вы не привязаны ни к одному УИК в качестве наблюдателя в системе nk12.su. Протоколы ЗАГРУЖЕНЫ на сервер.";
        showErr = true;
    } else if (r.responseCode != 200) {
        msg += "Неизвестная, код: " + error.code;
        showErr = true;
    };
    if(showErr === true) {
        alert(msg);
    };

	if (sessionStorage.getItem("uploadedFilesCount") !== null) {
		if (sessionStorage.uploadedFilesCount === sessionStorage.imagesCount) {
			alert("Протокол (" + sessionStorage.uploadedFilesCount + " страниц) успешно загружен на сервер КАРИК (nk12.su):" + response.response);
			return;
		}
		return;
	}
}

var uploadFailed = function(error) {
    alert("Произошла ошибка доступа/отправки страниц протокола: " + error.msg);
}

 var options = new FileUploadOptions();
 var src = new String(imgSrc);
 options.fileKey="file";
 options.fileName="PHONEGAP"  + "_picture_" + sessionStorage.uploadedFilesCount + ".jpg";
 options.mimeType="image/jpeg";
 options.chunkedMode = false;

 var params = new Object();
 params.login = localStorage.getItem("email");
 params.password = localStorage.getItem("password");

 options.params = params;

 var transfer = new FileTransfer();
 transfer.upload(imgSrc, "http://test.nk12.su/pictures?login=" + localStorage.getItem("email") + "&password=" + localStorage.getItem("password"), uploadSuccess, uploadFailed, options);  	
} 
