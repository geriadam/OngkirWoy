<?php

class Curl {
	public $curl;
	public $base_url = 'https://api.rajaongkir.com/starter/';
	public const API_KEY = 'ce5906b0617b6edf4dfa6be5c0db2c68';

	public function __construct()
	{
		$this->curl = curl_init();
	}

	public function getProvince()
	{
		curl_setopt_array($this->curl, [
			CURLOPT_URL => $this->base_url . "province",
			CURLOPT_RETURNTRANSFER => true,
			CURLOPT_ENCODING => "",
			CURLOPT_MAXREDIRS => 10,
			CURLOPT_TIMEOUT => 30,
			CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			CURLOPT_CUSTOMREQUEST => "GET",
			CURLOPT_HTTPHEADER => [
				"key: " . self::API_KEY
			],
		]);
		$response = curl_exec($this->curl);
		$err = curl_error($this->curl);
		curl_close($this->curl);
		if ($err) {
			echo "cURL Error #: " . $err;
		} else {
			echo $response;
		}
	}
}

$curl = new Curl();
$curl->getProvince();