# equip - Make efficient site
静的サイトを効率良く作るためのテンプレートです。以下のような特徴があります。

* [EJS](http://ejs.co/)でヘッダーなどの共通部分のテンプレート化、JSONを利用したデータの管理
* [FLOCSS](https://github.com/hiloki/flocss)をベースにしたSassのディレクトリ、レイアウト用コンポーネント、メディアクエリなどの@mixin
* CSSや画像などのminifyと圧縮
* アイコンフォントと専用のscssファイルの生成
* Browsersyncを利用したライブリロード
* [Hologram](http://trulia.github.io/hologram/)を利用したスタイルガイドの生成

コーディングルールは以下のリンクをベースにします。

* [CSSコーディングルール](https://github.com/manabuyasuda/styleguide/blob/master/css-coding-rule.md)
* [画像の命名規則](https://github.com/manabuyasuda/styleguide/blob/master/image-naming-rule.md)

## 始め方とGulpタスク
npmでパッケージをインストールします。

```bash
npm install
```

開発に使用するGulpタスクは2つあります。

```bash
gulp
```

```bash
gulp release
```

1. `gulp`（EJSとSassのコンパイル、jsの結合や画像の出力、アイコンフォントの生成、browser-syncによるライブリロード）
1. `gulp release`（`gulp`タスクに画像とCSSの圧縮を追加。）

いずれも`clean`タスクでreleaseディレクトリがあればいったん削除されます。

## EJS
develop/index.ejsがトップページになります。develop/_partialsディレクトリ内にグローバルに使用するテンプレートを保存します。

新規案件でルートディレクトリに制作していくことを想定していますが、そうではない場合でも使えるように基本的に相対パスで記述します。ただし、グローバルナビゲーションで使い回しができるようにすると複雑になってしまうため、必要最低限であればルート相対パスで記述することもできます。

### site.json

develop/assets/data/site.jsonにサイト共通の値が指定されています。サイトの名前やOGPの指定などがありますので、最初に確認をして、変更してください。site.jsonの値は`site.name`のように呼び出すことができます。

| 変数名                	| 説明                                                                                                                                                                                                                                                                                                                                                                         	|
|-----------------------	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| `site.name`           	| サイトの名前を記述します。（`title`要素に使用されます）                                                                                                                                                                                                                                                                                                                      	|
| `site.description`    	| サイトの簡単な説明を記述します。（`meta`要素内の`name`属性に使用されます）                                                                                                                                                                                                                                                                                                   	|
| `site.keywords`       	| サイトのキーワードを記述します。（`meta`要素内の`name`属性に使用されます）                                                                                                                                                                                                                                                                                                   	|
| `site.author`         	| その文書の作者名（そのサイトの運営者・運営社）を記述します。※省略可能（`meta`要素内の`name`属性に使用されます）                                                                                                                                                                                                                                                              	|
| `site.rootUrl`        	| そのサイトの絶対パス（`http`で始まりドメイン名+`/`で終わる）を記述します。（OGPの`og:url`に使用されます）                                                                                                                                                                                                                                                                    	|
| `site.css`            	| assetsディレクトリで読み込むCSSファイルの拡張子を記述します。`gulp release`タスクを実行すると、minify（圧縮）したCSSファイルが生成されます。名前は`~.min.css`になります、minifyしたCSSファイルを読み込む場合は`.min.css`と記述します。                                                                                                                                       	|
| `site.ogpImage`       	| シェアされたときのサムネイル画像を絶対パスで記述します。（OGPの`og:image`で使用されます）                                                                                                                                                                                                                                                                                    	|
| `site.facebookAdmins` 	| Facebook insightsのデータの閲覧権限を与える個人のFacebookアカウントID（カンマで区切ると複数人に権限を与えられる）を記述します。`site.facebookAppId`か`site.facebookAdmins`のどちらかを記述します。（OGPの`fb:admins`に使用されます）※省略可能 	|
| `site.facebookAppId`  	| Facebook insightsのデータの閲覧権限を与えるアプリ（サイト）のIDを記述します。`site.facebookAdmins`か`site.facebookAppId`のどちらかを記述します。（OGPの`fb:app_id`に使用されます）※省略可能                                                                                                                                                                                  	|
| `site.twitterCard`    	| [Twitterでツイートされたときのスタイル](https://dev.twitter.com/ja/cards/getting-started)を指定します。（OGPの`twitter:card`で使用されます）                                                                                                                                                                                                                                 	|
| `site.twitterSite`    	| Twitterでツイートされたときに表示するTwitterアカウントを@をつけて記述します。※省略可能（OGPの`twitter:site`で使用されます）                                                                                                                                                                                                                                                  	|
| `site.favicon`        	| ファビコンに使用する画像を絶対パスで記述します。[.ico形式に変換した16px×16pxと32px×32pxのマルチアイコン](http://liginc.co.jp/web/design/material/16853)にするのが良いようです。※省略可能（`shortcut icon`に使用されます）                                                                                                                                                    	|
| `site.appleIcon`      	| iPhoneでホーム画面に追加したときに使用される画像（ホームアイコン）を絶対パスで記述します。iPhone 6 Plusで180px、iPhone 6と5で120pxが適合するサイズです。※省略可能（`apple-touch-icon`で使用されます）                                                                                                                                                                        	|
| `site.appTitle`       	| ホームアイコンを保存するときのタイトルの初期値を記述します。※省略可能[日本語は6文字以内、英語は13文字以内にすると省略されないようです](https://hyper-text.org/archives/2012/09/iphone-5-ios-6-html5-developers.shtml)。（`apple-mobile-web-app-title`に使用されます）                                                                                                        	|
| `site.analyticsId`    	| Google Analyticsの[トラッキングID](https://support.google.com/analytics/answer/1032385?hl=ja)を記述します。                                                                                                                                                                                                                                                                  	|
| `site.developDir`     	| 開発用ディレクトリ名を記述します。ファイルのルートパスを取得するのに使用されます。例えばdevelop/page1が開発用のルートディレクトリになるのであれば`"develop/page1/"`と変更します。                                                                                                                                                                                            	|

```json
{
  "name": "サイトのタイトル",
  "description": "サイトの概要",
  "keywords": "サイトのキーワード1, サイトのキーワード2",
  "author": "",
  "rootUrl": "http://example.com/",
  "css": ".css",
  "ogpImage": "http://example.com/images/og-image.jpg",
  "facebookAdmins": "",
  "facebookAppId": "",
  "twitterCard": "summary",
  "twitterSite": "@",
  "favicon": "",
  "appleIcon": "",
  "appTitle": "",
  "analyticsId": "",
  "developDir": "develop/"
}
```

また、develop/assets/dataディレクトリにはsample.jsonファイルが入っています。記事内で記事一覧やニュースなどをループで、処理をしたい場合に使用します。

```js
[
  {
      "title": "title1",
      "description": "description1"
  },
  {
      "title": "title2",
      "description": "description2"
  }
]
```

jsonファイルを追加する場合はgulpfile.jsにも追加する必要があります。`develop.data`でdataディレクトリへのパスを取得できます。

```js
.pipe(ejs({
　　site: JSON.parse(fs.readFileSync(develop.data + 'site.json')),
　　sample: JSON.parse(fs.readFileSync(develop.data + 'sample.json')),
　　sample2: JSON.parse(fs.readFileSync(develop.data + 'sample2.json'))
},
```

ejsファイルでは`forEach()`を使用してデータを取得し、ループを回します。

```js
<% sample.forEach(function(data){ %>
  <article class="article">
    <h2><%= data.title %></h2>
    <p><%= data.description %></p>
  </article>
<% }); %>
```

このように出力されます。

```html
<article class="article">
  <h2>title1</h2>
  <p>description1</p>
</article>

<article class="article">
  <h2>title2</h2>
  <p>description2</p>
</article>
```

### index.ejs

index.ejsには変更が必要なものや変更ができるものについての変数が定義されているので、ページごとに変更することができます。変数はindex.ejsとインクルードしている_head.ejsや_footer.ejsなどで`page.title`のように呼び出すことができます。

| 変数名             	| 説明                                                                                                                                  	|
|--------------------	|---------------------------------------------------------------------------------------------------------------------------------------	|
| `page.title`       	| そのページの名前を記述します。空にするとサイトタイトルだけ、記述するとサイトタイトルと一緒に出力されます。                            	|
| `page.desctiption` 	| そのページの説明を記述します。                                                                                                        	|
| `page.keywords`    	| そのページのキーワードを記述します。`"ページのキーワード1, ページのキーワード2"`のようにクウォーテーション内でカンマ区切りで指定します。                                                                                                  	|
| `page.bodyClass`   	| `body`要素にclassを指定できます。                                                                                                     	|
| `page.singleCss`   	| ページ専用のcssファイルを作成したい場合に指定します。`["../common/css/category.css", "css/single.css"]`のように配列でパスを渡します。 	|
| `page.singleJs`   	| ページ専用のjsファイルを作成したい場合に指定します。`["../common/js/category.js", "js/single.js"]`のように配列でパスを渡します。 	|
| `page.ogpType`   	| OGPで使用されていて、トップページはwebsite、それ以外の記事はarticleを指定します。 	|
| `page.ogpImage`   	| OGPで使用されていて、サイト共通であれば`site.ogpImage`を指定、個別に設定したい場合は`'http://example.com/images/og-image.jpg'`のように絶対パスで指定します。 	|
| `page.absolutePath`   	| ファイルごとの`/`を含まないルートパスを格納しています。metaタグの絶対パスで使用されています。 	|
| `page.relativePath`   	| ファイルごとの相対パスを格納しています。 	|


```js
<%
var absolutePath = filename.split(site.developDir)[filename.split(site.developDir).length -1].replace('.ejs','.html');
var relativePath = '../'.repeat([absolutePath.split('/').length -1]);
var page = {
  title: "",
  description: site.description,
  keywords: "",
  bodyClass: "",
  singleCss: [],
  singleJs: [],
  ogpType: "website",
  ogpImage: site.ogpImage,
  absolutePath: absolutePath,
  relativePath: relativePath
};
-%>
<%- include(page.relativePath + '_partials/_head', {page: page, modifier: ''}); %>
<%- include(page.relativePath + '_partials/_header', {page: page, modifier: ''}); %>
    <article>contents</article>

<%- include(page.relativePath + '_partials/_footer', {page: page, modifier: ''}); %>
```

`include()`の第一引数はすべてのindex.ejs共通です。第二引数の1つ目の`page: page,`は各index.ejsの変数（`page`）をインクルードするファイルに渡しています。2つ目の`modifier: ''`はインクルードするファイルにclass属性を付け加えたい場合に指定します。例えば_header.ejsのインクルードで`modifier: ' header--fixed'`と渡した場合（スペースが入っていることに注意）、以下のように出力されます。

```html
<header class="header header--fixed">
```

ルートディレクトリのindex.html以外にファイルを作成したり場合は_sample.ejsをコピーして使いまわします。sample.ejsのようにアンダースコアを外すとHTMLとして出力されるようになります。

下層ページのejsファイルはdevelop/page1ディレクトリをコピーして使いまわします。変数は下記のように変更して使います。

```js
<%
var absolutePath = filename.split(site.developDir)[filename.split(site.developDir).length -1].replace('.ejs','.html');
var relativePath = '../'.repeat([absolutePath.split('/').length -1]);
var page = {
  title: "ページのタイトル",
  description: "ページの概要",
  keywords: "",
  bodyClass: "",
  singleCss: [],
  singleJs: [],
  ogpType: "article",
  ogpImage: site.ogpImage,
  absolutePath: absolutePath,
  relativePath: relativePath
};
-%>
<%- include(page.relativePath + '_partials/_head', {page: page, modifier: ''}); %>
<%- include(page.relativePath + '_partials/_header', {page: page, modifier: ''}); %>
<%- include('_partials/_breadcrumb', {page: page, pageTitle: page.title, modifier: ''}); %>
    <article>contents</article>

<%- include(page.relativePath + '_partials/_footer', {page: page, modifier: ''}); %>
```

ルーディレクトリのindex.ejsファイル以外はパンくずリストをインクルードします。デフォルトでは`pageTitle: page.title`のようにファイルのタイトルがパンくずリストのタイトルになるようになっています。

変更する場合は`pageTitle: '任意のタイトル'`のようにします。

### _head.ejs

develop/_partials/_head.ejsには共通で使用するメタタグなどが定義されています。基本的に変更する必要はなく、site.jsonやindex.ejsの設定によって要素を削除したりしています。

```js
<% if (typeof modifier === undefined) { var modifier = ''; } -%>
<!DOCTYPE html>
<html lang="ja">
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# <%= page.ogpType %>: http://ogp.me/ns/<%= page.ogpType %>#">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <% if(page.title) { %><title><%= page.title %> | <%= site.name %></title><% } else { %><title><%= site.name %></title><% } %>
    <meta name="description" content="<%= page.description %>"><% if(page.keywords) { %>
    <meta name="keywords" content="<%= page.keywords %>"><% } %><% if(site.author) { %>
    <meta name="author" content="<%= site.author %>"><% } %>

    <link rel="stylesheet" href="<%= page.relativePath %>assets/css/common<%= site.css %>"><% if(page.singleCss) { %><% page.singleCss.forEach(function(data) { %>
    <link rel="stylesheet" href="<%= data %>"><% }); %><% } %>

    <meta name="format-detection" content="telephone=no"><% if(site.favicon) { %>
    <link rel="shortcut icon" href="<%= site.favicon %>"><% } %><% if(site.appleIcon) { %>
    <link rel="apple-touch-icon" sizes="180x180" href="<%= site.appleIcon %>"><% } %><% if(site.appTitle) { %>
    <meta name="apple-mobile-web-app-title" content="<%= site.appTitle %>"><% } %>

    <!-- OGP -->
    <meta property="og:title" content="<% if(page.title) { %><%= page.title %> | <%= site.name %><% } else { %><%= site.name %><% } %>">
    <meta property="og:type" content="<%= page.ogpType %>">
    <meta property="og:image" content="<%= page.ogpImage %>">
    <meta property="og:url" content="<%= site.rootUrl %><%= page.absolutePath %>">
    <meta property="og:description" content="<%= page.description %>">
    <meta property="og:site_name" content="<%= site.name %>">
    <meta property="og:locale" content="ja">
    <% if(site.facebookAppId) { %><meta property="fb:app_id" content="<%= site.facebookAppId %>"><% } else if(site.facebookAdmins) { %><meta property="fb:admins" content="<%= site.facebookAdmins -%>"><% } %>
    <meta name="twitter:card" content="<%= site.twitterCard %>"><% if(site.twitterSite) { %>
    <meta name="twitter:site" content="<%= site.twitterSite %>"><% } %>
    <!-- / OGP -->

  </head>
  <% if(page.bodyClass) { %><body class="<%= page.bodyClass %><%= modifier %>"><% } else { %><body><% } %>
```

### _header.ejs

vedelop/_partials/_header.ejsには共通で使用するメインナビゲーションが定義されています。グローバルナビゲーションは条件分岐が多く複雑になってしまうため、ルート相対パスで指定をします。


```js
<% if (typeof modifier === undefined) { var modifier = ''; } -%>
    <header class="header<%= modifier %>">
      <h1><a href="/"><%= site.name %></a></h1>

      <nav>
        <ul class="p-global-nav">
          <li class="p-global-nav__item"><a href="/" class="p-global-nav__link">home</a></li>
          <li class="p-global-nav__item"><a href="/page1" class="p-global-nav__link">page1</a></li>
          <li class="p-global-nav__item"><a href="/page2" class="p-global-nav__link">page2</a></li>
          <li class="p-global-nav__item"><a href="/page3" class="p-global-nav__link">page3</a></li>
        </ul>
      </nav>
    </header>
```

### _footer.ejs

develop/_partials/_footer.ejsには共通で使用するフッターとスクリプトが定義されています。Google Analyticsを使用しない場合はエラーになってしまうので削除してください。

```js
<% if (typeof modifier === undefined) { var modifier = ''; } -%>
    <footer class="footer<%= modifier %>">
      <p><small>© <%= site.name %> All Rights Reserved.</small></p>
    </footer>

    <!-- JavaScript -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="<%= page.relativePath %>assets/js/jquery-2.2.0.min.js"><\/script>')</script>
    <script src="<%= page.relativePath %>assets/js/bundle/bundle.js"></script>
    <script src="<%= page.relativePath %>assets/js/common.js"></script><% if(page.singleJs) { %><% page.singleJs.forEach(function(data) { %>
    <script src="<%= data %>"></script><% }); %><% } %>
    <!-- / JavaScript -->

    <!-- Google Analytics -->
    <script>
      (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,"script","//www.google-analytics.com/analytics.js","ga");
      ga("create", "<%= site.analyticsId %>", "auto");
      ga("require", "displayfeatures");
      ga("send", "pageview");
    </script>
    <!-- / Google Analytics -->
  </body>
</html>
```

### _breadcrumb.ejs

_partials/_breadcrumb.ejsには各ディレクトリ共通で使用するパンくずリストが定義されています。

```js
<% if (typeof pageTitle === undefined) { var pageTitle = ''; } -%>
<% if (typeof modifier === undefined) { var modifier = ''; } -%>
    <ol class="p-breadcrumb<%= modifier %>">
      <li class="p-breadcrumb__item"><a href="../" class="p-breadcrumb__link">Home</a></li><% if(pageTitle) { %>
      <li class="p-breadcrumb__item"><%= pageTitle %></li><% } %>
    </ol>
```

_header.ejsや_footer.ejsと同じようにindex.ejsからmodifierの指定ができます。

```js
<%- include('_partials/_breadcrumb', {page: page, pageTitle: page.title, modifier: ''}); %>
```

`/page/index.ejs`でインクルードするファイルは`/_partials/_breadcrumb`となります。

## assets
developディレクトリ直下は基本的にEJSのために使用します。それ以外のファイルはdevelop/assetsディレクトリで管理をしていきます。ページ専用のCSSや画像フォルダはassetsディレクトリに置かなくても大丈夫です。

### image
imageディレクトリは空の状態です。Gulpタスクを実行してもフォルダも生成されないので、仮の画像やOGP画像などを入れてからタスクを実行します。developディレクトリの階層構造を保ったままreleaseディレクトリに出力されます。

### css
cssディレクトリは[FLOCSS](https://github.com/hiloki/flocss)をベースにSassで構成しています。

1. Foundation
 1. function
 1. variable
 1. mixin
 1. vendor（Normalize.css）
 1. base（プロジェクトにおける、基本的なベーススタイル）
1. Layout（ヘッダーやフッターのような、ページを構成するコンテナブロック）
1. Object（プロジェクトにおけるビジュアルパターン）
 1. component（多くのプロジェクトで横断的に再利用のできるような、小さな単位のモジュール）
 1. project（プロジェクト固有のパターンで、コンテンツを構成する要素）
 1. scope（ページ単位でスタイルを指定する）
 1. utility（いわゆる汎用クラスで、ほとんどの場合は単一のスタイル）

レイヤーを追加する場合は[CSS Styleguide](https://github.com/manabuyasuda/styleguide/blob/master/css-styleguide.md#flocss)を参照してください。

objectレイヤーのcomponentとprojectレイヤーにはグリッドやボタンなどの汎用的に使用できるスタイルがあらかじめ定義されています。

foundation/mixinレイヤーには汎用的に使えるいくつかのmixinが定義されています。グローバル変数を使っているものもあるので、foundation/variableレイヤーも確認してください。

変数と関数はすべて`_`からはじまります。名前の区切りは`-`です。

```scss
// 変数
$_max-width

// function
_z-index()

// mixin
_mq-up()
```


ブレイクポイントはMapタイプの変数で定義されています。

```scss
// min-width
$_breakpoint-up: (
  'sm': 'screen and (min-width: 400px)',
  'md': 'screen and (min-width: 768px)',
  'lg': 'screen and (min-width: 1000px)',
  'xl': 'screen and (min-width: 1200px)',
) !default;

// max-width
$_breakpoint-down: (
  'sm': 'screen and (max-width: 399px)',
  'md': 'screen and (max-width: 767px)',
  'lg': 'screen and (max-width: 999px)',
  'xl': 'screen and (max-width: 1199px)',
) !default;
```

呼び出すときは`_mq-up()`で`min-width`が、`_mq-down()`で`max-width`が出力されます。mixinの引数に変数のキーを渡すと、それに対応した値が返ります。

```scss
.foo {
  color: red;
  @include _mq-up(sm) {
    color: blue;
  }
}

// @example css - CSS output
.foo {
  color: red;
}
@media screen and (min-width: 400px) {
  .foo {
    color: blue;
  }
}
```

その他にもclearfixを呼び出す`_clearfix()`やレスポンシブに対応したクラスを生成する`_responsive()`、マウスオーバーなどのイベントを一括で指定する`_on-event`などがあります。

SassはCSSにコンパイルされるときに「autoprefixer」でベンダープレフィックスの自動付与、「csscomb」で整形とプロパティの並び替えが実行されます。また、CSSファイルと同じディレクトリにsourcemapsが出力されます。

develop/assets/css/_single.scssはFoundationレイヤーにあるfunction、Variable、Mixinレイヤーをインポートしています。HTML専用のCSSファイルには以下のように記述して_single.scssをインポートします。

```scss
/* =============================================================================
   #Index
   ========================================================================== */
// プロジェクト共通のグローバル変数と関数をインポートします。
@import "../assets/css/_single";
```

function、Variable、Mixinレイヤーにファイルを追加したときには_single.scssにも追記をしてください。

### js
JavaScriptはassets/js/bundleディレクトリにjQueryプラグインやライブラリなどのファイルを保存します。連結されて`bundle.js`として出力されます。minifyはされません。それ以外のjsファイルはそのままの階層で出力されます。

* jQueryはCDNとフォールバックの読み込みをしています。2.0系を読み込んでいるのでIE9以降からの対応になります。
* jQueryプラグインなどはassets/js/bundleディレクトリに保存してください。ディレクトリ内のファイルを自動で連結して`bundle.js`として出力されます。
* 自作のスクリプトやjQueryプラグインなどのトリガーはassets/js/common.js（名前は変更可能）に記述してください。


### アイコンフォント
develop/assets/iconディレクトリにSVGファイルを保存するとアイコンフォントが自動で生成されます。アイコンフォント専用のscssファイルも同時に生成されます。

* develop/assets/iconにSVGファイルを保存
* develop/assets/fontにフォントファイルを出力
* develop/assets/css/object/projectにscssファイルを生成
* developディレクトリと同じ階層でrelaseディレクトリにフォントファイルがコピー

scssファイルのテンプレートはdevelop/assets/icon/templateに保存されています。適宜変更してください。  
スタイルの追加はdevelop/assets/css/object/project/_icon-extend.scssにしていきます。

使用しない場合はgulp.fileからタスクを削除してください。

## スタイルガイドの生成
スタイルガイドの生成は[Hologram](http://trulia.github.io/hologram/)を使用しています。

Bundlerのインストール。

```bash
gem install bundler
```

Hologramのインストール。

```bash
bundle install
```

スタイルガイドの生成。

```bash
gulp styleguide
```

詳しくはhologram/README.mdを参照してください。
