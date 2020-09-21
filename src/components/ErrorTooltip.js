import React from 'react';
import InfoTooltip from './InfoTooltip';
import tooltipLogo from '../images/popup__tooltip-logo_name_error.svg';

function ErrorTooltip(props) {
  return (
    <InfoTooltip
      isOpen={props.isOpen}
      onClose={props.onClose}
      tooltipLogo={tooltipLogo}
      tooltipText="Что-то пошло не так! Попробуйте ещё раз."
    />
  )
}

export default ErrorTooltip;