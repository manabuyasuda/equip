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
develop/index.ejsがトップページになります。develop/_layoutディレクトリにある_head.ejsと_footer.ejsがテンプレートになります。基本的にindex.ejs以外は変更する必要はありません（必要のないmetaタグは削除しても大丈夫です）。

### data(json)

develop/assets/data/site.jsonにサイト共通の値が指定されています。サイトの名前やOGPの指定などがありますので、最初に確認をして、変更してください。site.jsonは`site.name`のように呼び出すことができます。

* `site.name`はサイトの名前を記述します。（`title`要素に使用されます）
* `site.description`はサイトの簡単な説明を記述します。（`meta`要素内の`name`属性に使用されます）
* `site.keywords`はサイトのキーワードを記述します。GoogleとYahoo!の検索エンジンは読んでいませんが、できれば記述しておきます。（`meta`要素内の`name`属性に使用されます）
* `site.author`はその文書の作者名（そのサイトの運営者・運営社）を記述します。（`meta`要素内の`name`属性に使用されます）
* `site.rootURL`はそのサイトの絶対パスを記述します。似たようなURLが複数ある場合やモバイルとPC向けのURLが違う場合などに使われるようです。（`canonical`属性やOGPの`og:url`に使用されます）
* `site.css`はassetsディレクトリｄえ読み込むCSSファイルの拡張子を記述します。`gulp release`タスクを実行すると、minify（圧縮）したCSSファイルが生成されます。名前は`~.min.css`になります、minifyしたCSSファイルを読み込む場合は`.min.css`と記述します。
* `site.OgImage`はシェアされたときのサムネイル画像を絶対パスで記述します。（OGPの`og:image`で使用されます）
* `site.facebookAdmins`はFacebook insightsのデータの閲覧権限を与える個人のFacebookアカウントID（カンマで区切ると複数人に権限を与えられる）を記述します。`site.facebookAppId`か`site.facebookAdmins`のどちらかを記述します。（OGPの`fb:admins`に使用されます）
* `site.facebookAppId`はFacebook insightsのデータの閲覧権限を与えるアプリ（サイト）のIDを記述します。`site.facebookAdmins`か`site.facebookAppId`のどちらかを記述します。（OGPの`fb:app_id`に使用されます）
* `site.twitterCard`は[Twitterでツイートされたときのスタイル](https://dev.twitter.com/ja/cards/getting-started)を指定します。（OGPの`twitter:card`で使用されます）
* `site.twitterSite`Twitterでツイートされたときに表示するTwitterアカウントを@をつけて記述します。（OGPの`twitter:site`で使用されます）
* `site.favicon`はファビコンに使用する画像を絶対パスで記述します。[.ico形式に変換した16px×16pxと32px×32pxのマルチアイコン](http://liginc.co.jp/web/design/material/16853)にするのが良いようです。（`shortcut icon`に使用されます）
* `site.appleIcon`はiPhoneでホーム画面に追加したときに使用される画像（ホームアイコン）を絶対パスで記述します。iPhone 6 Plusで180px、iPhone 6と5で120pxが適合するサイズです。（`apple-touch-icon`で使用されます）
* `site.appTitle`はホームアイコンを保存するときのタイトルの初期値を記述します。[日本語は6文字以内、英語は13文字以内にすると省略されないようです](https://hyper-text.org/archives/2012/09/iphone-5-ios-6-html5-developers.shtml)。（`apple-mobile-web-app-title`に使用されます）
* `site.analyticsId`はGoogle Analyticsの[トラッキングID](https://support.google.com/analytics/answer/1032385?hl=ja)を記述します。

```json
{
  "name": "site name",
  "description": "site description",
  "keywords": "keyword1, keyword2",
  "author": "Manabu Yasuda",
  "rootURL": "http://example.com/",
  "css": ".css",
  "ogImage": "http://example.com/images/og-image.jpg",
  "facebookAdmins": "",
  "facebookAppId": "",
  "twitterCard": "summary",
  "twitterSite": "@",
  "favicon": "http://example.com/images/favicon.ico",
  "appleIcon": "http://example.com/images/apple-icon.ico",
  "appTitle": "site name",
  "analyticsId": "UA-XXXXX-X"
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

index.ejsには下記のように変数が定義されているので、ページごとに変更することができます。index.ejsでは`pageData.title`、インクルードしている_head.ejsや_footer.ejsなどでは`page.title`のように呼び出すことができます。

* `pageData.title`はそのページの名前を記述します。空にするとサイトタイトルだけ、記述するとサイトタイトルと一緒に出力されます。
* `pageData.desctiption`はそのページの説明を記述します。
* `pageData.keywords`はそのページのキーワードを記述します。
* `pageData.class`は`body`要素にclassを指定できます。
* `page.current`はそのページのフォルダ名を記述します（トップページは空にしておきます）。
* `pageData.url`はmetaタグの絶対パスで使用されています。
* `pageData.path`は下層ページで使用し、パスを追加したい場合に階層の深さにあわせて指定します。
* `pageData.css`はページ専用のscssファイルを作成したい場合に指定します。css/single.scssを作成した場合は`css/single.css`と記述します。index.ejsと同じ階層にscssファイルを作成します。
* `pageData.ogpType`はOGPで使用されていて、トップページはwebsite、それ以外の記事はarticleを指定します。

```js
<% var pageData = {
  title: "top page",
  description: site.description,
  keywords: site.keywords,
  class: "top",
  current: "",
  url: "index.html",
  path: "",
  css: "",
  ogpType: "website"
};
-%>
<%- include(pageData.path + '_layouts/_head.ejs', {page: pageData, modifier: ''}); %>
<%- include(pageData.path + '_layouts/_header.ejs', {page: pageData, modifier: ''}); %>
    <article>contents here</article>

<%- include(pageData.path + '_layouts/_footer.ejs', {page: pageData, modifier: ''}); %>
```

`include()`の第一引数はすべてのindex.ejs共通です。第二引数の1つ目の`page: pageData,`は各index.ejsの変数（`pageData`）をインクルードするファイルに渡しています。2つ目の`modifier: ''`はインクルードするファイルにclass属性を付け加えたい場合に指定します。例えば_header.ejsのインクルードで`modifier: ' header--fixed'`と渡した場合、以下のように出力されます。

```html
<header class="header header--fixed">
```

develop/child-page1ディレクトリとchild-page1/grandchild-page1/ディレクトリの_index.ejsは下層ページを作る場合に使用します（フォルダごとコピーして使いまわします）。_index.ejsのようにアンダースコアをつけると出力されません。変数は下記のように変更して使います。

```js
<% var pageData = {
  title: "child page1",
  description: "child page1 description",
  keywords: site.keywords,
  class: "child-page1",
  current: "child-page1",
  url: "child-page1/index.html",
  path: "../",
  css: "",
  ogpType: "article"
};
-%>
<%- include(pageData.path + '_layouts/_head.ejs', {page: pageData, modifier: ''}); %>
<%- include(pageData.path + '_layouts/_header.ejs', {page: pageData, modifier: ''}); %>
    <article>contents here</article>

<%- include(pageData.path + '_layouts/_footer.ejs', {page: pageData, modifier: ''}); %>
```

```js
<% var pageData = {
  title: "grandchild-page",
  description: "grandchild page description",
  keywords: site.keywords,
  class: "grandchild-page",
  current: "grandchild-page",
  url: "grandchild-page/index.html",
  path: "../../",
  css: "",
  ogpType: "article"
};
-%>
<%- include(pageData.path + '_layouts/_head.ejs', {page: pageData, modifier: ''}); %>
<%- include(pageData.path + '_layouts/_header.ejs', {page: pageData, modifier: ''}); %>
    <article>contents here</article>

<%- include(pageData.path + '_layouts/_footer.ejs', {page: pageData, modifier: ''}); %>
```

### _header.ejs
_layout/_header.ejsには共通で使用するメインナビゲーションが定義されています。`a`タグにテキストを追加する場合のコードサンプルは[Gist](https://gist.github.com/manabuyasuda/fccdf47895871ae2e20d)を参照してください。

* `fileName`は各ページのフォルダ名を記述します。（index.ejsの`page.current`と一致した場合は`.is-current`が付きます）
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
      <h1><a href="<% if(page.path) { %><%= page.path %>index.html<% } %>"><%= site.name %></a></h1>
      <nav>
        <ul class="<%= ulClass %>"><% navs.forEach(function(nav) { %><% if(page.current === nav.fileName) { %><% if(page.path === "../") { %>
          <li class="<%= liClass %>">
            <a href="" class="<%= aClass %> is-current"><%= nav.pageName %></a>
          </li><% } else { %>
          <li class="<%= liClass %>">
            <a href="<%= page.path.slice(3) %>index.html" class="<%= aClass %> is-current"><%= nav.pageName %></a>
          </li><% } %><% } else if(page.current === "") { %>
          <li class="<%= liClass %>">
            <a href="<%= nav.fileName %>/index.html" class="<%= aClass %>"><%= nav.pageName %></a>
          </li><% } else { %>
          <li class="<%= liClass %>">
            <a href="<%= page.path %><%= nav.fileName %>/index.html" class="<%= aClass %>"><%= nav.pageName %></a>
          </li><% } %><% }) %>
        </ul>
      </nav>
    </header>
```

### _footer.ejs
_layout/_footer.ejsには共通で使用するフッターとスクリプトが定義されています。

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
    <script>window.jQuery || document.write('<script src="<%= page.path %>assets/js/jquery-2.2.0.min.js"><\/script>')</script>
    <script src="<%= page.path %>assets/js/vendor/vendor.js"></script>
    <script src="<%= page.path %>assets/js/index.js"></script>
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

* メディアクエリ（`min-width`）を挿入する`mq()`
* メディアクエリ（`max-width`）を挿入する`mqd()`
* グリッドの横幅（パーセンテージ）を指定する`cal()`
* グリッドの親要素になる`grid()`
* グリッドの子要素になる`grid__item()`
* clearfixを作る`cf()`
* 横幅の制限とセンタリングをする`wrapper()`
* メディアオブジェクトの親要素になる`media()`
* メディアオブジェクトの子要素になる`media__item()`
* レスポンシブな背景画像のベースになる`fluid()`
* レスポンシブなclassを生成する`responsive()`
* 表示を消しスクリーンリーダーにだけ読まれる`sr-only()`
* キャレット（&lt;）を生成する`caret()`
* アニメーションするハンバーガーボタンを生成する`burger()`
* クローズボタン（x）を生成する`close()`

メディアクエリを指定するmixin。

```scss
// input
html {
  font-size: 14px;
  @include mq(md) {
    font-size: 16px;
  }
}

/* output */
html {
  font-size: 14px;
}

@media screen and (min-width: 768px) {
  html {
    font-size: 16px;
  }
}
```

2カラムのグリッドレイアウトサンプル。

```scss
// input
.wrapper {
   @include wrapper(1200px, 1em);
}

.grid {
  @include grid;
}

.grid__item1 {
  @include grid__item(1em);
  @include mq(md) {
    @include col(8);
  }
}

.grid__item2 {
  @include grid__item(1em);
  @include mq(md) {
    @include col(4);
  }
}

/* output */
.wrapper {
  width: 100%;
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1em;
  padding-left: 1em;
}

.grid {
  display: block;
  margin: 0;
  padding: 0;
  font-size: 0;
  list-style-type: none;
}

.grid__item1 {
  display: inline-block;
  width: 100%;
  padding-left: 1em;
  font-size: 1rem;
  vertical-align: top;
}
@media screen and (min-width: 768px) {
  .grid__item1 {
    width: 66.66667%;
  }
}

.grid__item2 {
  display: inline-block;
  width: 100%;
  padding-left: 1em;
  font-size: 1rem;
  vertical-align: top;
}
@media screen and (min-width: 768px) {
  .grid__item2 {
    width: 33.33333%;
  }
}
```

メディアオブジェクトのサンプル。

```scss
// input
.media {
   @include media;
}

.media__item {
   @include media__item(1em, middle);
   @include mq(md) {
      &:not(:first-of-type) {
         padding-left: 2em;
      }
   }
}

/* output */
.media {
  display: table;
  width: 100%;
  margin: 0;
  padding: 0;
}

.media__item {
  display: table-cell;
  margin: 0;
  padding: 0;
  vertical-align: middle;
}
.media:not(:first-child) {
  padding-left: 1em;
}
.media > :first-child {
  margin-top: 0;
}
.media > :last-child {
  margin-bottom: 0;
}
.media > img {
  display: block;
  max-width: none;
}
@media screen and (min-width: 768px) {
  .media__item:not(:first-of-type) {
    padding-left: 2em;
  }
}
```

SassはCSSにコンパイルされるときに「autoprefixer」でベンダープレフィックスの自動付与、「csscomb」で整形とプロパティの並び替えが実行されます。また、CSSファイルと同じディレクトリにsourcemapsが出力されます。

### js
JavaScriptはassets/js/vendorディレクトリにjQueryプラグインなどのファイルを保存します。連結されて`vendor.js`として出力されます。minifyはされません。それ以外のassets/jsディレクトリにあるファイルはそのままの階層で出力されます。


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
