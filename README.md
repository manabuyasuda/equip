# equip - Make efficient site
静的サイトを効率良く作るためのテンプレートです。以下のような特徴があります。

* [EJS](http://ejs.co/)でヘッダーなどの共通部分のテンプレート化、JSONを利用したデータの管理
* [FLOCSS](https://github.com/hiloki/flocss)をベースにしたSassのディレクトリとグリッドやメディアクエリなどの@mixin集
* CSSや画像などのminifyと圧縮
* Browsersyncを利用したライブリロード
* [Hologram](http://trulia.github.io/hologram/)を利用したスタイルガイドの生成

## 始め方とGulpタスク
npmでパッケージをインストールします。

```bash
npm install
```

開発に使用するGulpタスクは3つあります。

```bash
gulp
```

```bash
gulp develop
```

```bash
gulp release
```

1. `gulp`（EJSとSassのコンパイルとjsと画像のdest、`watch`オプション）
1. `gulp develop`（デフォルトの`gulp`タスクにbrowser-syncによるライブリロードを追加）
1. `gulp release`（EJSとSassのコンパイルとjsと画像のdest。画像とCSSは圧縮されます。）

いずれも`clean`タスクでreleaseディレクトリがあればいったん削除されます。

## EJS
develop/index.ejsがトップページになります。develop/_partialsディレクトリ内にグローバルに使用するテンプレートを保存します。

### data(json)

develop/assets/data/site.jsonにサイト共通の値が指定されています。サイトの名前やOGPの指定などがありますので、最初に確認をして、変更してください。site.jsonは`site.name`のように呼び出すことができます。

* `site.name`はサイトの名前を記述します。（`title`要素に使用されます）
* `site.description`はサイトの簡単な説明を記述します。（`meta`要素内の`name`属性に使用されます）
* `site.keywords`はサイトのキーワードを記述します。（`meta`要素内の`name`属性に使用されます）
* `site.author`はその文書の作者名（そのサイトの運営者・運営社）を記述します。※省略可能（`meta`要素内の`name`属性に使用されます）
* `site.rootUrl`はそのサイトの絶対パス（`http`で始まりドメイン名+`/`で終わる）を記述します。（OGPの`og:url`に使用されます）
* `site.css`はassetsディレクトリで読み込むCSSファイルの拡張子を記述します。`gulp release`タスクを実行すると、minify（圧縮）したCSSファイルが生成されます。名前は`~.min.css`になります、minifyしたCSSファイルを読み込む場合は`.min.css`と記述します。
* `site.ogpImage`はシェアされたときのサムネイル画像を絶対パスで記述します。（OGPの`og:image`で使用されます）
* `site.facebookAdmins`はFacebook insightsのデータの閲覧権限を与える個人のFacebookアカウントID（カンマで区切ると複数人に権限を与えられる）を記述します。`site.facebookAppId`か`site.facebookAdmins`のどちらかを記述します。（OGPの`fb:admins`に使用されます）※省略可能
* `site.facebookAppId`はFacebook insightsのデータの閲覧権限を与えるアプリ（サイト）のIDを記述します。`site.facebookAdmins`か`site.facebookAppId`のどちらかを記述します。（OGPの`fb:app_id`に使用されます）※省略可能
* `site.twitterCard`は[Twitterでツイートされたときのスタイル](https://dev.twitter.com/ja/cards/getting-started)を指定します。（OGPの`twitter:card`で使用されます）
* `site.twitterSite`Twitterでツイートされたときに表示するTwitterアカウントを@をつけて記述します。※省略可能（OGPの`twitter:site`で使用されます）
* `site.favicon`はファビコンに使用する画像を絶対パスで記述します。[.ico形式に変換した16px×16pxと32px×32pxのマルチアイコン](http://liginc.co.jp/web/design/material/16853)にするのが良いようです。※省略可能（`shortcut icon`に使用されます）
* `site.appleIcon`はiPhoneでホーム画面に追加したときに使用される画像（ホームアイコン）を絶対パスで記述します。iPhone 6 Plusで180px、iPhone 6と5で120pxが適合するサイズです。※省略可能（`apple-touch-icon`で使用されます）
* `site.appTitle`はホームアイコンを保存するときのタイトルの初期値を記述します。※省略可能[日本語は6文字以内、英語は13文字以内にすると省略されないようです](https://hyper-text.org/archives/2012/09/iphone-5-ios-6-html5-developers.shtml)。（`apple-mobile-web-app-title`に使用されます）
* `site.analyticsId`はGoogle Analyticsの[トラッキングID](https://support.google.com/analytics/answer/1032385?hl=ja)を記述します。
* `site.developDir`は開発用ディレクトリ名を記述します。ファイルのパスを取得するのに使用されます。

```json
{
  "name": "サイトのタイトル",
  "description": "サイトの概要",
  "keywords": "サイトのキーワード1, サイトのキーワード2",
  "author": "サイトの運営者名",
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

index.ejsには変更が必要なものや変更ができるものについての変数が定義されているので、ページごとに変更することができます。変数はindex.ejs、インクルードしている_head.ejsや_footer.ejsなどで`page.title`のように呼び出すことができます。

* `page.title`はそのページの名前を記述します。空にするとサイトタイトルだけ、記述するとサイトタイトルと一緒に出力されます。
* `page.desctiption`はそのページの説明を記述します。
* `page.keywords`はそのページのキーワードを記述します。
* `page.bodyClass`は`body`要素にclassを指定できます。
* `page.currentNav`はそのページのフォルダ名を記述します（トップページは空にしておきます）。
* `page.singleCss`はページ専用のscssファイルを作成したい場合に指定します。css/single.scssを作成した場合は`css/single.css`と記述します。index.ejsと同じ階層にscssファイルを作成します。
* `page.singleJs`はページ専用のjsファイルを作成したい場合に指定します。js/single.jsのように記述します。
* `page.ogpType`はOGPで使用されていて、トップページはwebsite、それ以外の記事はarticleを指定します。
* ``page.ogpImage`はOGPで使用されていて、サイト共通であれば`site.ogpImage`を指定、個別に設定したい場合は`'http://example.com/images/og-image.jpg'`のように絶対パスで指定します。
* `page.absolutePath`はファイルごとの`/`を含まないルートパスを格納しています。metaタグの絶対パスで使用されています。
* `pageData.relativePath`はファイルごとの相対パスを格納しています。

```js
<%
var absolutePath = filename.split(site.developDir)[filename.split(site.developDir).length -1].replace('.ejs','.html');
var relativePath = '../'.repeat([absolutePath.split('/').length -1]);
var page = {
  title: "ページのタイトル",
  description: site.description,
  keywords: site.keywords,
  bodyClass: "",
  currentNav: "",
  singleCss: "",
  singleJs: "",
  ogpType: "website",
  ogpImage: site.ogpImage,
  absolutePath: absolutePath,
  relativePath: relativePath
};
-%>
<%- include(page.relativePath + '_partials/_head.ejs', {page: page, modifier: ''}); %>
<%- include(page.relativePath + '_partials/_header.ejs', {page: page, modifier: ''}); %>
    <article>contents here</article>

<%- include(page.relativePath + '_partials/_footer.ejs', {page: page, modifier: ''}); %>
```

`include()`の第一引数はすべてのindex.ejs共通です。第二引数の1つ目の`page: page,`は各index.ejsの変数（`page`）をインクルードするファイルに渡しています。2つ目の`modifier: ''`はインクルードするファイルにclass属性を付け加えたい場合に指定します。例えば_header.ejsのインクルードで`modifier: ' header--fixed'`と渡した場合（スペースが入っていることに注意）、以下のように出力されます。

```html
<header class="header header--fixed">
```

develop/child-page1ディレクトリとchild-page1/grandchild-page1/ディレクトリの_index.ejsは下層ページを作る場合に使用します（フォルダごとコピーして使いまわします）。_index.ejsのようにアンダースコアをつけると出力されません。変数は下記のように変更して使います。

```js
<%
var absolutePath = filename.split(site.developDir)[filename.split(site.developDir).length -1].replace('.ejs','.html');
var relativePath = '../'.repeat([absolutePath.split('/').length -1]);
var page = {
  title: "ページのタイトル",
  description: "ページの概要",
  keywords: site.keywords,
  bodyClass: "",
  currentNav: "child-page1",
  singleCss: "",
  singleJs: "",
  ogpType: "article",
  ogpImage: site.ogpImage,
  absolutePath: absolutePath,
  relativePath: relativePath
};
-%>
<%- include(page.relativePath + '_partials/_head.ejs', {page: page, modifier: ''}); %>
<%- include(page.relativePath + '_partials/_header.ejs', {page: page, modifier: ''}); %>
<%- include('../' + '_partials/_breadcrumb.ejs', {page: page, pageTitle: page.title, modifier: ''}); %>
    <article>contents here</article>

<%- include(page.relativePath + '_partials/_footer.ejs', {page: page, modifier: ''}); %>
```

```js
<%
var absolutePath = filename.split(site.developDir)[filename.split(site.developDir).length -1].replace('.ejs','.html');
var relativePath = '../'.repeat([absolutePath.split('/').length -1]);
var page = {
  title: "ページのタイトル",
  description: "ページの概要",
  keywords: site.keywords,
  bodyClass: "",
  currentNav: "child-page1",
  singleCss: "",
  singleJs: "",
  ogpType: "article",
  ogpImage: site.ogpImage,
  absolutePath: absolutePath,
  relativePath: relativePath
};
-%>
<%- include(page.relativePath + '_partials/_head.ejs', {page: page, modifier: ''}); %>
<%- include(page.relativePath + '_partials/_header.ejs', {page: page, modifier: ''}); %>
<%- include('../' + '_partials/_breadcrumb.ejs', {page: page, pageTitle: page.title, modifier: ''}); %>
    <article>contents here</article>

<%- include(page.relativePath + '_partials/_footer.ejs', {page: page, modifier: ''}); %>
```

ルーディレクトリのindex.ejsファイル以外はパンくずリストをインクルードします。デフォルトでは`pageTitle: page.title`のようにファイルのタイトルがパンくずリストのタイトルになるようになっています。

変更する場合は`pageTitle: '任意のタイトル'`のようにします。

### _head.ejs

_partials/_head.ejsには共通で使用するメタタグなどが定義されています。基本的に変更する必要はなく、site.jsonやindex.ejsの設定によって要素を削除したりしています。

```js
<% if (typeof modifier === undefined) { var modifier = ''; } -%>
<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# <%= page.ogpType %>: http://ogp.me/ns/<%= page.ogpType %>#">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <% if(page.title) { %><title><%= page.title %> | <%= site.name %></title><% } else { %><title><%= site.name %></title><% } %>
    <meta name="description" content="<%= page.description %>">
    <meta name="keywords" content="<%= page.keywords %>"><% if(site.author) { %>
    <meta name="author" content="<%= site.author %>"><% } %>

    <link rel="stylesheet" href="<%= page.relativePath %>assets/css/style<%= site.css %>"><% if(page.singleCss) { %>
    <link rel="stylesheet" href="<%= page.singleCss %>"><% } %>

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
    <meta property="og:locale" content="ja_JP">
    <% if(site.facebookAppId) { %><meta property="fb:app_id" content="<%= site.facebookAppId %>"><% } else if(site.facebookAdmins) { %><meta property="fb:admins" content="<%= site.facebookAdmins -%>"><% } %>
    <meta name="twitter:card" content="<%= site.twitterCard %>"><% if(site.twitterSite) { %>
    <meta name="twitter:site" content="<%= site.twitterSite %>"><% } %>
    <!-- / OGP -->

  </head>
  <% if(page.bodyClass) { %><body class="<%= page.bodyClass %><%= modifier %>"><% } else { %><body><% } %>
```

### _header.ejs

_partials/_header.ejsには共通で使用するメインナビゲーションが定義されています。`a`タグにテキストを追加する場合のコードサンプルは[Gist](https://gist.github.com/manabuyasuda/fccdf47895871ae2e20d)を参照してください。

* `fileName`は各ページのフォルダ名を記述します。（index.ejsの`page.currentNav`と一致した場合は`.is-current`が付きます）
* `pageName`にナビゲーションに表示するページ名を記述します。
* `ulClass`などは`ul`要素、`li`要素、`a`要素に指定するクラス名を記述します。

```js
<% var
// `fileName`にページのフォルダ名を記述します。
// `pageName`にナビゲーションに表示するページ名を記述します。
// index.ejsの`pageCurrent`と`name`が同じ場合は`.is-current`が付きます。
// `a`タグ内にテキストを追加する場合のコード。https://gist.github.com/manabuyasuda/fccdf47895871ae2e20d
navs = [
  { fileName: "child-page1", pageName: "child page1"},
  { fileName: "child-page2", pageName: "child page2"},
  { fileName: "child-page3", pageName: "child page3"},
]
// `ul`, `li`, `a`要素に記述するクラス名をそれぞれ定義します。
ulClass = "main-nav";
liClass = "main-nav__item";
aClass = "main-nav__link";

if (typeof modifier === undefined) { var modifier = ''; }
-%>
    <header class="header<%= modifier %>">
      <h1><a href="<% if(page.relativePath) { %><%= page.relativePath %>index.html<% } %>"><%= site.name %></a></h1>
      <nav>
        <ul class="<%= ulClass %>"><% navs.forEach(function(nav) { %><% if(page.currentNav === nav.fileName) { %><% if(page.relativePath === "../") { %>
          <li class="<%= liClass %>">
            <a href="./" class="<%= aClass %> is-current"><%= nav.pageName %></a>
          </li><% } else { %>
          <li class="<%= liClass %>">
            <a href="<%= page.relativePath.slice(3) %>index.html" class="<%= aClass %> is-current"><%= nav.pageName %></a>
          </li><% } %><% } else if(page.currentNav === "") { %>
          <li class="<%= liClass %>">
            <a href="<%= nav.fileName %>/index.html" class="<%= aClass %>"><%= nav.pageName %></a>
          </li><% } else { %>
          <li class="<%= liClass %>">
            <a href="<%= page.relativePath %><%= nav.fileName %>/index.html" class="<%= aClass %>"><%= nav.pageName %></a>
          </li><% } %><% }) %>
        </ul>
      </nav>
    </header>
```

### _footer.ejs

_partials/_footer.ejsには共通で使用するフッターとスクリプトが定義されています。

* jQueryはCDNとフォールバックの読み込みをしています。2.0系を読み込んでいるのでIE9以降からの対応になります。
* jQueryプラグインなどはassets/js/vendorディレクトリに保存してください。ディレクトリ内のファイルを自動で連結して`vendor.js`として出力されます。
* 自作のスクリプトやjQueryプラグインなどのトリガーはassets/jsディレクトリの`index.js`（名前は変更可能）に記述してください。
* Google Analyticsを使用しない場合はエラーになってしまうので削除してください。

```js
<% if (typeof modifier === undefined) { var modifier = ''; } -%>
    <footer class="footer<%= modifier %>">
      <p><small>© <%= site.name %> All Rights Reserved.</small></p>
    </footer>

    <!-- JavaScript -->
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="<%= page.relativePath %>assets/js/jquery-2.2.0.min.js"><\/script>')</script>
    <script src="<%= page.relativePath %>assets/js/vendor/vendor.js"></script>
    <script src="<%= page.relativePath %>assets/js/index.js"></script><% if(page.singleJs) { %>
    <script src="<%= page.singleJs %>"></script><% } %>
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
      <li class="p-breadcrumb__item"><%- pageTitle %></li><% } %>
    </ol>
```

_header.ejsや_footer.ejsと同じようにindex.ejsからmodifierの指定ができます。

```js
<%- include('../' + '_partials/_breadcrumb.ejs', {page: page, pageTitle: page.title, modifier: ''}); %>
```

`/page/index.ejs`でインクルードするファイルは`/_partials/_breadcrumb.ejs`となります。

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

### js
JavaScriptはassets/js/vendorディレクトリにjQueryプラグインなどのファイルを保存します。連結されて`vendor.js`として出力されます。minifyはされません。それ以外のjsファイルはそのままの階層で出力されます。


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
