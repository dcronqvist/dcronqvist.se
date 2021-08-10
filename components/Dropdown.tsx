import { Theme, useTheme } from "@contexts/ThemeContext"
import styled from "styled-components"


const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  color: inherit;
  background-color: inherit;
  padding: 6px;
  border: none;
  cursor: pointer;
  font-size: inherit;
`

const DropdownValue = styled.span<{theme: Theme}>`
  font-size: inherit;
  background-color: ${props => props.theme.primary};
`

const DropdownSelections = styled.div<{theme: Theme}>`
  display: none;
  position: absolute;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.4);
  z-index: 1;

  & ${DropdownValue} {
    text-decoration: none;
    display: block;
  }

  & ${DropdownValue}:hover {
    background-color: ${props => props.theme.lighterBackground};
  }
`

const DropdownWrapper = styled.div<{theme: Theme}>`
  position: relative;
  display: inline-block;
  font-size: 1.5rem;

  &:hover ${DropdownSelections} {
    display: block;
  }

  &:hover ${DropdownButton} {
    background-color: ${props => props.theme.lighterBackground};
  }
`

export type DDValue = {
  value: string;
  action: () => void;
}

const Dropdown = ({title, values, currentValue}: {title: string, values: DDValue[], currentValue: string}) => {
  const { theme } = useTheme()

  const mappedValues = values.filter(value => value.value != currentValue).map(value => {
    return <DropdownValue theme={theme} onClick={value.action} key={value.value}>{value.value}</DropdownValue>
  })

  return (
    <DropdownWrapper theme={theme}>
      <DropdownButton>{title}</DropdownButton>
      <DropdownSelections theme={theme}>
        {mappedValues}
      </DropdownSelections>
    </DropdownWrapper>
  )
}

export default Dropdown