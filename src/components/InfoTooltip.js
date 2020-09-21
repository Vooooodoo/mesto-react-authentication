import React from 'react';

function InfoTooltip(props) {
  return (
    <div className={props.isOpen ? 'popup popup_opened' : 'popup popup_closed'}>
      <div className="popup__form-container">
        <img className="popup__tooltip-logo" src={props.tooltipLogo} alt={props.tooltipLogoAlt} />
        <p className="popup__tooltip-text">{props.tooltipText}</p>
        <button className="popup__close popup__close_type_form-popup" type="button" aria-label="Закрыть окно с подсказкой." onClick={props.onClose}></button>
      </div>
    </div>
  );
}

export default InfoTooltip;