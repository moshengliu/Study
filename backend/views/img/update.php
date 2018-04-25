<?php

use yii\helpers\Html;

/* @var $this yii\web\View */
/* @var $model common\models\Img */

$this->title = 'Update Img: {nameAttribute}';
$this->params['breadcrumbs'][] = ['label' => 'Imgs', 'url' => ['index']];
$this->params['breadcrumbs'][] = ['label' => $model->id, 'url' => ['view', 'id' => $model->id, 'img' => $model->img]];
$this->params['breadcrumbs'][] = 'Update';
?>
<div class="img-update">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
