"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styles from '@/styles/contact.module.scss'

type CategoryFormProps = {
  pageTitle: string;
  onSubmit: (data:{name:string}) => void;
  buttonText: string;
  onDelete?: ()=> void;
  initialName: string;
}


export default function CategoryForm({
  pageTitle,
  onSubmit,
  buttonText,
  onDelete,
  initialName,
}: CategoryFormProps){

  const {
    register,
    handleSubmit,
    reset
  }=useForm<{name:string}>();

  useEffect(()=>{
    reset({ name:initialName});
  },[initialName,reset]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className={styles.title}>{pageTitle}</h1>
      <div className={styles.form__item}>
        <label className={styles.label}>カテゴリー名</label>
          <input className={styles.input}
          {...register('name')}
          />
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