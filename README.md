# gulp-ejs-sass
静的ページを効率良く作るためのテンプレートです。

EJSを使っているので、共通部分の変更やページごとの上書きが簡単にできます。Sassの便利なオブジェクトやmixin付きです。画像の圧縮やライブリロードにも対応しています。

## EJS
develop/index.ejsがホームページになります。_layout/ディレクトリにある_head.ejsと_footer.ejsがテンプレートになります。基本的にindex.ejs以外は変更する必要はありません（必要のないmetaタグは削除しても大丈夫です）。

### data(json)

develop/assets/data/site.jsonにサイト共通の値が指定されています。サイトの名前やOGPの指定などがありますので、最初に確認をして、変更してください。site.jsonは`site.name`のように呼び出すことができます。

* `site.name`はサイトの名前を記述します。（`title`要素に使用されます）
* `site.description`はサイトの簡単な説明を記述します。（`meta`要素内の`name`属性に使用されます）
* `site.keywords`はサイトのキーワードを記述しますが、GoogleとYahoo!の検索エンジンは読んでいないためmeta要素自体を削除しても問題ありません。（`meta`要素内の`name`属性に使用されます）
* `site.author`はその文書の作者名（そのサイトの運営者・運営社）を記述します。（`meta`要素内の`name`属性に使用されます）
* `site.rootURL`はそのサイトの絶対パスを記述します。似たようなURLが複数ある場合やモバイルとPC向けのURLが違う場合などに使われるようです。（`canonical`属性やOGPの`og:url`に使用されます）
* `site.css`は読み込むCSSファイル名を記述します。`gulp release`タスクでminify（圧縮）したCSSファイルが生成されます。名前は`~.min.css`となります。
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
  "css": "style.css",
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

index.ejsには下記のように変数が定義されているので、ページごとに指定することができます。index.ejsは`pageTitle`のように名前を統一してあります。

* `pageTitle`はそのページの名前を記述します。空にするとサイトタイトルだけ、記述するとサイトタイトルと一緒に出力されます。
* `pageDesctiption`はそのページの説明を記述します。
* `pageClass`は`body`要素にclassを指定できます。
* `pageCurrent`はナビゲーションに`.is-current`を付けたい場合に記述します（トップページは空にしておきます）
* `pageUrl`はmetaタグの絶対パスで使用されています。
* `addPath`は下層ページで使用し、パスを追加したい場合に階層の深さにあわせて指定します。
* `ogpType`はOGPで使用されていて、ホーム（トップ）ページはwebsite、それ以外の記事はarticleを指定します。

```js
<% var
pageTitle = "";
pageDescription = site.description;
pageClass = "top";
pageCurrent = "";
pageUrl = "index.html";
addPath = "";
ogpType = "website";
-%>
```

develop/child-page1/index.ejsとchild-page1/grandchild-page1/_index.ejsは下層ページを作る場合に使用します（フォルダごとコピーして使いまわします）。_index.ejsのようにアンダースコアをつけると出力されません。変数は下記のように変更して使います。

```js
<% var
pageTitle = "child page1";
pageDescription = "child page1 description";
pageClass = "child-page1";
pageCurrent = "child-page1";
pageUrl = "child-page1/index.html";
addPath = "../";
ogpType = "article";
-%>
```

```js
<% var
pageTitle = "grandchild-page";
pageDescription = "grandchild page description";
pageClass = "grandchild-page";
pageCurrent = "grandchild-page";
pageUrl = "grandchild-page/index.html";
addPath = "../../";
ogpType = "article";
-%>
```

### _header.ejs
_layout/_header.ejsには共通で使用するメインナビゲーションが定義されています。`a`タグにテキストを追加する場合のコードサンプルは[Gist](https://gist.github.com/manabuyasuda/fccdf47895871ae2e20d)を参照してください。

* `name`は各ページのフォルダ名を記述します。（index.ejsの`pageCurrent`と一致した場合は`.is-current`が付きます）
* `ulClass`などは`ul`要素、`li`要素、`a`要素に指定するクラス名を記述します。

```js
<% var
// `name`にページの名前（フォルダ名）を記述します。
// index.ejsの`pageCurrent`と`name`が同じ場合は`.is-current`が付きます。
// トップページから見て、2階層下まで使用できます。
// `a`タグ内にテキストを追加する場合のコード。https://gist.github.com/manabuyasuda/fccdf47895871ae2e20d
navs = [
  { name: "child-page1"},
  { name: "child-page2"},
  { name: "child-page3"},
]
// `ul`, `li`, `a`要素に記述するクラス名をそれぞれ定義します。
ulClass = "main-nav";
liClass = "main-nav__item";
aClass = "main-nav__link";
-%>

    <header>
      <h1><a href="<%= site.rootURL %>index.html"><%= site.name %></a></h1>
      <nav>
        <ul class="<%= ulClass %>"><% navs.forEach(function(nav) { %><% if(pageCurrent === nav.name) { %>
          <% if(addPath === "../") { %><li class="<%= liClass %>">
            <a href="" class="<%= aClass %> is-current"><%= nav.name %></a>
          </li><% } else if(addPath === '../../') { %><li class="<%= liClass %>">
            <a href="../index.html" class="<%= aClass %> is-current"><%= nav.name %></a>
          </li><% } %><% } else if(pageCurrent === "") { %>
          <li class="<%= liClass %>">
            <a href="<%= nav.name %>/index.html" class="<%= aClass %>"><%= nav.name %></a>
          </li><% } else {%>
          <li class="<%= liClass %>"><% if(addPath === "../") { %>
            <a href="../<%= nav.name %>/index.html" class="<%= aClass %>"><%= nav.name %></a><% } else if(addPath === "../../") { %>
            <a href="../../<%= nav.name %>/index.html" class="<%= aClass %>"><%= nav.name %></a>
          <% } %></li><% } %><% }) %>
        </ul>
      </nav>
    </header>


```

### _footer.ejs
_layout/_footer.ejsには共通で使用するスクリプトが定義されています。

* jQueryはCDNとフォールバックの読み込みをしています。2.0系を読み込んでいるのでIE9以降からの対応になります。
* jQueryプラグインなどはjs/vendorディレクトリに保存してください。ディレクトリ内のファイルを自動で連結して`vendor.js`として出力されます。
* 自作のスクリプトやjQueryプラグインなどのトリガーはjsディレクトリの`index.js`（名前は変更可能）に記述してください。
* Google Analyticsを使用しない場合はエラーになってしまうので削除してください。

```js
    <!-- JavaScript -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="<%= addPath %>js/jquery-2.2.0.min.js"><\/script>')</script>
    <script src="<%= addPath %>js/vendor/vendor.js"></script>
    <script src="<%= addPath %>js/index.js"></script>
    <!-- / JavaScript -->

    <!-- Google Analytics -->
<script>
      (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,"script","//www.google-analytics.com/analytics.js","ga");
      ga("create", "<%= google.analyticsId %>", "auto");
      ga("require", "displayfeatures");
      ga("send", "pageview");
    </script>
    <!-- / Google Analytics -->
  </body>
</html>
```

## assets
develop/ディレクトリは基本的にEJSファイルのために使用します。ですので、SassとJavaScriptと画像とjsonはdevelop/assets/ディレクトリにあります。

### images
imagesディレクトリは空の状態です。Gulpタスクを実行してもフォルダも生成されないので、仮の画像やOGP画像などを入れてからタスクを実行します。

### sass
sassはITCSSをベースにしたディレクトリになっています。

1. Setting - グローバル変数、設定
1. Tool - デフォルトのmixinとfunction
1. Generic - 基礎になるスタイル（Normalize.css、リセット、box-sizingなど）
1. Base - クラスを持たない、HTML要素（タイプセレクタ）
1. Object - 見た目を定義しないデザインパターン
1. Component - デザインされたコンポーネント、UIの集合
1. Trump - ヘルパーと上書き

tool/レイヤーには汎用的に使えるいくつかのmixinが定義されています。グローバル変数を使っているものもあるので、setting/レイヤーも確認してください。

* メディアクエリ（`min-width`）を挿入する`mq()`
* メディアクエリ（`max-width`）を挿入する`mqd()`
* グリッドの横幅（パーセンテージ）を指定する`u-cal()`
* グリッドの親要素になる`o-grid()`
* グリッドの子要素になる`o-grid__item()`
* clearfixを作る`cf()`
* 横幅の制限とセンタリングをする`o-wrapper()`
* メディアオブジェクトの親要素になる`o-media()`
* メディアオブジェクトの子要素になる`o-media__item()`
* レスポンシブな背景画像のベースになる`o-fluid()`
* レスポンシブなclassを生成する`responsive()`
* 表示を消しスクリーンリーダーにだけ読まれる`sr-only()`
* キャレット（&lt;）を生成する`caret()`
* アニメーションするハンバーガーボタンを生成する`burger()`
* クローズボタン（x）を生成する`close()`

メディアクエリを指定するmixin。

```scss
// input
.foo {
  font-size: 14px;
  @include mq(md) {
    font-size: 16px;
  }
}

/* output */
.foo {
  font-size: 14px;
}

@media screen and (min-width: 768px) {
  .foo {
    font-size: 16px;
  }
}
```

2カラムのグリッドレイアウトサンプル。

```scss
// input
.foo {
   @include o-wrapper(1200px, 1em);
}

.bar {
  @include o-grid;
}

.bar__item1 {
  @include o-grid__item(1em);
  @include mq(md) {
    @include u-col(8);
  }
}

.bar__item2 {
  @include o-grid__item(1em);
  @include mq(md) {
    @include u-col(4);
  }
}

/* output */
.foo {
  width: 100%;
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1em;
  padding-left: 1em;
}

.bar {
  display: block;
  margin: 0;
  padding: 0;
  font-size: 0;
  list-style-type: none;
}

.bar__item1 {
  display: inline-block;
  width: 100%;
  padding-left: 1em;
  font-size: 1rem;
  vertical-align: top;
}
@media screen and (min-width: 768px) {
  .bar__item1 {
    width: 66.66667%;
  }
}

.bar__item2 {
  display: inline-block;
  width: 100%;
  padding-left: 1em;
  font-size: 1rem;
  vertical-align: top;
}
@media screen and (min-width: 768px) {
  .bar__item2 {
    width: 33.33333%;
  }
}
```

メディアオブジェクトのサンプル。

```scss
// input
.foo {
   @include o-media;
}

.foo__item {
   @include o-media__item(1em, middle);
   @include mq(md) {
      &:not(:first-child) {
         padding-left: 2em;
      }
   }
}

/* output */
.foo {
  display: table;
  width: 100%;
  margin: 0;
  padding: 0;
}

.foo__item {
  display: table-cell;
  margin: 0;
  padding: 0;
  vertical-align: middle;
}
.foo:not(:first-child) {
  padding-left: 1em;
}
.foo > :first-child {
  margin-top: 0;
}
.foo > :last-child {
  margin-bottom: 0;
}
.foo > img {
  display: block;
  max-width: none;
}
@media screen and (min-width: 768px) {
  .foo__item:not(:first-child) {
    padding-left: 2em;
  }
}
```

SassはCSSにコンパイルされるときに「autoprefixer」でベンダープレフィックスの自動付与、「csscomb」で整形とプロパティの並び替えが実行されます。また、CSSファイルと同じディレクトリにsourcemapsが出力されます。

### js
JavaScriptはvendor/ディレクトリにjQueryとmodernizrが保存されています。連結や圧縮などの処理はされません。

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

開発用のdevelopディレクトリにはassetsディレクトリがありますが、リリース用のreleaseディレクトリにはassetsディレクトリがありませんのでパスの指定に注意してください。
