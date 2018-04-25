<?php
use yii\web\JsExpression;

?>

<?php $form =\yii\bootstrap\ActiveForm::begin([
    'action' => '',
    'method' => 'POST',
    'options' => ['class' => 'form-horizontal', 'enctype' => 'multipart/form-data'],
    'fieldConfig' => [
        'template' => "{label}\n<div class=\"col-sm-8\">{input}</div>\n<div class=\"col-sm-2\">{error}</div>",
        'labelOptions' => ['class' => 'col-sm-2'],
    ],
]);

 echo $form->field($model,'id')->textInput();

 echo $form->field($model,'img')->hiddenInput();

echo \yii\bootstrap\Html::fileInput('test', NULL, ['id' => 'test']);
echo \flyok666\uploadifive\Uploadifive::widget([
'url' => yii\helpers\Url::to(['s-upload']),
'id' => 'test',
'csrf' => true,
'renderTag' => false,
'jsOptions' => [
'formData'=>['someKey' => 'someValue'],
'width' => 120,
'height' => 40,
'onError' => new JsExpression(<<<EOF
    function(file, errorCode, errorMsg, errorString) {
    console.log('The file ' + file.name + ' could not be uploaded: ' + errorString + errorCode + errorMsg);
}
EOF
),
'onUploadComplete' => new JsExpression(<<<EOF
    function(file, data, response) {
    data = JSON.parse(data);
    if (data.error) {
    console.log(data.msg);
    } else {
    console.log(data.fileUrl);
//将图片的地址赋值给logo字段
$("#brand-logo").val(data.fileUrl);
//将上传成功的图片回显
$("#img").attr('src',data.fileUrl);
}
}
EOF
),
]
]);
//添加后显示效果  三元运算符
echo \yii\bootstrap\Html::img($model->img?$model->img:false,['id'=>'img','height'=>50]);



 echo \yii\helpers\Html::submitButton('保存', ['class'=>'btn btn-success','name' =>'submit-button']);
 \yii\bootstrap\ActiveForm::end() ?>
