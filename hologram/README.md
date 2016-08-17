# Hologram
Hologramを使用してスタイルガイドを生成します。

## hologram_config.yml
hologram_config.ymlにはHologramの設定が指定されています。パスの指定はこのファイルから見た、相対パスです。

* `source`はreleaseディレクトリの名前を変更した場合に、それにあわせて変更します。
* `css_include`はスタイルガイドを生成したいCSSファイルまでのパスを指定します。
* `destination`はスタイルガイドを出力するディレクトリを指定します。
* `global_title`はスタイルガイドのタイトルに使用されます。
* `documentation_assets`はスタイルガイドのテンプレートファイルなどを指定しています（変更する必要はありません）。
* `custom_markdown`はマークダウンを拡張するために指定しています（変更する必要はありません）。

```yml
# sourceにはパースしたいファイル（.cssや.scssなど）があるディレクトリを指定します。
source: ../develop/

# スタイルガイドを生成するCSSファイルの相対パスを指定します。
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
スタイルガイドはYAML（ヤムル）とMarkdownで.scssファイル内に記述します。`block`と指定している部分の`｀`はこのMarkdownファイルのシンタックスハイライトのためのもので、実際には半角です。

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


｀｀｀block
<p><span class="p-label">label</span></p>
<p><span class="p-label label--error">label</span></p>
｀｀｀

*/
```

* `title`はスタイルガイドでのブロックの最初の見出し（`<h1>`）になります
* `name`は見出しの`id`属性に使用されます。ページ内リンクに使用するのでユニークな名前にしてください。
* `categories`は書き出されるHTMLファイルのファイル名になります。カンマで区切ることで複数のカテゴリを指定することができます。

`block`で囲んだエリアはHTMLとシンタックスハイライトの両方が出力されます。

## index.md
develop/assets/css/index.mdはスタイルガイドのトップページになります。

スタイルガイドのコメントと同じように記述することができます。デフォルトではstyle.scssの内容を貼付けてあります。

## styleguide.css
hologram/template/css/styleguide.cssにはスタイルガイドで使用するスタイルが指定されています。develop/assets/css/object/scope/_styleguide.scssを作成し、スタイルガイド用のスタイルを書いていってもかまいません。

基本的に変更する必要はありませんが、`.hgt-container`にはスタイルガイドの`max-width`が指定されているので、サイトとあわせると確認しやすくなります。

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
HologramはRubyに依存しています。Rubyはインストールしておきます。

Gemのバージョン管理にはBundlerを使用します。インストールしていない場合は以下のコマンドを実行してください。

```bash
gem install bundler
```

Hologramのインストール。Gemfile.lockが生成されていれば完了しています。

```bash
bundle install
```

スタイルガイドの生成には`gulp`コマンドを用意しています。

```bash
gulp styleguide
```
