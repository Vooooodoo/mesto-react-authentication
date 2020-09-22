import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup(props) {
  //* записываем объект, возвращаемый хуком, в переменную,
  //* в которой окажется DOM-элемент с атрибутом ref
  const inputRef = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();

    props.onUpdateAvatar({
      //* получаем значение инпута с помощью рефа и свойства value,
      //* затем передаем его во внешний обработчик handleUpdateAvatar
      avatar: inputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      id="avatar-popup"
      title="Обновить аватар"
      btnText={props.isLoading ? 'Сохранение...' : 'Сохранить'}
      ariaLabel="Закрыть форму обновления аватара."
      children={
        <fieldset className="popup__fieldset">
          <input id="avatar-popup-input-link" name="link" className="popup__input-text" ref={inputRef} type="url" placeholder="Ссылка на новый аватар" required /> {/*указали элементу атрибут ref и получили прямой доступ к DOM-элементу*/}
          <span id="avatar-popup-input-link-error" className="popup__input-error popup__input-error_hide"></span>
        </fieldset>
      }
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      isLoading={props.isLoading}
    />
  );
}

export default EditAvatarPopup;
