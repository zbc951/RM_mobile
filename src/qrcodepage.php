<?php
	if(empty($_GET) || empty($_GET["json"]) )exit;
	$str_tmp = strtolower($_GET["json"]);
	$json_get = $str_tmp;
	$estr = Array("update ","delete ","drop ","insert ","database","truncate","#",'!','!=');
	for ($i=0;$i<sizeof($estr);$i++) {
		$str_tmp = str_replace($estr[$i],"",$str_tmp);
	}
	$ret = "";
	if(strlen($str_tmp) != strlen($str))$ret = json_decode($str_tmp,1);
	else $ret =  json_decode($str,1);
	
	echo '<h1>'.$ret["payname"].' </h1>';
	echo '<h3>請求編號：'.$ret["depositNo"].' </h3>';
	echo '<img src="'.$ret["qrcode"].'">';
	echo '<h3>支付金額：'.$ret["realamount"].' </h3>';
?>