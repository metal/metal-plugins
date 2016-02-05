var testAgents = {

	/**
	 * Internet Explorer
	 */
	IE_6: 'Mozilla/5.0 (Windows; U; MSIE 6.0; Windows NT 5.1; SV1;' +
		'.NET CLR 2.0.50727)',

	IE_7: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',

	IE_8: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',

	IE_8_COMPATIBILITY: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Trident/4.0)',

	IE_9: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',

	IE_9_COMPATIBILITY: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/5.0)',

	IE_10: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)',

	IE_10_COMPATIBILITY: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; Trident/6.0)',

	IE_10_MOBILE: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; ' +
		'IEMobile/10.0; ARM; Touch; NOKIA; Lumia 820)',

	IE_11: 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',

	IE_11_COMPATIBILITY_MSIE_7: 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.3; Trident/7.0; ' +
		'.NET4.0E; .NET4.0C)',

	IE_11_COMPATIBILITY_MSIE_9: 'Mozilla/5.0 (MSIE 9.0; Windows NT 6.1; WOW64; Trident/7.0; ' +
		'rv:11.0) like Gecko',

	/**
	 * Edge
	 */
	EDGE_12_0: 'Mozilla/5.0 (Windows NT 6.4; WOW64) AppleWebKit/537.36 ' +
		'(KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36 Edge/12.0',

	EDGE_12_9600: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
		'(KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.9600',

	/**
	 * Firefox
	 */
	FIREFOX_ANDROID_TABLET: 'Mozilla/5.0 (Android; Tablet; rv:28.0) Gecko/28.0 Firefox/28.0',

	FIREFOX_19: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:19.0) ' +
		'Gecko/20100101 Firefox/19.0',

	FIREFOX_LINUX: 'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:15.0) Gecko/20100101' +
		' Firefox/15.0.1',

	FIREFOX_MAC: 'Mozilla/6.0 (Macintosh; I; Intel Mac OS X 11_7_9; de-LI; rv:1.9b4)' +
		' Gecko/2012010317 Firefox/10.0a4',

	FIREFOX_WINDOWS: 'Mozilla/5.0 (Windows NT 6.1; rv:12.0) Gecko/20120403211507' +
		' Firefox/14.0.1',

	/**
	 * Safari
	 */
	SAFARI_6: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_1) ' +
		'AppleWebKit/536.25 (KHTML, like Gecko) ' +
		'Version/6.0 Safari/536.25',

	SAFARI_IPHONE_32: 'Mozilla/5.0(iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' +
		' AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314' +
		' Safari/531.21.10',

	SAFARI_IPHONE_421: 'Mozilla/5.0 (iPhone; U; ru; CPU iPhone OS 4_2_1 like Mac OS X; ru)' +
		' AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8C148a' +
		' Safari/6533.18.5',

	SAFARI_IPHONE_431: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_1 like Mac OS X; zh-tw)' +
		' AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8G4' +
		' Safari/6533.18.5',

	SAFARI_IPHONE_6: 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X)' +
		' AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e' +
		' Safari/8536.25',

	SAFARI_IPOD: 'Mozila/5.0 (iPod; U; CPU like Mac OS X; en) AppleWebKit/420.1' +
		' (KHTML, like Gecko) Version/3.0 Mobile/3A101a Safari/419.3',

	SAFARI_MAC: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13+' +
		' (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2',

	SAFARI_WINDOWS: 'Mozilla/5.0 (Windows; U; Windows NT 6.1; tr-TR) AppleWebKit/533.20.25' +
		' (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27',
	OPERA_10: 'Opera/9.80 (S60; SymbOS; Opera Mobi/447; U; en) ' +
		'Presto/2.4.18 Version/10.00',

	/**
	 * Opera
	 */
	OPERA_LINUX: 'Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.9.168 Version/11.50',

	OPERA_MAC: 'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168' +
		' Version/11.52',

	OPERA_15: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 ' +
		'(KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36 OPR/15.0.1147.100',

	/**
	 * Chrome
	 */
	CHROME_25: 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) ' +
		'AppleWebKit/535.8 (KHTML, like Gecko) ' +
		'Chrome/25.0.1000.10 Safari/535.8',

	CHROME_ANDROID: 'Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) ' +
		'AppleWebKit/535.7 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile ' +
		'Safari/535.7',

	CHROME_ANDROID_PHONE_4_4: 'Mozilla/5.0 (Linux; Android 4.4.2; S8 Build/KOT49H) ' +
		'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.93 Mobile ' +
		'Safari/537.36',

	CHROME_ANDROID_TABLET: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) ' +
		'AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Safari/535.19',

	CHROME_ANDROID_TABLET_4_4: 'Mozilla/5.0 (Linux; Android 4.4.4; Nexus 7 Build/KTU84P) ' +
		'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.93 Safari/537.36',

	CHROME_IPHONE: 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_1_1 like Mac OS X; en-us) ' +
		'AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/22.0.1194.0 Mobile/11E53 ' +
		'Safari/7534.48.3',

	CHROME_IPAD: 'Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) ' +
		'AppleWebKit/537.51.1 (KHTML, like Gecko) CriOS/32.0.1700.20 ' +
		'Mobile/11B554a Safari/9537.53',

	CHROME_LINUX: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko)' +
		' Chrome/26.0.1410.33 Safari/537.31',

	CHROME_LINUX_APPVERVERSION: '5.0 (X11; Linux x86_64) AppleWebKit/537.31 (KHTML, like Gecko)' +
		' Chrome/26.0.1410.33 Safari/537.31',

	CHROME_MAC: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17' +
		' (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17',

	CHROME_OS: 'Mozilla/5.0 (X11; CrOS x86_64 3701.62.0) AppleWebKit/537.31 ' +
		'(KHTML, like Gecko) Chrome/26.0.1410.40 Safari/537.31',

	CHROME_OS_910: 'Mozilla/5.0 (X11; U; CrOS i686 9.10.0; en-US) AppleWebKit/532.5' +
		' (KHTML, like Gecko) Chrome/4.0.253.0 Safari/532.5'

};

export default testAgents;