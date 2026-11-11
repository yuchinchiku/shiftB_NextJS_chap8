"use client";
import styles from '@/styles/contact.module.scss'

type CategoryFormProps = {
  pageTitle: string;
  name: string;
  onChangeName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  buttonText: string;
  onDelete?: ()=> void;
}

export default function CategoryForm({
  pageTitle,
  name,
  onChangeName,
  onSubmit,
  buttonText,
  onDelete,
}: CategoryFormProps){
  return (
    <form onSubmit={onSubmit}>
      <h1 className={styles.title}>{pageTitle}</h1>
      <div className={styles.form__item}>
        <label className={styles.label}>カテゴリー名</label>
          <input className={styles.input}
            value={name}
            onChange={(e)=> onChangeName(e.target.value)} />
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