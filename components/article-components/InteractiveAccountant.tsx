import { Theme, useTheme } from "@contexts/ThemeContext";
import styled from "styled-components";
import { lightenDarkenColor } from "@model/utils"
import { useEffect, useState } from "react";
import axios from 'axios'

const accounts = [
  {
    "name": "Pocket money",
    "desc": "Short-term money in the bank account (debit card).",
    "number": 101
  },
  {
    "number": 102,
    "desc": "Long-term money in the bank account.",
    "name": "Savings account",
  },
  {
    "number": 103,
    "desc": "All transactions that go to or from my stocks & funds account.",
    "name": "Stocks & Funds account",
  },
  {
    "number": 301,
    "desc": "External account where all income from Swedish student loan organization must be registered.",
    "name": "Student loans",
  },
  {
    "number": 303,
    "desc": "Account where all salary from Hello World! comes from.",
    "name": "Salary: Hello World!",
  },
  {
    "name": "Swish",
    "desc": "Transactions going in or out using Swish.",
    "number": 304
  },
  {
    "number": 305,
    "desc": "Account where all donations, scholarships or the like must be registered.",
    "name": "Other incomes",
  },
  {
    "name": "Grocery store",
    "desc": "Transactions linked to grocery purchases or other purchases at the grocery store.",
    "number": 401
  },
  {
    "number": 402,
    "desc": "Account for money spent on technology-related things or other interests.",
    "name": "Technology and interest",
  },
  {
    "number": 403,
    "desc": "Money spent on food at a restaurant or other places to eat.",
    "name": "Restaurants",
  },
  {
    "number": 404,
    "desc": "Account for money used to buy gifts.",
    "name": "Gifts",
  },
  {
    "number": 405,
    "desc": "Account for expenses related to alcohol gatherings or purchases of alcohol.",
    "name": "Alcohol",
  },
  {
    "number": 406,
    "desc": "Account for expenses for the purchase of medicines or other health-related purchases.",
    "name": "Pharmacy and health",
  },
  {
    "number": 407,
    "desc": "Account for payments of broadband bills etc.",
    "name": "Broadband",
  },
  {
    "number": 408,
    "desc": "Account for expenses for the purchase of school materials or course literature.",
    "name": "Various school materials",
  },
  {
    "number": 409,
    "desc": "Account for payments of electricity network invoices.",
    "name": "Electricity network",
  },
  {
    "number": 410,
    "desc": "Account for payments of electricity trade invoices.",
    "name": "Electricity trading",
  },
  {
    "number": 411,
    "name": "Coffee and snacks",
    "desc": "Account for expenses when buying coffee or other snacks.",
  },
  {
    "number": 412,
    "desc": "Account for recurring payments of home insurance and the like.",
    "name": "Insurance",
  },
  {
    "number": 413,
    "desc": "Account for expenses when buying e.g. furniture, kitchen utensils, etc.",
    "name": "Home decoration",
  },
  {
    "number": 414,
    "desc": "Account for the purchase of e.g. clothes, hairdressing, jewelry.",
    "name": "Clothes and beauty",
  },
  {
    "number": 415,
    "desc": "Account for expenses in connection with major trips to other cities or countries.",
    "name": "Travel",
  },
  {
    "number": 416,
    "desc": "Account for payments of train tickets.",
    "name": "Train",
  },
  {
    "number": 417,
    "desc": "Account for expenses incurred on experiences, e.g. spa or similar.",
    "name": "Experiences",
  },
  {
    "number": 501,
    "desc": "Account for the money spent on paying rent for an apartment or similar.",
    "name": "Accommodation rent",
  },
  {
    "number": 502,
    "desc": "Account for expenses for renting vehicles, e.g. car, electric scooter etc.",
    "name": "Vehicle rental",
  },
  {
    "number": 503,
    "desc": "Account for expenses linked to payment of public transport tickets or season tickets.",
    "name": "Public transport",
  }
]

const getAccountFromNumber = (num: number): any => {
  for(let i = 0; i < accounts.length; i++) {
    if(accounts[i].number === num) {
      return accounts[i]
    }
  }
}

const AccountantContainer = styled.div<{ theme: Theme}>`
  background-color: ${props => props.theme.backgroundAccent};
  padding: 20px;
  border-radius: 5px;

  & h3 {
    margin: 0;
    margin-block-start: 0 !important;
    margin-block-end: 0 !important;
  }

  & > div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  & > div:first-child {
    margin-bottom: 5px;
  }

  & > div:first-child > button {
    height: 25px;
  }
`

const InputWrapper = styled.div<{ theme: Theme}>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 50%;

  & input {
    margin-bottom: 3px;
    width: 50%;
    height: 20px;
    padding: 5px;
    font-size: 14px;
    color: ${props => props.theme.textColor};
    background-color: ${props => props.theme.onBackgrounDarker};

    &:focus {
      outline: none;
    }
  }

  & label {
    margin-bottom: 3px;
    margin-left: 5px;
  }

  & input[type="checkbox"] {
    width: 20px;
  }
`

const DisplayWrapper = styled.div<{ theme: Theme}>`
  width: 50%;
`

const InteractiveAccountant = () => {
    const { theme } = useTheme();

    const [amount, setAmount] = useState<number>(129)
    const [reference, setReference] = useState<string>("Coop")
    const [isOutcome, setIsOutcome] = useState<boolean>(true)
    const [isSwish, setIsSwish] = useState<boolean>(false)

    const [prediction, setPrediction] = useState({
      amount: 0,
      date: 0,
      reference: "",
      fromAccount: {
        number: 0,
        name: "",
        desc: ""
      },
      toAccount: {
        number: 0,
        name: "",
        desc: ""
      }
    })

    const getPrediction = () => {
      const url = "https://api.dcronqvist.se/v1/ai/accountant"

      const data = {
        amount: amount ? amount : 0,
        date_trans: 0,
        desc: reference,
        is_outcome: isOutcome,
        is_swish: isSwish,
        account_names: true
      }

      axios.post(url, data, {
        
      }).then(res => {

        const pred = {
          amount: res.data.amount,
          date: res.data.date_trans,
          reference: res.data.desc,
          fromAccount: getAccountFromNumber(res.data.from_account),
          toAccount: getAccountFromNumber(res.data.to_account)
        }

        setPrediction(pred)
      }).catch(err => { 
        console.log(err)
      })
    }

    useEffect(() => {
      getPrediction()
    }, [amount, reference, isOutcome, isSwish]);

    return (
        <AccountantContainer theme={theme}>
          <div>
            <h3>Examples:</h3>
            <button onClick={() => {
              setAmount(129)
              setReference("Coop")
              setIsOutcome(true)
              setIsSwish(false)
            }}>Pocket money {`>`} Grocery store</button>
            <button onClick={() => {
              setAmount(259)
              setReference("Reimbursement")
              setIsOutcome(false)
              setIsSwish(true)
            }}>Swish {`>`} Pocket money</button>
            <button onClick={() => {
              setAmount(3279)
              setReference("Hyra (Swedish for rent)")
              setIsOutcome(true)
              setIsSwish(false)
            }}>Pocket money {`>`} Accomodation rent</button>
          </div>
          <div>
            <InputWrapper theme={theme}>
              <span>
                <input id="amount" placeholder="amount" value={amount} type="number" onChange={(e) => setAmount(Number.parseFloat(e.target.value))}/>
                <label htmlFor="amount"><code>amount</code></label>
              </span>
              <span>
                <input id="ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder={"reference"} type="text"/>
                <label htmlFor="ref"><code>reference</code></label>
              </span>
              <span>
                <input id="is_outcome" checked={isOutcome} onChange={(e) => setIsOutcome(e.target.checked)} type="checkbox"/>
                <label htmlFor="is_outcome"><code>is_outcome</code></label>
              </span>
              <span>
                <input id="is_swish" checked={isSwish} onChange={(e) => setIsSwish(e.target.checked)} type="checkbox"/>
                <label htmlFor="is_swish"><code>is_swish</code></label>
              </span>
            </InputWrapper>
            <DisplayWrapper theme={theme}>
              {prediction.fromAccount.name} {`>`} {prediction.toAccount.name}
            </DisplayWrapper>
          </div>
        </AccountantContainer>
    )
}

export default InteractiveAccountant