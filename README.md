# gulp-ejs-sass
静的ページを効率良く作るためのテンプレートです。

EJSを使っているので、共通部分の変更やページごとの上書きが簡単にできます。Sassの便利なオブジェクトやmixin付きです。画像の圧縮やライブリロードにも対応しています。

## ejs
develop/index.ejsがホームページになります。_layout/ディレクトリにある_head.ejsと_footer.ejsがテンプレートになります。基本的にindex.ejs以外は変更する必要はありません（必要のないmetaタグは削除しても大丈夫です）。

develop/assets/resources/site.jsonにサイト共通の値が指定されています。サイトの名前やOGPの指定などがありますので、最初に確認をして、変更してください。site.jsonは`site.name`のように名前を統一してあります。

```json
{
  "site": {
    "name": "site name",
    "desctiption": "site desctiption",
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

index.ejsには下記のように変数が指定されています。ページごとに指定することができます。index.ejsは`pageTitle`のように名前を統一してあります。

* `pageTitle`はそのページの名前を指定します
* `pageDesctiption`はそのページの説明を指定します
* `pageClass`は`body`要素にclassを指定できます
* `pageUrl`はmetaタグの絶対パスで使用されています
* `addPath`は下層ページで使用し、パスを追加したい場合に指定します
* `ogpType`はOGPで使用されていて、ホーム（トップ）ページはwebsite、それ以外の記事はarticleを指定します

```ejs
<% var
pageTitle = "top page";
pageDesctiption = site.desctiption;
pageClass = "top";
pageUrl = "index.html";
addPath = "";
ogpType = "website";
-%>
```

develop/page/index.ejsは下層ページを作る場合に使用します（使用しない場合は_index.ejsとリネームしてください）。変数は下記のように変更して使います。

```ejs
<% var
pageTitle = "page name";
pageDesctiption = "page description";
pageClass = "page";
pageUrl = "page/index.html";
addPath = "../";
ogpType = "article";
-%>
```

develop/page/をコピーして使いまわします。

TODO: jQueryプラグインのファイルを追加する場合の対処法を考える。現状ではcssはSassで1つのファイルに統合、jsは_footer.ejsファイルに一括で追加されます。

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

### js
JavaScriptはvendor/ディレクトリにjQueryとmodernizrが保存されています。処理としては連結や圧縮などもされません。

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
