<?php
/**
 * Dynamic Open Graph Social Share Preview Generator for WhatsApp, Facebook, Twitter, Telegram
 * Platform: Hostinger LiteSpeed Web Server
 */

// 1. Detect requested slug and type
$slug = isset($_GET['slug']) ? trim($_GET['slug']) : '';
$type = isset($_GET['type']) ? trim($_GET['type']) : 'news';

$siteUrl = 'https://shreeabhaydas.com';
$defaultTitle = 'स्वामी श्री अभयदास जी महाराज | Shree Abhaydas Ji Maharaj';
$defaultDesc = 'पूज्य स्वामी श्री अभयदास जी महाराज की पावन सानिध्य में सनातन धर्म संस्कृति, श्रीमद् भागवत कथा, नानी बाई का मायरा, गौ सेवा एवं गुरुकुल शिक्षा।';
$defaultImage = $siteUrl . '/images/img_35.png';
$defaultUrl = $siteUrl . '/news';

$articleTitle = $defaultTitle;
$articleDesc = $defaultDesc;
$articleImage = $defaultImage;
$articleUrl = $defaultUrl;
$mimeType = 'image/png';

// 2. Load pre-indexed meta if available
$metaJsonPath = __DIR__ . '/news-meta.json';
if ($slug && file_exists($metaJsonPath)) {
    $metaJson = @json_decode(file_get_contents($metaJsonPath), true);
    if (is_array($metaJson) && isset($metaJson[$slug])) {
        $entry = $metaJson[$slug];
        $articleTitle = !empty($entry['title']) ? $entry['title'] : $defaultTitle;
        $articleDesc = !empty($entry['description']) ? $entry['description'] : $defaultDesc;
        $articleImage = !empty($entry['image']) ? $entry['image'] : $defaultImage;
        $articleUrl = !empty($entry['url']) ? $entry['url'] : ($siteUrl . '/news/' . urlencode($slug));
        $mimeType = !empty($entry['mimeType']) ? $entry['mimeType'] : 'image/jpeg';
    }
}

if ($slug && $articleUrl === $defaultUrl) {
    $articleUrl = $siteUrl . '/news/' . urlencode($slug);
}

// 3. Detect if request is from a Social Media Crawler / Bot
$userAgent = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
$isBot = preg_match('/(facebookexternalhit|WhatsApp|Twitterbot|Pinterest|LinkedInBot|TelegramBot|Slackbot|vkShare|W3C_Validator)/i', $userAgent);

// 4. If human visitor, redirect to the client-side SPA route immediately
if (!$isBot) {
    header('Location: ' . $articleUrl, true, 302);
    exit;
}

// 5. Output Clean Open Graph Meta Tags for WhatsApp & Social Scrapers
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=3600');
?>
<!DOCTYPE html>
<html lang="hi" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <title><?php echo htmlspecialchars($articleTitle); ?> – Shree Abhay Das Ji Maharaj</title>
    <meta name="description" content="<?php echo htmlspecialchars($articleDesc); ?>">
    <link rel="canonical" href="<?php echo htmlspecialchars($articleUrl); ?>">
    
    <!-- Open Graph for WhatsApp & Facebook -->
    <meta property="og:site_name" content="Shree Abhaydas Ji Maharaj">
    <meta property="og:type" content="article">
    <meta property="og:url" content="<?php echo htmlspecialchars($articleUrl); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($articleTitle); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($articleDesc); ?>">
    <meta property="og:image" content="<?php echo htmlspecialchars($articleImage); ?>">
    <meta property="og:image:secure_url" content="<?php echo htmlspecialchars($articleImage); ?>">
    <meta property="og:image:type" content="<?php echo htmlspecialchars($mimeType); ?>">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="<?php echo htmlspecialchars($articleTitle); ?>">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="<?php echo htmlspecialchars($articleUrl); ?>">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($articleTitle); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($articleDesc); ?>">
    <meta name="twitter:image" content="<?php echo htmlspecialchars($articleImage); ?>">

    <meta http-equiv="refresh" content="0;url=<?php echo htmlspecialchars($articleUrl); ?>">
</head>
<body>
    <p>Redirecting to <a href="<?php echo htmlspecialchars($articleUrl); ?>"><?php echo htmlspecialchars($articleTitle); ?></a>...</p>
</body>
</html>

