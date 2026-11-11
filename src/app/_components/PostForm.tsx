
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ChangeEvent } from "react";

import styles from "@/styles/contact.module.scss";
import { supabase } from "@/app/_libs/supabase";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ

type Category = {
  id: number;
  name: string;
};

type PostFormProps = {
  pageTitle: string;
  title: string;
  content: string;
  thumbnailImageKey: string;
  onSubmit: (e: React.FormEvent) => void;
  buttonText: string;
  onDelete?: () => void;

  onChangeTitle: (title: string) => void;
  onChangeContent: (content: string) => void;
  onChangeThumbnailImageKey: (thumbnailImageKey: string) => void;

  allCategories: Category[];
  categories: number[];
  onChangeCategories: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function PostForm({
  pageTitle,
  title,
  content,
  thumbnailImageKey,
  allCategories,
  categories,
  onChangeTitle,
  onChangeContent,
  onChangeThumbnailImageKey,
  onChangeCategories,
  onSubmit,
  buttonText,
  onDelete,
}: PostFormProps) {
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  );
  useEffect(() => {
    if (!thumbnailImageKey){
      setThumbnailImageUrl(null);
      return;
    }

    // アップロード時に取得したthumbnailImageKeyを用いて画像のURLを取得
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")
        .getPublicUrl(thumbnailImageKey);

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [thumbnailImageKey]);

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    // 画像が選択されていないのでreturn
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    // 選択された画像を取得
    const file = event.target.files[0];

    // ファイルパスを指定
    const filePath = `private/${uuidv4()}`;

    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    // アップロードに失敗したらエラーを表示して終了
    if (error) {
      alert(error.message);
      return;
    }

    // data.pathに画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    onChangeThumbnailImageKey(data.path);
  };

  return (
    <form onSubmit={onSubmit}>
      <h1 className={styles.title}>{pageTitle}</h1>

      <div className={styles.form__item}>
        <label className={styles.label}>タイトル</label>
        <div className={styles.form__input}>
          <input
            className={styles.input}
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.form__item}>
        <label className={styles.label}>内容</label>
        <div className={styles.form__input}>
          <textarea
            className={styles.textarea}
            value={content}
            rows={8}
            onChange={(e) => onChangeContent(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.form__item}>
        <label className={styles.label}>サムネイルURL</label>
        <div className={styles.form__input}>
          <input
            type="file"
            id="thumbnailImageKey"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>
      </div>
      {/* 画像の表示 */}
      {thumbnailImageUrl && (
        <div className="mt-2">
          <Image
            src={thumbnailImageUrl}
            alt="thumbnail"
            width={400}
            height={400}
          />
        </div>
      )}

      <div className={styles.form__item}>
        <label className={styles.label}>カテゴリ</label>
        <div className={styles.form__input}>
          {allCategories.map((cat) => (
            <label
              key={cat.id}
              style={{ display: "block", marginBottom: 6 }}
            >
              <input
                type="checkbox"
                className={styles.form__checkbox}
                checked={categories.includes(cat.id)}
                onChange={(e) => {
                  const id = cat.id;
                  onChangeCategories((prev) => {
                    const next = e.target.checked
                      ? prev.includes(id)
                        ? prev
                        : [...prev, id]
                      : prev.filter((i) => i !== id);

                    console.log("next:", next);
                    return next;
                  });
                }}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.form__btn}>
        <button className={styles.submit} type="submit">
          {buttonText}
        </button>

        {onDelete && (
          <button
            className={styles.delete}
            type="button"
            onClick={onDelete}
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
}
