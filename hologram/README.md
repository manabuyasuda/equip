# Hologram
Hologramを使用してスタイルガイドを生成します。

## hologram_config.yml
hologram_config.ymlにはHologramの設定が指定されています。パスの指定はこのファイルから見た、相対パスです。

* `source`はreleaseディレクトリの名前を変更した場合に、それにあわせて変更します。
* `css_include`はスタイルガイドを生成したいCSSファイルまでのパスを指定します。
* `destination`はスタイルガイドのタイトルに使用されます。
* `documentation_assets`はスタイルガイドのテンプレートファイルなどを指定しています（変更する必要はありません）。
* `custom_markdown`はマークダウンを拡張するために指定しています（変更する必要はありません）。

```
# sourceにはパースしたいファイル（.cssや.scssなど）があるディレクトリを指定します。
source: ../release/css/

# スタイルガイドに読み込むCSSファイルを指定します。
# スタイルガイドを生成したいCSSファイルを指定します。
css_include:
  - '../release/css/style.css'

# スタイルガイドを出力するディレクトリを指定します。
destination: ../styleguide/

# スタイルガイドのタイトルを指定します。
global_title: Styleguide

# スタイルガイドのテンプレートになるファイルの入ったディレクトリを指定します。
documentation_assets: ./template/

# Hologramのマークダウンの機能（Redcarpe）を拡張するファイルです。
custom_markdown: markdown_renderer.rb
```

## スタイルガイドのコメント
スタイルガイドは.yml形式とMarkdownで.scssファイル内に記述します。

```
/*doc
---
title: button
name: button
categories: [object]
---

ここにはMarkdown形式でコメントを記述します。

* リスト
* を書くことも
* できます


```block
<p><span class="p-label">label</span></p>
<p><span class="p-label label--error">label</span></p>
```

*/
```

* `title`はスタイルガイドでのブロックの最初の見出し（`<h1>`）になります
* `name`は見出しの`id`属性に使用されます。ページ内リンクに使用するのでユニークな名前にしてください。
* `categories`は書き出されるHTMLファイルのファイル名になります。カンマで区切ることで複数のカテゴリを指定することができます。

`block`で囲んだエリアはHTMLとシンタックスハイライトの両方が出力されます。

## styleguide.css
hologram/template/css/styleguide.cssにはスタイルガイドで使用するスタイルが指定されています。

基本的に変更する必要はありませんが、`.hgt-container`にはスタイルガイドの`max-width`が指定されているので、サイトとあわせると確認しやすくなるかもしれません。

```css
/**
 * スタイルガイドページの横幅。
 * 実際のページのmax-widthとあわせてください。
 */
.hgt-container {
  max-width: 960px;
  margin: 0 auto;
}
```

## スタイルガイドを生成するコマンド
スタイルガイドの生成には`npm`コマンドを用意しています。

```bash
npm run styleguide
```