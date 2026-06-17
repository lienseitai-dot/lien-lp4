# 整体Lien LP

GitHub PagesへそのままアップロードできるLP一式です。

## 構成

- `index.html`: LP本体
- `styles.css`: デザインCSS
- `app.js`: CTAリンク、UTM引き継ぎ、FAQ開閉、計測タグ読込
- `thanks.html`: サンクスページ
- `assets/`: 写真素材とRetina対応WebP

## 実装方針

文字入りパネル画像は使用していません。

以下はHTML/CSSテキストとして実装しています。

- ファーストビュー見出し
- 初回体験価格 2,000円
- CTAボタン
- Before/After見出し
- 権威性
- 料金
- お悩み
- 選ばれる理由
- おすすめ対象
- 初回体験の流れ
- アクセス
- FAQ
- 口コミ
- 最終CTA

画像として使っているものは、人物写真、Before/After写真、院内写真、施術写真のみです。

## CTAリンクの変更

予約リンクは `index.html` 上部の `window.LIEN_LP_CONFIG.reservationUrl` で管理しています。

```html
reservationUrl: "https://reserve.quick-reserve.com/lien?..."
```

GoogleマップURLは同じ設定内の `googleMapUrl` を変更してください。

## 口コミの追加・削除

口コミは `index.html` の `.review-list` 内にある `.review-card` を1件ずつ編集します。

非表示にする場合は、対象カードに以下のどちらかを指定してください。

```html
data-display-review="false"
```

または

```html
class="review-card displayReview is-hidden"
```

## 画像品質

主要写真は `picture` + `srcset` で、スマホRetina向けに780px/1242px相当のWebPを使用しています。

CSSでは画像を無理に引き伸ばさず、以下の方針にしています。

- `img { width: 100%; height: auto; }`
- 写真カード内は `object-fit: cover` または `contain`
- 文字は画像化せずHTMLテキストで表示

## 公開方法

GitHub Pagesの公開ディレクトリに、ZIP内のファイルをそのまま上書きしてください。
