import React from 'react';
import Main from './Main';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import CardDeletePopup from './CardDeletePopup';
import ImagePopup from './ImagePopup';
import Spinner from './Spinner';
import api from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext'; //*импортировали новый объект контекста
import { CardsContext } from '../contexts/CardsContext';

function UserAccount() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false); //*хук, управляющий внутренним состоянием, начальное значение false
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isCardDeletePopupOpen, setIsCardDeletePopupOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isPopupLoading, setIsPopupLoading] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState();
  const [selectedForDeleteCard, setSelectedForDeleteCard] = React.useState();

  const [currentUser, setCurrentUser] = React.useState({});
  const [initialCards, setCards] = React.useState([]);

  React.useEffect(() => { //*хук с побочным эффектом, который будет вызван когда компонент будет смонтирован или обновлён
    setIsLoading(true);

    api.get('/users/me')
      .then((result) => { //*eсли запрос выполнен успешно, сработает обработчик then с описанием последующих действий
        setCurrentUser(result); //*result - это объект на сервере с информацией о пользователе
      }) //*получили с сервера информацию и передали её в соответствующую переменную состояния

      .catch((error) => {
        alert('Ошибка. Запрос не выполнен.');
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsLoading(false);
      });

    api.get('/cards')
      .then((result) => { //*result - это полученный с сервера массив объектов с данными всех карточек
        setCards(result.slice(0, 6)); //*урезали result до шести карточек и записали этот массив в переменную состояния cards
      })

      .catch((error) => {
        alert('Ошибка. Запрос не выполнен.');
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsLoading(false);
      });
  }, []); //*вторым аргументом функции передали зависимость с пустым массивом, чтобы эффект был вызван всего один раз, при монтировании компонента

  React.useEffect(() => {
    function handleEsc(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }

    document.addEventListener('keydown', handleEsc); //*добавили лисенер при монтировании компонента, стэйт которого указан в массиве зависимостей этого хука

    return () => {
      document.removeEventListener('keydown', handleEsc); //*удалили лисенер при размонтировании компонента
    }
  }, [isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, isCardDeletePopupOpen]);

  React.useEffect(() => {
    function handleOverlayClick(evt) {
      if (evt.target.classList.contains('popup')) { //*если клик произошел по оверлею - закрыть попап
        closeAllPopups();
      }
    }

    document.addEventListener('click', handleOverlayClick);

    return () => {
      document.removeEventListener('click', handleOverlayClick);
    }
  }, [isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, isCardDeletePopupOpen]);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true); //*изменили значение переменной внутреннего состояния на true, с помощью функции-сэттера
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardDeleteClick(card) {
    setSelectedForDeleteCard(card);
    setIsCardDeletePopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(owner => owner._id === currentUser._id); //*проверяем, есть ли уже лайк на этой карточке

    api.changeCardLikeStatus(card._id, isLiked)
      .then((newCard) => { //*отправили запрос в API на добавление или удаление лайка в зависимости от isLiked и получили обновлённые данные карточки
        const newCards = initialCards.map(item => item._id === card._id ? newCard : item); //*сформировали новый массив карточек на основе имеющегося, подставив в него новую карточку

        setCards(newCards); //*обновили переменную состояния и интерфейс изменился автоматически
      })

      .catch((error) => {
        alert('Ошибка. Запрос не выполнен.');
        console.log('Ошибка. Запрос не выполнен:', error);
      });
  }

  function handleCardDelete() {
    setIsPopupLoading(true);

    api.delete(`/cards/${selectedForDeleteCard._id}`)
      .then(() => {
        const newCards = initialCards.filter(item => item._id !== selectedForDeleteCard._id ? true : false); //*сформировали новый массив карточек на основе имеющегося, исключив из него удалённую карточку

        setCards(newCards);
        closeAllPopups();
      })

      .catch((error) => {
        alert('Ошибка. Запрос не выполнен.');
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsPopupLoading(false);
      });
  }

  function handleUpdateUser(userInfo) {
    setIsPopupLoading(true);

    api.patch('/users/me', userInfo) //*обновили на сервере информацию о пользователе, полученную из формы
      .then((result) => { //*eсли запрос выполнен успешно, сработает обработчик then с описанием последующих действий
        setCurrentUser(result); //*result - это объект на сервере с информацией о пользователе

        closeAllPopups();
      }) //*получили обратно информацию с сервера и добавили её на страницу

      .catch((error) => {
        alert('Ошибка. Запрос не выполнен.');
        console.log('Ошибка. Запрос не выполнен:', error);
      }) //*если что-то пошло не так, — например, отвалился интернет — сработает catch

      .finally(() => {
        setIsPopupLoading(false);
      });
  }

  function handleUpdateAvatar(avatarLink) {
    setIsPopupLoading(true);

    api.patch('/users/me/avatar', avatarLink) //*обновили на сервере ссылку на аватар, полученную из формы
      .then((result) => {
        setCurrentUser(result);

        closeAllPopups();
      })

      .catch((error) => {
        alert('Ошибка. Запрос не выполнен.');
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsPopupLoading(false);
      });
  }

  function handleAddPlaceSubmit(cardInfo) {
    setIsPopupLoading(true);

    api.post('/cards', cardInfo) //*добавили на сервере информацию о новой карточке, полученную из формы
      .then((result) => { //*result - это возвращаемый с сервера объект, в котором хранится информация о новой карточке
        setCards([result, ...initialCards]);  //*обновили стейт intialCards с помощью, расширенной за счёт добавления новой карточки, копии текущего массива

        closeAllPopups();
      })

      .catch((error) => {
        alert('Ошибка. Запрос не выполнен.');
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsPopupLoading(false);
      });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardDeletePopupOpen(false);
    setSelectedCard();
  }

  return (
    <CurrentUserContext.Provider value={currentUser}> {/*с помощью провайдера контекста распространили значение пропса value по всему дереву дочерних компонентов*/}
      <CardsContext.Provider value={initialCards}>
        {isLoading ? <Spinner /> : <Main
          onEditAvatar={handleEditAvatarClick}
          onEditProfile={handleEditProfileClick}
          onAddPlace={handleAddPlaceClick}
          cards={initialCards}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDeleteClick}
        />} {/*присвоили значения пропсам компонента Main*/}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isPopupLoading}
        />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isPopupLoading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isPopupLoading}
        />
        <CardDeletePopup
          isOpen={isCardDeletePopupOpen}
          onClose={closeAllPopups}
          onCardDelete={handleCardDelete}
          isLoading={isPopupLoading}
        />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default UserAccount;