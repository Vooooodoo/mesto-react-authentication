import React from 'react';
import PopupWithForm from './PopupWithForm';

function CardDeletPopup(props) {
  function handleSubmit(evt) {
    evt.preventDefault();

    props.onCardDelete();
  }

  return (
    <PopupWithForm
      id="card-delete-popup"
      title="Вы уверены?"
      btnText={props.isLoading ? 'Удаление...' : 'Да'}
      ariaLabel="Закрыть попап подтверждения удаления карточки."
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    />
  )
}

export default CardDeletPopup;
