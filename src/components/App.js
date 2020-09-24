import React from 'react';
import {
  Route,
  Switch,
  Redirect,
  useHistory,
} from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Main from './Main';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import AddPlacePopup from './AddPlacePopup';
import CardDeletePopup from './CardDeletePopup';
import ImagePopup from './ImagePopup';
import SuccessTooltip from './SuccessTooltip';
import ErrorTooltip from './ErrorTooltip';
import Register from './Register';
import Login from './Login';
import Footer from './Footer';
import Spinner from './Spinner';
import api from '../utils/Api';
import * as mestoAuth from '../utils/mestoAuth';
//* импортируем новые объекты контекста
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardsContext } from '../contexts/CardsContext';

function App() {
  //* хуки, управляющие внутренним состоянием, начальное значение false
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isCardDeletePopupOpen, setIsCardDeletePopupOpen] = React.useState(false);
  const [isSuccessTooltipOpen, setIsSuccessTooltipOpen] = React.useState(false);
  const [isErrorTooltipOpen, setIsErrorTooltipOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isPopupLoading, setIsPopupLoading] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState();
  const [selectedForDeleteCard, setSelectedForDeleteCard] = React.useState();

  const [currentUser, setCurrentUser] = React.useState({});
  const [initialCards, setCards] = React.useState([]);

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  const [isNewUserRegistered, setIsNewUserRegistered] = React.useState(false);

  const [tooltipText, setTooltiptext] = React.useState('');

  const history = useHistory();

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsCardDeletePopupOpen(false);
    setIsSuccessTooltipOpen(false);
    setIsErrorTooltipOpen(false);
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
        setIsErrorTooltipOpen(true);
        console.log('Ошибка. Запрос не выполнен:', error);
      }); //* если что-то пошло не так, — например, отвалился интернет — сработает catch
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
        setIsErrorTooltipOpen(true);
        setIsCardDeletePopupOpen(false);
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
        setIsErrorTooltipOpen(true);
        setIsEditProfilePopupOpen(false);
        console.log('Ошибка. Запрос не выполнен:', error);
      })

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
        setIsErrorTooltipOpen(true);
        setIsEditAvatarPopupOpen(false);
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
        setIsErrorTooltipOpen(true);
        setIsAddPlacePopupOpen(false);
        console.log('Ошибка. Запрос не выполнен:', error);
      })

      .finally(() => {
        setIsPopupLoading(false);
      });
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleRegisterSubmit(email, password) {
    //* в качестве аргументов передадим переменные состояния, в которых значения инпутов формы
    mestoAuth.register(email, password)
      .then((res) => {
        //* если форма отправлена успешно, перенаправить пользователя на страницу авторизации
        if (res) {
          history.push('/sign-in');
          setIsNewUserRegistered(true);
        }
      })

      .catch((error) => {
        setIsErrorTooltipOpen(true);
        console.log('Ошибка. Запрос не выполнен:', error);
      });
  }

  function handleLoginSubmit(email, password) {
    if (!email || !password) {
      return;
    }

    mestoAuth.authorize(email, password)
      .then((data) => {
        if (data.token && isNewUserRegistered) {
          setUserEmail(email);
          handleLogin();
          history.push('/');
          setIsSuccessTooltipOpen(true);
          setIsNewUserRegistered(false);
        } else {
          setUserEmail(email);
          handleLogin();
          history.push('/');
        }
      })

      .catch((error) => {
        setIsErrorTooltipOpen(true);
        console.log('Ошибка. Запрос не выполнен:', error);
      });
  }

  //* если у пользователя есть токен в localStorage, эта функция проверит валидность токена
  function checkToken() {
    const jwt = localStorage.getItem('jwt');

    if (jwt) {
      mestoAuth.getContent(jwt)
        .then((res) => {
          if (res) {
            setUserEmail(res.data.email);
            setLoggedIn(true);
            history.push('/');
          }
        })

        .catch((error) => {
          setIsErrorTooltipOpen(true);
          console.log('Ошибка. Запрос не выполнен:', error);
        });
    }
  }

  function handleSignOut() {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    setUserEmail('');
    history.push('/sign-in');
  }

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
        setIsErrorTooltipOpen(true);
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
        setIsErrorTooltipOpen(true);
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
    isErrorTooltipOpen,
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
    isErrorTooltipOpen,
  ]);

  React.useEffect(() => {
    checkToken();
  }, [history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
    {/* с помощью провайдера контекста распространили значение пропса value */}
    {/* по всему дереву дочерних компонентов */}
      <CardsContext.Provider value={initialCards}>
      {isLoading
        ? <Spinner />
        : <>
            <Header
              loggedIn={loggedIn}
              userData={userEmail}
              onEscapeButton={handleSignOut}
            />
            <Switch>
              <ProtectedRoute
                exact path="/"
                component={Main}
                loggedIn={loggedIn}
                cards={initialCards}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDeleteClick}
              />

              <Route path="/sign-up">
                <Register onSubmitButton={handleRegisterSubmit}/>
              </Route>

              <Route path="/sign-in">
                <Login onSubmitButton={handleLoginSubmit}/>
              </Route>

              <Route>
                {loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' />}
                {/* перенаправили пользователя на путь, в зависимости от статуса его авторизации */}
              </Route>
            </Switch>
            <Footer />

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
            <ErrorTooltip
              isOpen={isErrorTooltipOpen}
              onClose={closeAllPopups}
            />
        </>
      }
      </CardsContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
