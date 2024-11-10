"use client";
import { API_BASE_URL } from "@/app/constants";
import { FieldErrors, useForm } from "react-hook-form";


type FormData = {
  name: string,
  email:string,
  message: string,
};

const Contact: React.FC = () => {

  const { register, handleSubmit, formState: { isSubmitting, errors}, reset } = useForm<FormData>();

  const handleReset = () => {
    reset();
  }

  const onError = (err: FieldErrors<FormData>) => console.log(err);
  const onSubmit = async(data: FormData) => {
    try{
      const reponse = await fetch(`${API_BASE_URL}/contacts`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await reponse.json();
      console.log('送信成功！', result);
      alert('送信しました！');
      reset();
    } catch (error) {
      console.log('送信エラー', error);
      alert('送信エラー');
    }
  }

  return(
    <div>
      <h1 className='title'>問合わせフォーム</h1>
      <form name='contactForm' onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className='form__item'>
          <label htmlFor='name'>お名前</label>
          <div className='form__input'>
            <input id='name' type='text'
              {...register('name',{
                required: '名前は必須入力です。',
                maxLength: {
                  value: 30,
                  message: '名前は30文字以内にしてください。'
                }
              })}
              disabled={isSubmitting}
            />
            <p className='error'>{errors.name?.message}</p>
          </div>
        </div>

        <div className='form__item'>
          <label htmlFor='email'>メールアドレス</label>
          <div className='form__input'>
            <input id='email' type='text'
              {...register('email',{
                required: 'メールアドレスは必須入力です。',
                pattern: {
                  value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/,
                  message: 'メールアドレスの形式が不正です。'
                }
              })}
              disabled={isSubmitting}
            />
            <p className='error'>{errors.email?.message}</p>
          </div>
        </div>
        <div className='form__item'>
          <label htmlFor='message'>本文</label>
          <div className='form__input'>
            <textarea id='message' rows={8}
              {...register('message',{
                required: '本文は必須入力です。',
                maxLength: {
                  value: 500,
                  message: '本文は500文字以内にしてください。'
                }
              })}
              disabled={isSubmitting}
            ></textarea>
            <p className='error'>{errors.message?.message}</p>
          </div>
        </div>
        <div className='form__btn'>
          <button className='submit' type='submit' disabled={isSubmitting}>送信</button>
          <button className='clear' type='button' onClick={handleReset} disabled={isSubmitting}>クリア</button>
        </div>
      </form>
    </div>
  );
}

export default Contact;