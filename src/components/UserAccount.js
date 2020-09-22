import React from 'react';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import CardDeletePopup from './CardDeletePopup';
import ImagePopup from './ImagePopup';
import SuccessTooltip from './SuccessTooltip';
import Spinner from './Spinner';
import api from '../utils/Api';
//* импортируем новые объекты контекста
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardsContext } from '../contexts/CardsContext';

function UserAccount(props) {
  //* хуки, управляющие внутренним состоянием, начальное значение false
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isCardDeletePopupOpen, setIsCardDeletePopupOpen] = React.useState(false);
  const [isSuccessTooltipOpen, setIsSuccessTooltipOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isPopupLoading, setIsPopupLoading] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState();
  const [selectedForDeleteCard, setSelectedForDeleteCard] = React.useState();

  const [currentUser, setCurrentUser] = React.useState({});
  const [initialCards, setCards] = React.useState([]);

  const history = useHistory();

  //* хук с побочным эффектом, который будет вызван когда компонент будет смонтирован или обновлён
  React.useEffect(() => {
    setIsLoading(true);

    api.get('/users/me')
      //* eсли запрос выполнен успешно, сработает обработчик then с описанием последующих действий
      //* как получим с сервера информацию - передадим её в соответствующую переменную состояния
      .then((result) => {
        //* result - это объект на сервере с информацией о пользователе
        setCurrentUser(result);
      })

      .catch((error) => {
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsLoading(false);
      });

    api.get('/cards')
      //* result - это полученный с сервера массив объектов с данными всех карточек
      .then((result) => {
        //* урезали result до шести карточек и записали этот массив в переменную состояния cards
        setCards(result.slice(0, 6));
      })

      .catch((error) => {
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  //* вторым аргументом функции передали зависимость с пустым массивом,
  //* чтобы эффект был вызван всего один раз, при монтировании компонента

  React.useEffect(() => {
    function handleEsc(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }

    //* добавим лисенер при монтировании компонента,
    //* стэйт которого указан в массиве зависимостей этого хука
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('keydown', handleEsc); //* удалили лисенер при размонтировании компонента
    };
  },
  [
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isCardDeletePopupOpen,
    isSuccessTooltipOpen,
  ]);

  React.useEffect(() => {
    function handleOverlayClick(evt) {
      if (evt.target.classList.contains('popup')) { //* если клик произошел по оверлею - закрыть попап
        closeAllPopups();
      }
    }

    document.addEventListener('click', handleOverlayClick);

    return () => {
      document.removeEventListener('click', handleOverlayClick);
    };
  },
  [
    isEditAvatarPopupOpen,
    isEditProfilePopupOpen,
    isAddPlacePopupOpen,
    isCardDeletePopupOpen,
    isSuccessTooltipOpen,
  ]);

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardDeletePopupOpen(false);
    setIsSuccessTooltipOpen(false);
    setSelectedCard();
  }

  function handleEditAvatarClick() {
    //* изменим значение переменной внутреннего состояния на true, с помощью функции-сэттера
    setIsEditAvatarPopupOpen(true);
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
    //* проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((owner) => owner._id === currentUser._id);

    api.changeCardLikeStatus(card._id, isLiked)
      //* отправляем запрос в API на добавление или удаление лайка в зависимости от isLiked
      //* и получаем обновлённые данные карточки
      .then((newCard) => {
        //* сформируем новый массив карточек на основе имеющегося, подставив в него новую карточку
        const newCards = initialCards.map((item) => (item._id === card._id ? newCard : item));

        setCards(newCards); //* обновили переменную состояния и интерфейс изменился автоматически
      })

      .catch((error) => {
        console.log('Ошибка. Запрос не выполнен:', error);
      });
  }

  function handleCardDelete() {
    setIsPopupLoading(true);

    api.delete(`/cards/${selectedForDeleteCard._id}`)
      .then(() => {
        //* сформируем новый массив карточек на основе имеющегося,
        //* исключив из него удалённую карточку
        const newCards = initialCards.filter((item) => (item._id !== selectedForDeleteCard._id ? true : false));

        setCards(newCards);
        closeAllPopups();
      })

      .catch((error) => {
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsPopupLoading(false);
      });
  }

  function handleUpdateUser(userInfo) {
    setIsPopupLoading(true);

    api.patch('/users/me', userInfo) //* обновили на сервере информацию о пользователе, полученную из формы
      //* eсли запрос выполнен успешно, сработает обработчик then с описанием последующих действий
      .then((result) => {
        setCurrentUser(result); //* result - это объект на сервере с информацией о пользователе

        closeAllPopups();
      }) //* получили обратно информацию с сервера и добавили её на страницу

      .catch((error) => {
        console.log('Ошибка. Запрос не выполнен:', error);
      }) //* если что-то пошло не так, — например, отвалился интернет — сработает catch

      .finally(() => {
        setIsPopupLoading(false);
      });
  }

  function handleUpdateAvatar(avatarLink) {
    setIsPopupLoading(true);

    api.patch('/users/me/avatar', avatarLink) //* обновили на сервере ссылку на аватар, полученную из формы
      .then((result) => {
        setCurrentUser(result);

        closeAllPopups();
      })

      .catch((error) => {
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsPopupLoading(false);
      });
  }

  function handleAddPlaceSubmit(cardInfo) {
    setIsPopupLoading(true);

    api.post('/cards', cardInfo) //* добавили на сервере информацию о новой карточке, полученную из формы
      //* result - это возвращаемый с сервера объект, в котором хранится информация о новой карточке
      .then((result) => {
        //* обновим стейт intialCards с помощью,
        //* расширенной за счёт добавления новой карточки, копии текущего массива
        setCards([result, ...initialCards]);

        closeAllPopups();
      })

      .catch((error) => {
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsPopupLoading(false);
      });
  }

  function signOut() {
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}> {/* с помощью провайдера контекста распространили значение пропса value по всему дереву дочерних компонентов */}
      <CardsContext.Provider value={initialCards}>
        <Header
          children={
            <div>
              <p className="header__text">{props.userData}</p>
              <button className="header__button header__text" type="button" onClick={signOut}>Выйти</button>
            </div>
          }
        />
        {isLoading
          ? <Spinner />
          : <Main
              onEditAvatar={handleEditAvatarClick}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              cards={initialCards}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDeleteClick}
            />
        }
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
        <SuccessTooltip
          isOpen={isSuccessTooltipOpen}
          onClose={closeAllPopups}
        />
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default UserAccount;
