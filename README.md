# gulp-ejs-sass
静的ページを効率良く作るためのテンプレートです。

EJSを使っているので、共通部分の変更やページごとの上書きが簡単にできます。Sassの便利なオブジェクトやmixin付きです。画像の圧縮やライブリロードにも対応しています。

## ejs
develop/index.ejsがホームページになります。_layout/ディレクトリにある_head.ejsと_footer.ejsがテンプレートになります。基本的にindex.ejs以外は変更する必要はありません（必要のないmetaタグは削除しても大丈夫です）。

### site.json

develop/assets/resources/site.jsonにサイト共通の値が指定されています。サイトの名前やOGPの指定などがありますので、最初に確認をして、変更してください。site.jsonは`site.name`のように名前を統一してあります。

* `site.name`はサイトの名前を記述します。（`title`要素に使用されます）
* `site.description`はサイトの簡単な説明を記述します。（`meta`要素内の`name`属性に使用されます）
* `site.keywords`はサイトのキーワードを記述しますが、GoogleとYahoo!の検索エンジンは読んでいないためmeta要素自体を削除しても問題ありません。（`meta`要素内の`name`属性に使用されます）
* `site.author`はその文書の作者名（そのサイトの運営者・運営社）を記述します。（`meta`要素内の`name`属性に使用されます）
* `site.rootURL`はそのサイトの絶対パスを記述します。似たようなURLが複数ある場合やモバイルとPC向けのURLが違う場合などに使われるようです。（`canonical`属性やOGPの`og:url`に使用されます）
* `ogp.image`はシェアされたときのサムネイル画像を絶対パスで記述します。（OGPの`og:image`で使用されます）
* `facebook.admins`はFacebook insightsのデータの閲覧権限を与える個人のFacebookアカウントID（カンマで区切ると複数人に権限を与えられる）を記述します。`facebook.app_id`か`facebook.admins`のどちらかを記述します。（OGPの`fb:admins`に使用されます）
* `facebook.app_id`はFacebook insightsのデータの閲覧権限を与えるアプリ（サイト）のIDを記述します。`facebook.admins`か`facebook.app_id`のどちらかを記述します。（OGPの`fb:app_id`に使用されます）
* `twitter.card`は[Twitterでツイートされたときのスタイル](https://dev.twitter.com/ja/cards/getting-started)を指定します。（OGPの`twitter:card`で使用されます）
* `twitter.site`Twitterでツイートされたときに表示するTwitterアカウントを@をつけて記述します。（OGPの`twitter:site`で使用されます）
* `icon.favicon`はファビコンに使用する画像を絶対パスで記述します。[.ico形式に変換した16px×16pxと32px×32pxのマルチアイコン](http://liginc.co.jp/web/design/material/16853)にするのが良いようです。（`shortcut icon`に使用されます）
* `icon.appleIcon`はiPhoneでホーム画面に追加したときに使用される画像（ホームアイコン）を絶対パスで記述します。iPhone 6 Plusで180px、iPhone 6と5で120pxが適合するサイズです。（`apple-touch-icon`で使用されます）
* `icon.appTitle`はホームアイコンを保存するときのタイトルの初期値を記述します。[日本語は6文字以内、英語は13文字以内にすると省略されないようです](https://hyper-text.org/archives/2012/09/iphone-5-ios-6-html5-developers.shtml)。（`apple-mobile-web-app-title`に使用されます）
* `google.analyticsId`はGoogle Analyticsの[トラッキングID](https://support.google.com/analytics/answer/1032385?hl=ja)を記述します。

```json
{
  "site": {
    "name": "site name",
    "description": "site description",
    "keywords": "keyword1, keyword2",
    "author": "Manabu Yasuda",
    "rootURL": "http://example.com/"
  },
  "ogp": {
    "image": "http://example.com/images/og-image.jpg"
  },
  "facebook": {
    "admins": "",
    "app_id": ""
  },
  "twitter": {
    "card": "summary",
    "site": "@"
  },
  "icon": {
    "favicon": "http://example.com/images/favicon.ico",
    "appleIcon": "http://example.com/images/apple-icon.ico",
    "appTitle": "site name"
  },
  "google": {
    "analyticsId": "UA-XXXXX-X"
  }
}
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
* `addScript`はjQueryプラグインのファイルをページごとに読み込みたい場合に記述します。（配列が空の場合は出力されません）

```ejs
<% var
pageTitle = "";
pageDescription = site.description;
pageClass = "top";
pageCurrent = "";
pageUrl = "index.html";
addPath = "";
ogpType = "website";
addScript = ['script1.js', 'script2.js', 'script3.js'];
-%>
```

develop/page/index.ejsは下層ページを作る場合に使用します（使用する場合はフォルダごとコピーして使いまわします。使用しない場合は_index.ejsとリネームしてください。）。変数は下記のように変更して使います。

```ejs
<% var
pageTitle = "page name";
pageDescription = "page description";
pageClass = "page1";
pageCurrent = "page1";
pageUrl = "page1/index.html";
addPath = "../";
ogpType = "article";
addScript = [];
-%>
```

### _header.ejs
_layout/_header.ejsには共通で使用するメインナビゲーションが定義されています。`a`タグにテキストを追加する場合のコードサンプルは[Gist](https://gist.github.com/manabuyasuda/fccdf47895871ae2e20d)を参照してください。

* `name`は各ページのフォルダ名を記述します。（index.ejsの`pageCurrent`と一致した場合は`.is-current`が付きます）
* `link`はトップページから見た相対パスを記述します。
* `ulClass`などは`ul`要素、`li`要素、`a`要素に指定するクラス名を記述します。

```ejs
<% var
// `name`にナビゲーションの名前を、`link`にトップページから見た相対パスを記述します。
// index.ejsの`pageCurrent`と`name`が同じ場合は`.is-current`が付きます。
// `a`タグ内にテキストを追加する場合のコード。https://gist.github.com/manabuyasuda/fccdf47895871ae2e20d
navs = [
  { name: "page1", link: "page1/index.html"},
  { name: "page2", link: "page2/index.html"},
  { name: "page3", link: "page3/index.html"},
]
// `ul`, `li`, `a`要素に記述するクラス名をそれぞれ定義します。
ulClass = "main-nav";
liClass = "main-nav__item";
aClass = "main-nav__link";
-%>

    <header>
      <nav>
        <ul class="<%= ulClass %>"><% navs.forEach(function(nav) { if(pageCurrent === nav.name) { %>
          <li class="<%= liClass %>">
            <a href="" class="<%= aClass %> is-current"><%= nav.name -%></a>
          </li><% } else if(pageCurrent === "") { %>
          <li class="<%= liClass %>">
            <a href="<%= nav.link %>" class="<%= aClass %>"><%= nav.name %></a>
          </li><% } else { %>
          <li class="<%= liClass %>">
            <a href="../<%= nav.link %>" class="<%= aClass %>"><%= nav.name %></a>
          </li><% }}); %>
        </ul>
      </nav>
    </header>
```

## assets
develop/ディレクトリは基本的にEJSファイルのために使用します。ですので、SassとJavaScriptと画像とjsonはdevelop/assets/ディレクトリにあります。

### images
imagesディレクトリは空の状態です。Gulpタスクを実行してもフォルダも生成されないので、仮の画像やOGP画像などを入れてからタスクを実行します。

### sass
sassディレクトリにはいくつかのオブジェクトやmixinなどが定義されています。例えばグリッドレイアウトやメディアクエリのmixinなどです。

2カラムのグリッドレイアウト。

```html
<div class="o-grid">
  <div class="o-grid__item u-8of12-md"></div>
  <div class="o-grid__item u-4of12-md"></div>
</div>
```

メディアクエリmixin。

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

SassはCSSにコンパイルされるときに「autoprefixer」でベンダープレフィックスの自動付与、「csscomb」で整形とプロパティの並び替えが実行されます。また、CSSファイルと同じディレクトリにsourcemapsが出力されます。

TODO: 必要最低限の機能だけを残す。ディレクトリ構造とよく使うmixin、汎用性のあるオブジェクトとヘルパークラスなど。

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
1. `gulp release`（EJSとSassのコンパイルとjsと画像のdest。画像は圧縮されます。）

いずれも`clean`タスクでreleaseディレクトリがあればいったん削除されます。

開発用のdevelopディレクトリにはassetsディレクトリがありますが、リリース用のreleaseディレクトリにはassetsディレクトリがありませんのでパスの指定に注意してください。
