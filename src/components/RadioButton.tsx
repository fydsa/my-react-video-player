import { FC } from 'react';
import styled from 'styled-components';

type IPropsRadioButton = {
	name: string;
	value: number;
	onChange: (e: any) => void;
	checked: boolean;
};

const RadioButton: FC<IPropsRadioButton> = ({
	name,
	value,
	onChange,
	checked,
}) => {
	return (
		<RadioButtonContainer tabIndex={0}>
			<input
				type='radio'
				id={`radio-option-${name}`}
				value={value}
				name={name}
				checked={checked}
				aria-checked={checked}
				onChange={onChange}
			/>
			<label htmlFor={`radio-option-${name}`}>{name}</label>
		</RadioButtonContainer>
	);
};

export default RadioButton;

const RadioButtonContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	padding: 0.5em;
	label {
		padding: 0 0.7em;
		text-align: left;
		margin: 0 !important;
		font-size: 1em;
		line-height: 24px;
		font-weight: 400;
		color: #ffffff;
		cursor: pointer;
	}
	input[type='radio'] {
		-webkit-appearance: none;
		appearance: none;
		margin: 0;
		width: 1em;
		height: 1em;
		border-radius: 50%;
		transition: all 0.1s ease-in-out;
		cursor: pointer;
		::after {
			content: '';
			display: block;
			border-radius: 50%;
			width: 100%;
			height: 100%;
			background-color: var(--primary-gray-50);
		}
		:checked {
			::after {
				box-shadow: none;
				background-color: var(--primary-red-700);
			}
		}
		:focus {
			outline: 2px solid var(--primary-red-700);
		}
	}
	@media screen and (max-width: 575px) {
		label {
			padding: 0.5rem;
			/* width: calc(100% - 3rem); */
			font-size: 14px;
		}
		input[type='radio'] {
			width: 0.8em;
			height: 0.8em;
		}
	}
`;
