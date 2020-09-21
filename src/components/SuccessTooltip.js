import React from 'react';
import InfoTooltip from './InfoTooltip';
import tooltipLogo from '../images/popup__tooltip-logo_name_success.svg';

function SuccessTooltip(props) {
  return (
    <InfoTooltip
      isOpen={props.isOpen}
      onClose={props.onClose}
      tooltipLogo={tooltipLogo}
      tooltipText="Вы успешно зарегистрировались!"
    />
  )
}

export default SuccessTooltip;
