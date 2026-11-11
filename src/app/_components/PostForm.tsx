"use client";
import styles from '@/styles/contact.module.scss'


type Category = {
  id: number;
  name: string;
}

type PostFormProps = {
  pageTitle: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  onSubmit: (e: React.FormEvent) => void;
  buttonText: string;
  onDelete?: ()=> void;

  onChangeTitle: (title: string) => void;
  onChangeContent: (content: string) => void;
  onChangeThumbnailUrl: (thumbnailUrl: string) => void;

  allCategories: Category[];
  categories: number[];
  onChangeCategories: React.Dispatch<React.SetStateAction<number[]>>;
}


export default function PostForm({
  pageTitle,
  title,
  content,
  thumbnailUrl,
  allCategories,
  categories,
  onChangeTitle,
  onChangeContent,
  onChangeThumbnailUrl,
  onChangeCategories,
  onSubmit,
  buttonText,
  onDelete,
}: PostFormProps){
  return (
    <form onSubmit={onSubmit}>
      <h1 className={styles.title}>{pageTitle}</h1>
      <div className={styles.form__item}>
        <label className={styles.label}>タイトル</label>
        <div className={styles.form__input}>
          <input className={styles.input} value={title} onChange={(e)=> onChangeTitle(e.target.value)} />
        </div>
      </div>
      <div className={styles.form__item}>
        <label className={styles.label}>内容</label>
        <div className={styles.form__input}>
          <textarea className={styles.textarea} value={content}rows={8}  onChange={(e)=> onChangeContent(e.target.value)} />
        </div>
      </div>
      <div className={styles.form__item}>
        <label className={styles.label}>サムネイルURL</label>
        <div className={styles.form__input}>
          <input className={styles.input} value={thumbnailUrl} onChange={(e)=> onChangeThumbnailUrl(e.target.value)} />
        </div>
      </div>
      <div className={styles.form__item}>
        <label className={styles.label}>カテゴリ</label>
        <div className={styles.form__input}>
          {allCategories.map((cat) => (
            <label key={cat.id} style={{ display: "block", marginBottom: 6 }}>
              <input type="checkbox" className={styles.form__checkbox}
                checked={categories.includes(cat.id)}
                onChange={(e) => {
                  const id = cat.id;
                  onChangeCategories((prev) => {
                    const next = e.target.checked
                    ?(prev.includes(id) ? prev : [...prev,id])
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
        <button className={styles.submit} type="submit">{buttonText}</button>
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